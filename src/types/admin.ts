// admin.ts
import { LucideIcon } from "lucide-react";
import {
  BuyerApplicationStatus,
  CategoryRef,
  GeoLocation,
  ListingStatus,
  RequestStatus,
  TransactionCore,
  UserRef,
} from "./common";

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

export interface DashboardTransaction extends TransactionCore {
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
  status: BuyerApplicationStatus;
  createdAt: string;
  updatedAt: string;
  user: UserRef & {
    isBuyerApproved?: boolean;
    activeRole?: string;
  };
}

export interface AdminListingItem extends GeoLocation {
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
  status: ListingStatus;
  cvConfidence: number | null;
  createdAt: string;
  updatedAt: string;
  category: CategoryRef;
  seller: UserRef;
}

export interface AdminUserItem extends GeoLocation {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  address: string | null;
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

export interface AdminRequestItem extends GeoLocation {
  id: string;
  buyerId: string;
  categoryId: string;
  title: string;
  description: string | null;
  quantityWanted: number | null;
  unit: string | null;
  offeredPrice: number;
  address: string | null;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  category: CategoryRef;
  buyer: UserRef;
}

export interface CategoryItem extends CategoryRef {
  description?: string | null;
}

export interface UpdateUserDTO {
  fullName?: string;
  email?: string;
  phone?: string | null;
  address?: string | null;
  isAdmin?: boolean;
  isBuyerApproved?: boolean;
}
