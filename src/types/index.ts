import {
  CategoryRef,
  GeoLocation,
  ListingStatus,
  RequestStatus,
  TransactionCore,
} from "./common";

export * from "./common";
export * from "./admin";
export * from "./chat";
export * from "./profile";

export interface WasteCategory extends CategoryRef {
  description?: string | null;
  createdAt?: Date | string;
}

export interface User extends GeoLocation {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
  isAdmin: boolean;
  activeRole?: "seller" | "buyer";
  rating?: number;
}

export interface Listing extends GeoLocation {
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
  status: ListingStatus;
  cvPredictedCategoryId?: string | null;
  cvConfidence?: number | null;
  isCvCorrected?: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  category: WasteCategory;
  seller: User;
  distanceKm?: number;
}

export type UserRole = "guest" | "buyer" | "seller";

export interface BuyerProfile extends GeoLocation {
  id: string;
  fullName: string;
  avatarUrl?: string | null;
  avgRating: number;
  reviewCount: number;
  completedTxCount: number;
}

export interface WasteRequest extends GeoLocation {
  id: string;
  buyerId?: string;
  categoryId: string;
  title: string;
  description?: string | null;
  quantityWanted?: number | null;
  unit?: string | null;
  offeredPrice: number;
  address?: string | null;
  status?: RequestStatus;
  createdAt: Date | string;
  updatedAt?: Date | string;
  category?: WasteCategory | null;
  buyer?: BuyerProfile | User | null;
}

export interface RequestDetail extends WasteRequest {
  buyerId: string;
  status: string;
  buyer: BuyerProfile;
}

export interface SellerListing {
  id: string;
  title: string;
  categoryId: string;
  unit: string;
  estimatedWeightKg: number;
  estimatedPrice: number;
  quantity?: number;
  photoUrl?: string;
}

export interface MatchItem {
  id: string;
  listingId: string;
  requestId: string;
  distanceKm: number;
  status?: string | null;
  matchedAt: Date | string;
  listing: Listing;
  request: WasteRequest & { buyer: User; category: WasteCategory };
}

export interface MessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  sentAt: Date | string;
}

export interface TransactionItem extends TransactionCore {
  conversationId?: string | null;
  listingId?: string | null;
  sellerId: string;
  buyerId: string;
  categoryId?: string | null;
  completedAt?: Date | string | null;
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
