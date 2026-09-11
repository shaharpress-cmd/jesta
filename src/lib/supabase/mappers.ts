import type {
  CategoryId,
  ChatThread,
  Jesta,
  JestaStatus,
  Message,
  Offer,
  Urgency,
  User,
} from "@/lib/types";

/** Approx user location for distance display (Tel Aviv center). */
const REF_LAT = 32.0853;
const REF_LNG = 34.7818;

export type ProfileRow = {
  id: string;
  name: string;
  avatar_url: string | null;
  rating: number | null;
  rating_count: number | null;
  verified_basic: boolean | null;
  bio: string | null;
  tags: string[] | null;
  given_count: number | null;
  requested_count: number | null;
  avg_response_min: number | null;
  help_categories: CategoryId[] | null;
  last_seen_at: string | null;
  terms_accepted_at: string | null;
};

export type JestaRow = {
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  author_id: string;
  location_label: string;
  lat: number | null;
  lng: number | null;
  urgency: Urgency;
  status: JestaStatus;
  created_at: string;
};

export type OfferRow = {
  id: string;
  jesta_id: string;
  user_id: string;
  message: string | null;
  created_at: string;
};

export type ThreadRow = {
  id: string;
  jesta_id: string;
  participant_a: string;
  participant_b: string;
  last_message_at: string;
};

export type MessageRow = {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
};

function haversineM(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function profileToUser(row: ProfileRow): User {
  const lastSeen = row.last_seen_at ? new Date(row.last_seen_at).getTime() : 0;
  const online = lastSeen > 0 && Date.now() - lastSeen < 15 * 60 * 1000;
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar_url || `https://i.pravatar.cc/150?u=${row.id}`,
    rating: Number(row.rating ?? 5),
    ratingCount: row.rating_count ?? 0,
    verified: Boolean(row.verified_basic),
    online,
    bio: row.bio ?? undefined,
    tags: row.tags ?? [],
    stats: {
      given: row.given_count ?? 0,
      requested: row.requested_count ?? 0,
      avgResponseMin: row.avg_response_min ?? 0,
    },
    helpCategories: row.help_categories ?? [],
    lastActive: online ? "עכשיו" : undefined,
    authProvider: "google",
    acceptedTermsAt: row.terms_accepted_at ?? undefined,
  };
}

export function jestaFromRow(
  row: JestaRow,
  offerIds: string[] = [],
  respondersCount = 0
): Jesta {
  const lat = row.lat ?? REF_LAT;
  const lng = row.lng ?? REF_LNG;
  const distanceM =
    row.lat != null && row.lng != null
      ? Math.round(haversineM(REF_LAT, REF_LNG, lat, lng))
      : 500;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    authorId: row.author_id,
    locationLabel: row.location_label,
    lat,
    lng,
    distanceM,
    urgency: row.urgency,
    status: row.status,
    createdAt: row.created_at,
    offerIds,
    respondersCount,
  };
}

export function offerFromRow(row: OfferRow): Offer {
  return {
    id: row.id,
    jestaId: row.jesta_id,
    userId: row.user_id,
    message: row.message ?? undefined,
    createdAt: row.created_at,
  };
}

export function threadFromRow(row: ThreadRow): ChatThread {
  return {
    id: row.id,
    jestaId: row.jesta_id,
    participantIds: [row.participant_a, row.participant_b],
    lastMessageAt: row.last_message_at,
    unreadCount: 0,
  };
}

export function messageFromRow(row: MessageRow): Message {
  return {
    id: row.id,
    threadId: row.thread_id,
    senderId: row.sender_id,
    text: row.body,
    createdAt: row.created_at,
    read: Boolean(row.read_at),
  };
}
