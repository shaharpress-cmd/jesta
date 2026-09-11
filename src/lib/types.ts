export type CategoryId =
  | "fuel"
  | "moving"
  | "home"
  | "errands"
  | "garden"
  | "pets"
  | "digital"
  | "neighborhood"
  | "other";

export interface Category {
  id: CategoryId;
  label: string;
  shortLabel: string;
  emoji: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  ratingCount: number;
  verified: boolean;
  online: boolean;
  bio?: string;
  tags: string[];
  stats: {
    given: number;
    requested: number;
    avgResponseMin: number;
  };
  helpCategories: CategoryId[];
  distanceM?: number;
  lastActive?: string;
}

export type Urgency = "now" | "today" | "flexible";
export type JestaStatus = "open" | "in_progress" | "done" | "cancelled";

export interface Jesta {
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  authorId: string;
  locationLabel: string;
  lat: number;
  lng: number;
  distanceM: number;
  urgency: Urgency;
  status: JestaStatus;
  createdAt: string;
  offerIds: string[];
  respondersCount: number;
}

export interface Offer {
  id: string;
  jestaId: string;
  userId: string;
  message?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface ChatThread {
  id: string;
  jestaId: string;
  participantIds: [string, string];
  lastMessageAt: string;
  unreadCount: number;
}

export type RadiusPreset =
  | "building"
  | "50m"
  | "500m"
  | "2km"
  | "10km"
  | "50km"
  | "300km"
  | "all";

export interface RadiusOption {
  id: RadiusPreset;
  label: string;
  meters: number | null;
}
