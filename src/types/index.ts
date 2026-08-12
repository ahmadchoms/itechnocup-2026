export interface WasteCategory {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: Date | string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  latitude?: any;
  longitude?: any;
  avatarUrl?: string | null;
  isAdmin: boolean;
  rating?: number;
}

export interface Listing {
  id: string;
  sellerId: string;
  categoryId: string;
  title: string;
  photoUrl: string;
  estimatedWeightKg?: number | null;
  quantity?: number | null;
  unit?: string | null;
  condition?: string | null;
  description?: string | null;
  estimatedPrice?: number | null;
  address?: string | null;
  latitude?: any;
  longitude?: any;
  status: "aktif" | "terjual" | "dihapus" | string;
  cvPredictedCategoryId?: string | null;
  cvConfidence?: number | null;
  isCvCorrected?: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  category: WasteCategory;
  seller: User;
  distanceKm?: number;
}

export interface WasteRequest {
  id: string;
  buyerId: string;
  categoryId: string;
  title: string;
  description?: string | null;
  quantityWanted?: number | null;
  unit?: string | null;
  offeredPrice: number;
  address?: string | null;
  latitude?: any;
  longitude?: any;
  status: "aktif" | "terpenuhi" | "dihapus" | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  category: WasteCategory;
  buyer: User;
}

export interface MatchItem {
  id: string;
  listingId: string;
  requestId: string;
  distanceKm: number;
  status?: string | null;
  matchedAt: Date | string;
  listing: Listing;
  request: WasteRequest;
}

export interface MessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  sentAt: Date | string;
}

export interface TransactionItem {
  id: string;
  conversationId?: string | null;
  listingId?: string | null;
  sellerId: string;
  buyerId: string;
  categoryId?: string | null;
  finalPrice: number;
  finalQuantity?: number | null;
  unit?: string | null;
  status: "menunggu_konfirmasi" | "selesai" | "dibatalkan" | string;
  completedAt?: Date | string | null;
  createdAt: Date | string;
  seller?: User;
  buyer?: User;
  category?: WasteCategory;
}

export interface ReviewItem {
  id: string;
  transactionId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string | null;
  createdAt: Date | string;
  reviewer: User;
}
