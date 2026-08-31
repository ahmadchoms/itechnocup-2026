import {
  BuyerApplicationStatus,
  CategoryRef,
  TransactionCore,
  TransactionStatus,
} from "./common";

export interface ProfileUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  avatarUrl?: string | null;
  activeRole: "seller" | "buyer";
  isBuyerApproved: boolean;
}

export interface ProfileStats {
  totalRevenue: number;
  totalKgSold: number;
  avgRating: number;
  totalTransactionsCount: number;
  activeListingsCount?: number;
}

export type { TransactionStatus };

export interface ProfileTransaction extends Omit<TransactionCore, "status"> {
  status: TransactionStatus;
  category?: CategoryRef | null;
  buyer?: { fullName: string } | null;
  seller?: { fullName: string } | null;
}

export interface ProfileReview {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string | Date;
  reviewer?: { fullName: string; avatarUrl?: string | null } | null;
}

export type { BuyerApplicationStatus };

export interface BuyerApplication {
  id?: string;
  status: BuyerApplicationStatus;
  ktpPhotoUrl?: string;
  outletPhotoUrl?: string;
  npwp?: string | null;
  address?: string;
}

export interface ProfileListing {
  id: string;
  title: string;
  description?: string | null;
  photoUrl: string;
  estimatedWeightKg?: number | null;
  estimatedPrice?: number | null;
  unit?: string | null;
  status: "aktif" | "terjual" | "dihapus" | string;
  cvConfidence?: number | null;
  createdAt: string | Date;
  categoryId: string;
  category?: CategoryRef | null;
}

export interface ProfileWasteRequest {
  id: string;
  buyerId: string;
  categoryId: string;
  title: string;
  description?: string | null;
  quantityWanted?: number | null;
  unit?: string | null;
  offeredPrice: number;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: "aktif" | "terpenuhi" | "dihapus" | string;
  createdAt: string | Date | null;
  updatedAt: string | Date | null;
  category?: CategoryRef | null;
  matchCount?: number;
}

export type WasteCategoryOption = CategoryRef;

