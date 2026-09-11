"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { User as AuthUser, Session } from "@supabase/supabase-js";
import {
  CURRENT_USER_ID,
  JESTAS as SEED_JESTAS,
  MESSAGES as SEED_MESSAGES,
  OFFERS as SEED_OFFERS,
  THREADS as SEED_THREADS,
  USERS as SEED_USERS,
} from "./data";
import { createClient, isSupabaseConfigured } from "./supabase/client";
import {
  jestaFromRow,
  messageFromRow,
  offerFromRow,
  profileToUser,
  threadFromRow,
  type JestaRow,
  type MessageRow,
  type OfferRow,
  type ProfileRow,
  type ThreadRow,
} from "./supabase/mappers";
import type {
  CategoryId,
  ChatThread,
  Jesta,
  Message,
  Offer,
  RadiusPreset,
  Urgency,
  User,
} from "./types";

interface CreateJestaInput {
  title: string;
  description: string;
  category: CategoryId;
  locationLabel: string;
  urgency: Urgency;
}

interface CompleteOnboardingInput {
  displayName: string;
  acceptedTerms: boolean;
}

interface StoreState {
  currentUserId: string;
  jestas: Jesta[];
  offers: Offer[];
  threads: ChatThread[];
  messages: Message[];
  radius: RadiusPreset;
  onlineOnly: boolean;
  users: User[];
  /** True when Supabase session is active and data is cloud-backed */
  isCloud: boolean;
  cloudReady: boolean;
  setCurrentUserId: (id: string) => void;
  setRadius: (r: RadiusPreset) => void;
  setOnlineOnly: (v: boolean) => void;
  createJesta: (input: CreateJestaInput) => Promise<Jesta>;
  offerHelp: (jestaId: string, message?: string) => Promise<Offer | null>;
  sendMessage: (threadId: string, text: string) => Promise<Message | null>;
  getOrCreateThread: (
    jestaId: string,
    otherUserId: string
  ) => Promise<ChatThread>;
  submitReport: (input: {
    jestaId?: string;
    reportedUserId?: string;
    reason: string;
  }) => Promise<void>;
  getUser: (id: string) => User | undefined;
  getJesta: (id: string) => Jesta | undefined;
  filteredJestas: Jesta[];
  currentUser: User;
  /**
   * Stub Google sign-in when Supabase env is missing.
   * Real OAuth is handled on /login via supabase.auth.signInWithOAuth.
   */
  signInWithGoogle: () => User;
  /** Demo fallback — pick a seed user and mark authProvider: 'demo' */
  signInAsDemo: (userId?: string) => User;
  /** Optional post-login step: display name + terms acceptance */
  completeOnboarding: (
    input: CompleteOnboardingInput
  ) => Promise<User | null>;
}

const StoreContext = createContext<StoreState | null>(null);

const RADIUS_METERS: Record<RadiusPreset, number | null> = {
  building: 20,
  "50m": 50,
  "500m": 500,
  "2km": 2000,
  "10km": 10000,
  "50km": 50000,
  "300km": 300000,
  all: null,
};

const GOOGLE_STUB_USER_ID = "u-google";
const LOCAL_PREFS_KEY = "jesta-store";

function makeGoogleStubUser(existing?: User): User {
  return {
    id: GOOGLE_STUB_USER_ID,
    name: existing?.name ?? "משתמש Google",
    avatar:
      existing?.avatar ?? "https://i.pravatar.cc/150?u=google-stub",
    rating: existing?.rating ?? 5.0,
    ratingCount: existing?.ratingCount ?? 0,
    verified: true,
    online: true,
    bio: existing?.bio,
    tags: existing?.tags ?? ["חדש בג׳סטה"],
    stats: existing?.stats ?? { given: 0, requested: 0, avgResponseMin: 0 },
    helpCategories: existing?.helpCategories ?? ["neighborhood", "errands"],
    distanceM: 0,
    lastActive: "עכשיו",
    authProvider: "google-stub",
    acceptedTermsAt: existing?.acceptedTermsAt,
  };
}

function displayNameFromAuth(user: AuthUser): string {
  const meta = user.user_metadata ?? {};
  return (
    (meta.full_name as string) ||
    (meta.name as string) ||
    (meta.user_name as string) ||
    user.email?.split("@")[0] ||
    "משתמש Google"
  );
}

function avatarFromAuth(user: AuthUser): string | null {
  const meta = user.user_metadata ?? {};
  return (
    (meta.avatar_url as string) ||
    (meta.picture as string) ||
    null
  );
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState(CURRENT_USER_ID);
  const [users, setUsers] = useState<User[]>(SEED_USERS);
  const [jestas, setJestas] = useState<Jesta[]>(SEED_JESTAS);
  const [offers, setOffers] = useState<Offer[]>(SEED_OFFERS);
  const [threads, setThreads] = useState<ChatThread[]>(SEED_THREADS);
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const [radius, setRadius] = useState<RadiusPreset>("2km");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  /** Force local/demo even if a Supabase cookie session exists */
  const [forceLocal, setForceLocal] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [cloudReady, setCloudReady] = useState(!isSupabaseConfigured());
  const loadingCloudRef = useRef(false);

  const isCloud =
    isSupabaseConfigured() && !!session?.user && !forceLocal;

  // Hydrate localStorage prefs / demo data
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_PREFS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.radius) setRadius(parsed.radius);
        if (typeof parsed.onlineOnly === "boolean")
          setOnlineOnly(parsed.onlineOnly);
        // Only restore entity state when staying on demo path
        if (!isSupabaseConfigured() || parsed.forceLocal) {
          if (parsed.forceLocal) setForceLocal(true);
          if (parsed.currentUserId) setCurrentUserId(parsed.currentUserId);
          if (Array.isArray(parsed.users) && parsed.users.length) {
            setUsers(parsed.users);
          }
          if (parsed.jestas) setJestas(parsed.jestas);
          if (parsed.offers) setOffers(parsed.offers);
          if (parsed.threads) setThreads(parsed.threads);
          if (parsed.messages) setMessages(parsed.messages);
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Persist — cloud mode only keeps UI prefs + forceLocal flag
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (isCloud) {
        localStorage.setItem(
          LOCAL_PREFS_KEY,
          JSON.stringify({ radius, onlineOnly, forceLocal: false })
        );
      } else {
        localStorage.setItem(
          LOCAL_PREFS_KEY,
          JSON.stringify({
            currentUserId,
            users,
            jestas,
            offers,
            threads,
            messages,
            radius,
            onlineOnly,
            forceLocal,
          })
        );
      }
    } catch {
      /* ignore */
    }
  }, [
    hydrated,
    isCloud,
    forceLocal,
    currentUserId,
    users,
    jestas,
    offers,
    threads,
    messages,
    radius,
    onlineOnly,
  ]);

  const upsertProfile = useCallback(async (authUser: AuthUser) => {
    const supabase = createClient();
    const name = displayNameFromAuth(authUser);
    const avatar_url = avatarFromAuth(authUser);
    const now = new Date().toISOString();

    // Prefer existing row so we do not overwrite display name / terms.
    const { data: existing } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          last_seen_at: now,
          avatar_url:
            (existing as ProfileRow).avatar_url || avatar_url,
        })
        .eq("id", authUser.id)
        .select("*")
        .single();
      if (error) {
        console.error("profile update:", error.message);
        return profileToUser(existing as ProfileRow);
      }
      return profileToUser(data as ProfileRow);
    }

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: authUser.id,
        name,
        avatar_url,
        verified_basic: true,
        last_seen_at: now,
      })
      .select("*")
      .single();
    if (error) {
      console.error("profile insert:", error.message);
      return {
        id: authUser.id,
        name,
        avatar: avatar_url || `https://i.pravatar.cc/150?u=${authUser.id}`,
        rating: 5,
        ratingCount: 0,
        verified: true,
        online: true,
        tags: ["חדש בג׳סטה"],
        stats: { given: 0, requested: 0, avgResponseMin: 0 },
        helpCategories: [] as CategoryId[],
        authProvider: "google" as const,
        lastActive: "עכשיו",
      };
    }
    return profileToUser(data as ProfileRow);
  }, []);

  const loadCloudData = useCallback(async (authUser: AuthUser) => {
    if (loadingCloudRef.current) return;
    loadingCloudRef.current = true;
    setCloudReady(false);
    try {
      const supabase = createClient();
      const me = await upsertProfile(authUser);

      const [profilesRes, jestasRes, offersRes, threadsRes, messagesRes] =
        await Promise.all([
          supabase.from("profiles").select("*"),
          supabase.from("jestas").select("*").order("created_at", {
            ascending: false,
          }),
          supabase.from("offers").select("*"),
          supabase.from("chat_threads").select("*").order("last_message_at", {
            ascending: false,
          }),
          supabase.from("messages").select("*").order("created_at", {
            ascending: true,
          }),
        ]);

      if (profilesRes.error) console.error(profilesRes.error.message);
      if (jestasRes.error) console.error(jestasRes.error.message);
      if (offersRes.error) console.error(offersRes.error.message);
      if (threadsRes.error) console.error(threadsRes.error.message);
      if (messagesRes.error) console.error(messagesRes.error.message);

      const profileUsers = (profilesRes.data as ProfileRow[] | null)?.map(
        profileToUser
      ) ?? [];
      // Ensure current user is present
      const mergedUsers = profileUsers.some((u) => u.id === me.id)
        ? profileUsers.map((u) => (u.id === me.id ? { ...u, ...me, online: true } : u))
        : [...profileUsers, me];

      const offerRows = (offersRes.data as OfferRow[] | null) ?? [];
      const mappedOffers = offerRows.map(offerFromRow);
      const offersByJesta = new Map<string, string[]>();
      for (const o of mappedOffers) {
        const list = offersByJesta.get(o.jestaId) ?? [];
        list.push(o.id);
        offersByJesta.set(o.jestaId, list);
      }

      const mappedJestas = ((jestasRes.data as JestaRow[] | null) ?? []).map(
        (row) => {
          const ids = offersByJesta.get(row.id) ?? [];
          return jestaFromRow(row, ids, ids.length);
        }
      );

      const mappedThreads = ((threadsRes.data as ThreadRow[] | null) ?? []).map(
        threadFromRow
      );
      const mappedMessages = (
        (messagesRes.data as MessageRow[] | null) ?? []
      ).map(messageFromRow);

      setUsers(mergedUsers);
      setJestas(mappedJestas);
      setOffers(mappedOffers);
      setThreads(mappedThreads);
      setMessages(mappedMessages);
      setCurrentUserId(authUser.id);
      setForceLocal(false);
    } finally {
      loadingCloudRef.current = false;
      setCloudReady(true);
    }
  }, [upsertProfile]);

  // Subscribe to Supabase auth
  useEffect(() => {
    if (!isSupabaseConfigured() || !hydrated) {
      setCloudReady(true);
      return;
    }

    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setSession(data.session);
      if (data.session?.user && !forceLocal) {
        void loadCloudData(data.session.user);
      } else {
        setCloudReady(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (next?.user) {
        setForceLocal(false);
        void loadCloudData(next.user);
      } else {
        // Signed out — restore seed demo baseline if no forced local demo yet
        setCloudReady(true);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
    // forceLocal intentionally omitted: initial session check reads current value;
    // demo sign-in sets forceLocal and skips cloud overwrite.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, loadCloudData]);

  const getUser = useCallback(
    (id: string) => users.find((u) => u.id === id),
    [users]
  );
  const getJesta = useCallback(
    (id: string) => jestas.find((j) => j.id === id),
    [jestas]
  );

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId) ?? users[users.length - 1],
    [currentUserId, users]
  );

  const filteredJestas = useMemo(() => {
    const maxM = RADIUS_METERS[radius];
    return jestas
      .filter((j) => j.status === "open")
      .filter((j) => (maxM === null ? true : j.distanceM <= maxM))
      .filter((j) => {
        if (!onlineOnly) return true;
        const author = users.find((u) => u.id === j.authorId);
        return author?.online;
      })
      .sort((a, b) => a.distanceM - b.distanceM);
  }, [jestas, radius, onlineOnly, users]);

  const signInWithGoogle = useCallback((): User => {
    setForceLocal(true);
    const existing = users.find((u) => u.id === GOOGLE_STUB_USER_ID);
    const next = makeGoogleStubUser(existing);
    setUsers((prev) => {
      if (prev.some((u) => u.id === GOOGLE_STUB_USER_ID)) {
        return prev.map((u) => (u.id === GOOGLE_STUB_USER_ID ? next : u));
      }
      return [...prev, next];
    });
    setCurrentUserId(GOOGLE_STUB_USER_ID);
    return next;
  }, [users]);

  const signInAsDemo = useCallback((userId: string = CURRENT_USER_ID): User => {
    setForceLocal(true);
    if (isSupabaseConfigured()) {
      // Soft local override — do not block real OAuth cookies permanently
      void createClient().auth.signOut().catch(() => undefined);
    }
    const seed =
      SEED_USERS.find((u) => u.id === userId) ??
      SEED_USERS[SEED_USERS.length - 1];
    const demoUser: User = { ...seed, authProvider: "demo" };
    setUsers((prev) => {
      // Prefer seed baseline for demo UX
      const base = SEED_USERS.map((u) =>
        u.id === demoUser.id ? demoUser : u
      );
      const extras = prev.filter(
        (u) => !SEED_USERS.some((s) => s.id === u.id) && u.id !== "u-google"
      );
      return [...base, ...extras];
    });
    setJestas(SEED_JESTAS);
    setOffers(SEED_OFFERS);
    setThreads(SEED_THREADS);
    setMessages(SEED_MESSAGES);
    setCurrentUserId(demoUser.id);
    setSession(null);
    return demoUser;
  }, []);

  const completeOnboarding = useCallback(
    async (input: CompleteOnboardingInput): Promise<User | null> => {
      if (!input.acceptedTerms) return null;
      const name = input.displayName.trim() || "משתמש Google";
      const acceptedTermsAt = new Date().toISOString();
      const base = users.find((u) => u.id === currentUserId);
      if (!base) return null;
      const updated: User = { ...base, name, acceptedTermsAt };

      if (isCloud) {
        const supabase = createClient();
        const { error } = await supabase
          .from("profiles")
          .update({ name, terms_accepted_at: acceptedTermsAt })
          .eq("id", currentUserId);
        if (error) console.error("onboarding profile update:", error.message);
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === currentUserId ? updated : u))
      );
      return updated;
    },
    [currentUserId, users, isCloud]
  );

  const createJesta = useCallback(
    async (input: CreateJestaInput): Promise<Jesta> => {
      if (isCloud) {
        if (!cloudReady) {
          throw new Error("CLOUD_NOT_READY");
        }
        const supabase = createClient();
        const authorId = session?.user?.id ?? currentUserId;
        if (!session?.user?.id || authorId.startsWith("u-")) {
          throw new Error("SESSION_NOT_SYNCED");
        }
        const { data, error } = await supabase
          .from("jestas")
          .insert({
            title: input.title,
            description: input.description,
            category: input.category,
            author_id: authorId,
            location_label: input.locationLabel,
            lat: 32.08,
            lng: 34.78,
            urgency: input.urgency,
            status: "open",
          })
          .select("*")
          .single();
        if (error || !data) {
          console.error("createJesta:", error?.message);
          throw new Error(error?.message ?? "createJesta failed");
        }
        const j = jestaFromRow(data as JestaRow, [], 0);
        setJestas((prev) => [j, ...prev]);
        return j;
      }

      const j: Jesta = {
        id: `j-${Date.now()}`,
        title: input.title,
        description: input.description,
        category: input.category,
        authorId: currentUserId,
        locationLabel: input.locationLabel,
        lat: 32.08,
        lng: 34.78,
        distanceM: 50,
        urgency: input.urgency,
        status: "open",
        createdAt: new Date().toISOString(),
        offerIds: [],
        respondersCount: 0,
      };
      setJestas((prev) => [j, ...prev]);
      return j;
    },
    [currentUserId, isCloud, cloudReady, session]
  );

  const offerHelp = useCallback(
    async (jestaId: string, message?: string): Promise<Offer | null> => {
      const existing = offers.find(
        (o) => o.jestaId === jestaId && o.userId === currentUserId
      );
      if (existing) return existing;

      if (isCloud) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("offers")
          .insert({
            jesta_id: jestaId,
            user_id: currentUserId,
            message: message ?? null,
          })
          .select("*")
          .single();
        if (error || !data) {
          console.error("offerHelp:", error?.message);
          return null;
        }
        const offer = offerFromRow(data as OfferRow);
        setOffers((prev) => [...prev, offer]);
        setJestas((prev) =>
          prev.map((j) =>
            j.id === jestaId
              ? {
                  ...j,
                  offerIds: [...j.offerIds, offer.id],
                  respondersCount: j.respondersCount + 1,
                }
              : j
          )
        );
        return offer;
      }

      const offer: Offer = {
        id: `o-${Date.now()}`,
        jestaId,
        userId: currentUserId,
        message,
        createdAt: new Date().toISOString(),
      };
      setOffers((prev) => [...prev, offer]);
      setJestas((prev) =>
        prev.map((j) =>
          j.id === jestaId
            ? {
                ...j,
                offerIds: [...j.offerIds, offer.id],
                respondersCount: j.respondersCount + 1,
              }
            : j
        )
      );
      return offer;
    },
    [currentUserId, offers, isCloud]
  );

  const getOrCreateThread = useCallback(
    async (jestaId: string, otherUserId: string): Promise<ChatThread> => {
      const found = threads.find(
        (t) =>
          t.jestaId === jestaId &&
          t.participantIds.includes(currentUserId) &&
          t.participantIds.includes(otherUserId)
      );
      if (found) return found;

      if (isCloud) {
        const supabase = createClient();
        // Check remote in case local state is stale
        const { data: remote } = await supabase
          .from("chat_threads")
          .select("*")
          .eq("jesta_id", jestaId);
        const match = ((remote as ThreadRow[] | null) ?? []).find(
          (t) =>
            (t.participant_a === currentUserId &&
              t.participant_b === otherUserId) ||
            (t.participant_a === otherUserId &&
              t.participant_b === currentUserId)
        );
        if (match) {
          const thread = threadFromRow(match);
          setThreads((prev) =>
            prev.some((t) => t.id === thread.id) ? prev : [thread, ...prev]
          );
          return thread;
        }

        const { data, error } = await supabase
          .from("chat_threads")
          .insert({
            jesta_id: jestaId,
            participant_a: currentUserId,
            participant_b: otherUserId,
            last_message_at: new Date().toISOString(),
          })
          .select("*")
          .single();
        if (error || !data) {
          console.error("getOrCreateThread:", error?.message);
          throw new Error(error?.message ?? "thread create failed");
        }
        const thread = threadFromRow(data as ThreadRow);
        setThreads((prev) => [thread, ...prev]);
        return thread;
      }

      const thread: ChatThread = {
        id: `t-${Date.now()}`,
        jestaId,
        participantIds: [currentUserId, otherUserId],
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0,
      };
      setThreads((prev) => [thread, ...prev]);
      return thread;
    },
    [threads, currentUserId, isCloud]
  );

  const sendMessage = useCallback(
    async (threadId: string, text: string): Promise<Message | null> => {
      if (!text.trim()) return null;

      if (isCloud) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("messages")
          .insert({
            thread_id: threadId,
            sender_id: currentUserId,
            body: text.trim(),
            read_at: new Date().toISOString(),
          })
          .select("*")
          .single();
        if (error || !data) {
          console.error("sendMessage:", error?.message);
          return null;
        }
        const msg = messageFromRow(data as MessageRow);
        setMessages((prev) => [...prev, msg]);
        await supabase
          .from("chat_threads")
          .update({ last_message_at: msg.createdAt })
          .eq("id", threadId);
        setThreads((prev) =>
          prev.map((t) =>
            t.id === threadId ? { ...t, lastMessageAt: msg.createdAt } : t
          )
        );
        return msg;
      }

      const msg: Message = {
        id: `m-${Date.now()}`,
        threadId,
        senderId: currentUserId,
        text: text.trim(),
        createdAt: new Date().toISOString(),
        read: true,
      };
      setMessages((prev) => [...prev, msg]);
      setThreads((prev) =>
        prev.map((t) =>
          t.id === threadId ? { ...t, lastMessageAt: msg.createdAt } : t
        )
      );
      return msg;
    },
    [currentUserId, isCloud]
  );

  const submitReport = useCallback(
    async (input: {
      jestaId?: string;
      reportedUserId?: string;
      reason: string;
    }): Promise<void> => {
      if (!isCloud) return;
      const supabase = createClient();
      const { error } = await supabase.from("reports").insert({
        reporter_id: currentUserId,
        jesta_id: input.jestaId ?? null,
        reported_user_id: input.reportedUserId ?? null,
        reason: input.reason,
      });
      if (error) console.error("submitReport:", error.message);
    },
    [currentUserId, isCloud]
  );

  const value: StoreState = {
    currentUserId,
    jestas,
    offers,
    threads,
    messages,
    radius,
    onlineOnly,
    users,
    isCloud,
    cloudReady,
    setCurrentUserId,
    setRadius,
    setOnlineOnly,
    createJesta,
    offerHelp,
    sendMessage,
    getOrCreateThread,
    submitReport,
    getUser,
    getJesta,
    filteredJestas,
    currentUser,
    signInWithGoogle,
    signInAsDemo,
    completeOnboarding,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
