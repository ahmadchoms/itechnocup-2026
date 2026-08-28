import { LucideIcon } from "lucide-react";

export interface AdminSessionUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  isAdmin?: boolean;
  activeRole?: string;
  address?: string | null;
  phone?: string | null;
}

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface CommandItem {
  id: string;
  title: string;
  category: "Navigasi" | "Aksi Cepat" | "Data";
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: "buyer" | "listing" | "transaction";
  href: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalBuyersApproved: number;
  totalListings: number;
  activeListingsCount: number;
  totalRequests: number;
  activeRequestsCount: number;
  totalTransactions: number;
  completedTransactionsCount: number;
  totalVolumeKg: number;
  totalTransactionValue: number;
  pendingBuyerApplicationsCount: number;
  avgAiConfidence: number;
}

export interface DashboardTransaction {
  id: string;
  finalPrice: number;
  finalQuantity: number | null;
  unit: string | null;
  status: string;
  createdAt: string;
  sellerName: string;
  buyerName: string;
  listingTitle: string | null;
  categoryName: string | null;
}

export interface DashboardCategoryStat {
  id: string;
  name: string;
  listingsCount: number;
  requestsCount: number;
  totalVolumeKg: number;
  percentageOfVolume: number;
}

export interface DashboardRecentListing {
  id: string;
  title: string;
  photoUrl: string;
  categoryName: string;
  sellerName: string;
  estimatedWeightKg: number | null;
  unit: string | null;
  estimatedPrice: number | null;
  status: string;
  createdAt: string;
  cvConfidence: number | null;
}

export interface DashboardPendingBuyer {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  address: string;
  ktpPhotoUrl: string;
  outletPhotoUrl: string;
  createdAt: string;
}

export interface AdminDashboardData {
  stats: DashboardStats;
  recentTransactions: DashboardTransaction[];
  categoryStats: DashboardCategoryStat[];
  recentListings: DashboardRecentListing[];
  pendingBuyers: DashboardPendingBuyer[];
}

export interface BuyerApplicationItem {
  id: string;
  userId: string;
  ktpPhotoUrl: string;
  outletPhotoUrl: string;
  npwp?: string | null;
  address: string;
  status: "menunggu" | "disetujui" | "ditolak" | string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone?: string | null;
    avatarUrl?: string | null;
    isBuyerApproved?: boolean;
    activeRole?: string;
  };
}

export interface AdminListingItem {
  id: string;
  sellerId: string;
  categoryId: string;
  title: string;
  photoUrl: string;
  estimatedWeightKg: number | null;
  quantity: number | null;
  unit: string | null;
  condition: string | null;
  description: string | null;
  estimatedPrice: number | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  status: "aktif" | "terjual" | "dihapus" | string;
  cvConfidence: number | null;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
  seller: {
    id: string;
    fullName: string;
    email: string;
    phone?: string | null;
    avatarUrl?: string | null;
  };
}

export interface AdminUserItem {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  avatarUrl: string | null;
  isAdmin: boolean;
  isBuyerApproved: boolean;
  activeRole: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    listings: number;
    wasteRequests: number;
    sellerTransactions: number;
    buyerTransactions: number;
  };
}

export interface AdminRequestItem {
  id: string;
  buyerId: string;
  categoryId: string;
  title: string;
  description: string | null;
  quantityWanted: number | null;
  unit: string | null;
  offeredPrice: number;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  status: "aktif" | "terpenuhi" | "dibatalkan" | string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
  buyer: {
    id: string;
    fullName: string;
    email: string;
    phone?: string | null;
    avatarUrl?: string | null;
  };
}
