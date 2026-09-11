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
  USERS,
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

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState(CURRENT_USER_ID);
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
  }, [hydrated, currentUserId, jestas, offers, threads, messages, radius, onlineOnly]);

  const getUser = useCallback((id: string) => USERS.find((u) => u.id === id), []);
  const getJesta = useCallback(
    (id: string) => jestas.find((j) => j.id === id),
    [jestas]
  );

  const currentUser = useMemo(
    () => USERS.find((u) => u.id === currentUserId) ?? USERS[USERS.length - 1],
    [currentUserId]
  );

  const filteredJestas = useMemo(() => {
    const maxM = RADIUS_METERS[radius];
    return jestas
      .filter((j) => j.status === "open")
      .filter((j) => (maxM === null ? true : j.distanceM <= maxM))
      .filter((j) => {
        if (!onlineOnly) return true;
        const author = USERS.find((u) => u.id === j.authorId);
        return author?.online;
      })
      .sort((a, b) => a.distanceM - b.distanceM);
  }, [jestas, radius, onlineOnly]);

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
    users: USERS,
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
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
