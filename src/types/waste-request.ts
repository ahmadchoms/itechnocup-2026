export interface WasteCategory {
  id: string;
  name: string;
}

export interface WasteRequest {
  id: string;
  title: string;
  description?: string | null;
  address?: string | null;
  offeredPrice: number;
  quantityWanted?: number | null;
  unit: string;
  createdAt: string | Date;
  categoryId: string;
  category?: WasteCategory | null;
}

export type UserRole = "guest" | "buyer" | "seller";

export interface BuyerProfile {
  id: string;
  fullName: string;
  avatarUrl?: string | null;
  avgRating: number;
  reviewCount: number;
  completedTxCount: number;
  latitude?: number | null;
  longitude?: number | null;
}

export interface RequestDetail extends WasteRequest {
  buyerId: string;
  status: string;
  latitude?: number | null;
  longitude?: number | null;
  buyer: BuyerProfile;
}

export interface SellerListing {
  id: string;
  title: string;
  categoryId: string;
  unit: string;
  estimatedWeightKg: number;
  estimatedPrice: number;
}