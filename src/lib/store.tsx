"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CURRENT_USER_ID,
  JESTAS as SEED_JESTAS,
  MESSAGES as SEED_MESSAGES,
  OFFERS as SEED_OFFERS,
  THREADS as SEED_THREADS,
  USERS as SEED_USERS,
} from "./data";
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
  setCurrentUserId: (id: string) => void;
  setRadius: (r: RadiusPreset) => void;
  setOnlineOnly: (v: boolean) => void;
  createJesta: (input: CreateJestaInput) => Jesta;
  offerHelp: (jestaId: string, message?: string) => Offer | null;
  sendMessage: (threadId: string, text: string) => Message | null;
  getOrCreateThread: (jestaId: string, otherUserId: string) => ChatThread;
  getUser: (id: string) => User | undefined;
  getJesta: (id: string) => Jesta | undefined;
  filteredJestas: Jesta[];
  currentUser: User;
  /**
   * Stub Google sign-in (no OAuth keys yet).
   * Creates/reuses session user with authProvider: 'google-stub'.
   * Later: replace with Supabase Auth Google provider — see README.
   */
  signInWithGoogle: () => User;
  /** Demo fallback — pick a seed user and mark authProvider: 'demo' */
  signInAsDemo: (userId?: string) => User;
  /** Optional post-login step: display name + terms acceptance */
  completeOnboarding: (input: CompleteOnboardingInput) => User | null;
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

function makeGoogleStubUser(existing?: User): User {
  return {
    id: GOOGLE_STUB_USER_ID,
    name: existing?.name ?? "משתמש Google",
    avatar:
      existing?.avatar ??
      "https://i.pravatar.cc/150?u=google-stub",
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

  useEffect(() => {
    try {
      const raw = localStorage.getItem("jesta-store");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.currentUserId) setCurrentUserId(parsed.currentUserId);
        if (Array.isArray(parsed.users) && parsed.users.length) {
          setUsers(parsed.users);
        }
        if (parsed.jestas) setJestas(parsed.jestas);
        if (parsed.offers) setOffers(parsed.offers);
        if (parsed.threads) setThreads(parsed.threads);
        if (parsed.messages) setMessages(parsed.messages);
        if (parsed.radius) setRadius(parsed.radius);
        if (typeof parsed.onlineOnly === "boolean") setOnlineOnly(parsed.onlineOnly);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        "jesta-store",
        JSON.stringify({
          currentUserId,
          users,
          jestas,
          offers,
          threads,
          messages,
          radius,
          onlineOnly,
        })
      );
    } catch {
      /* ignore */
    }
  }, [
    hydrated,
    currentUserId,
    users,
    jestas,
    offers,
    threads,
    messages,
    radius,
    onlineOnly,
  ]);

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

  /**
   * MVP stub — simulates Google OAuth success without real keys.
   *
   * Later (Supabase Google provider):
   *   1. Enable Google in Supabase Auth → Providers
   *   2. Add NEXT_PUBLIC_SUPABASE_URL + ANON_KEY
   *   3. Replace this body with:
   *        await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: ... } })
   *   4. On auth callback, upsert profile and set session user
   */
  const signInWithGoogle = useCallback((): User => {
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

  const signInAsDemo = useCallback(
    (userId: string = CURRENT_USER_ID): User => {
      const seed = SEED_USERS.find((u) => u.id === userId) ?? SEED_USERS[SEED_USERS.length - 1];
      const demoUser: User = { ...seed, authProvider: "demo" };
      setUsers((prev) => {
        const idx = prev.findIndex((u) => u.id === demoUser.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...prev[idx], ...demoUser };
          return copy;
        }
        return [...prev, demoUser];
      });
      setCurrentUserId(demoUser.id);
      return demoUser;
    },
    []
  );

  const completeOnboarding = useCallback(
    (input: CompleteOnboardingInput): User | null => {
      if (!input.acceptedTerms) return null;
      const name = input.displayName.trim() || "משתמש Google";
      const acceptedTermsAt = new Date().toISOString();
      const base = users.find((u) => u.id === currentUserId);
      if (!base) return null;
      const updated: User = { ...base, name, acceptedTermsAt };
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUserId ? updated : u))
      );
      return updated;
    },
    [currentUserId, users]
  );

  const createJesta = useCallback(
    (input: CreateJestaInput): Jesta => {
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
    [currentUserId]
  );

  const offerHelp = useCallback(
    (jestaId: string, message?: string): Offer | null => {
      const existing = offers.find(
        (o) => o.jestaId === jestaId && o.userId === currentUserId
      );
      if (existing) return existing;
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
    [currentUserId, offers]
  );

  const getOrCreateThread = useCallback(
    (jestaId: string, otherUserId: string): ChatThread => {
      const found = threads.find(
        (t) =>
          t.jestaId === jestaId &&
          t.participantIds.includes(currentUserId) &&
          t.participantIds.includes(otherUserId)
      );
      if (found) return found;
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
    [threads, currentUserId]
  );

  const sendMessage = useCallback(
    (threadId: string, text: string): Message | null => {
      if (!text.trim()) return null;
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
    [currentUserId]
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
    setCurrentUserId,
    setRadius,
    setOnlineOnly,
    createJesta,
    offerHelp,
    sendMessage,
    getOrCreateThread,
    getUser,
    getJesta,
    filteredJestas,
    currentUser,
    signInWithGoogle,
    signInAsDemo,
    completeOnboarding,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
