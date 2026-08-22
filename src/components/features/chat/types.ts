export interface ChatUser {
  id: string;
  fullName: string;
  email?: string;
  phone?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
}

export interface ChatListing {
  id: string;
  title: string;
  estimatedPrice?: number | null;
  estimatedWeightKg?: number | null;
  unit?: string | null;
  categoryId?: string;
  category?: { id: string; name: string } | null;
}

export interface ChatTransaction {
  id: string;
  status: "menunggu_konfirmasi" | "selesai" | "dibatalkan" | string;
  finalPrice: number;
  finalQuantity?: number | null;
  unit?: string | null;
  completedAt?: string | Date | null;
  createdAt: string | Date;
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
  request?: {
    id: string;
    offeredPrice?: number | null;
  } | null;
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
