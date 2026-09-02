import { CategoryRef, GeoLocation, TransactionCore } from "./common";

export interface ChatUser extends GeoLocation {
  id: string;
  fullName: string;
  email?: string;
  phone?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
}

export interface ChatListing extends GeoLocation {
  id: string;
  title: string;
  estimatedPrice?: number | null;
  estimatedWeightKg?: number | null;
  unit?: string | null;
  categoryId?: string;
  category?: CategoryRef | null;
  cvConfidence?: number | null;
}

export interface ChatReviewItem {
  id: string;
  reviewerId: string;
  rating: number;
  comment?: string | null;
}

export interface ChatTransaction extends TransactionCore {
  completedAt?: string | Date | null;
  reviews?: ChatReviewItem[];
}

export interface ChatMessage {
  id: string;
  conversationId?: string;
  senderId: string;
  content: string;
  sentAt: string | Date;
  isRead?: boolean;
}

export interface ChatMatch {
  id: string;
  distanceKm?: number | null;
  listing?: ChatListing | null;
  request?: ({ id: string; offeredPrice?: number | null } & GeoLocation) | null;
}

export interface ChatConversation {
  id: string;
  sellerId: string;
  buyerId: string;
  createdAt: string | Date;
  seller?: ChatUser | null;
  buyer?: ChatUser | null;
  match?: ChatMatch | null;
  messages: ChatMessage[];
  transactions: ChatTransaction[];
}

export interface ChatClientProps {
  conversations: ChatConversation[];
  activeId?: string;
  sellerIdParam?: string;
  listingIdParam?: string;
  currentUserId?: string;
}
