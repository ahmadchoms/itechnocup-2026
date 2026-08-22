export interface ProfileUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
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

export type TransactionStatus = "selesai" | "menunggu_konfirmasi" | "dibatalkan" | string;

export interface ProfileTransaction {
  id: string;
  status: TransactionStatus;
  finalQuantity?: number | null;
  finalPrice: number;
  unit?: string | null;
  createdAt: string | Date;
  category?: { id?: string; name: string } | null;
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

export type BuyerApplicationStatus = "menunggu" | "disetujui" | "ditolak" | string;

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
  unit: string;
  status: "aktif" | "terjual" | "dihapus" | string;
  cvConfidence?: number | null;
  createdAt: string | Date;
  categoryId: string;
  category?: { id: string; name: string } | null;
}

export interface WasteCategoryOption {
  id: string;
  name: string;
}
