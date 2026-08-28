export interface GeoLocation {
  latitude?: number | null;
  longitude?: number | null;
}

export interface CategoryRef {
  id: string;
  name: string;
}

export interface UserRef {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
}

export type ListingStatus = "aktif" | "terjual" | "dihapus" | string;
export type RequestStatus =
  | "aktif"
  | "terpenuhi"
  | "dibatalkan"
  | "dihapus"
  | string;
export type TransactionStatus =
  | "menunggu_konfirmasi"
  | "selesai"
  | "dibatalkan"
  | string;
export type BuyerApplicationStatus =
  | "menunggu"
  | "disetujui"
  | "ditolak"
  | string;

export interface TransactionCore {
  id: string;
  status: TransactionStatus;
  finalPrice: number;
  finalQuantity?: number | null;
  unit?: string | null;
  createdAt: string | Date;
}
