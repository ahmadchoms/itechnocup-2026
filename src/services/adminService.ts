import {
  adminRepository,
  AdminRepository,
} from "@/repositories/adminRepository";
import {
  AdminDashboardData,
  AdminListingItem,
  AdminRequestItem,
  AdminUserItem,
  CategoryItem,
  DashboardCategoryStat,
  DashboardPendingBuyer,
  DashboardRecentListing,
  DashboardTransaction,
  UpdateUserDTO,
} from "@/types";

export class AdminService {
  constructor(private repo: AdminRepository = adminRepository) {}

  async getDashboardStats(): Promise<AdminDashboardData> {
    const [
      users,
      listings,
      requests,
      transactions,
      categories,
      pendingBuyerApps,
    ] = await this.repo.getDashboardRawData();

    const totalUsers = users.length;
    const totalBuyersApproved = users.filter((u) => u.isBuyerApproved).length;
    const totalSellers = totalUsers - totalBuyersApproved;

    const totalListings = listings.length;
    const activeListingsCount = listings.filter((l) => l.status === "aktif").length;
    const totalVolumeKg = listings.reduce(
      (acc, l) => acc + (Number(l.estimatedWeightKg) || 0),
      0
    );

    const totalRequests = requests.length;
    const activeRequestsCount = requests.filter((r) => r.status === "aktif").length;

    const totalTransactions = transactions.length;
    const completedTransactions = transactions.filter((t) => t.status === "selesai");
    const completedTransactionsCount = completedTransactions.length;
    const totalTransactionValue = completedTransactions.reduce(
      (acc, t) => acc + Number(t.finalPrice),
      0
    );

    const listingsWithConfidence = listings.filter((l) => l.cvConfidence !== null);
    const avgAiConfidence =
      listingsWithConfidence.length > 0
        ? Number(
            (
              listingsWithConfidence.reduce(
                (acc, l) => acc + (Number(l.cvConfidence) || 0),
                0
              ) / listingsWithConfidence.length
            ).toFixed(1)
          )
        : 94.5;

    const categoryStats: DashboardCategoryStat[] = categories
      .map((cat) => {
        const catVolume = cat.listings.reduce(
          (acc, l) => acc + (Number(l.estimatedWeightKg) || 0),
          0
        );
        const percentage =
          totalVolumeKg > 0
            ? Number(((catVolume / totalVolumeKg) * 100).toFixed(1))
            : 0;

        return {
          id: cat.id,
          name: cat.name,
          listingsCount: cat.listings.length,
          requestsCount: cat.wasteRequests.length,
          totalVolumeKg: Number(catVolume.toFixed(1)),
          percentageOfVolume: percentage,
        };
      })
      .sort((a, b) => b.totalVolumeKg - a.totalVolumeKg);

    const recentTransactions: DashboardTransaction[] = transactions
      .slice(0, 5)
      .map((t) => ({
        id: t.id,
        finalPrice: Number(t.finalPrice),
        finalQuantity: t.finalQuantity,
        unit: t.unit,
        status: t.status,
        createdAt: t.createdAt.toISOString(),
        sellerName: t.seller.fullName,
        buyerName: t.buyer.fullName,
        listingTitle: t.listing?.title || null,
        categoryName: t.category?.name || null,
      }));

    const recentListings: DashboardRecentListing[] = listings
      .slice(0, 5)
      .map((l) => ({
        id: l.id,
        title: l.title,
        photoUrl: l.photoUrl,
        categoryName: l.category.name,
        sellerName: l.seller.fullName,
        estimatedWeightKg: l.estimatedWeightKg ? Number(l.estimatedWeightKg) : null,
        unit: l.unit,
        estimatedPrice: l.estimatedPrice ? Number(l.estimatedPrice) : null,
        status: l.status,
        createdAt: l.createdAt.toISOString(),
        cvConfidence: l.cvConfidence ? Number(l.cvConfidence) : null,
      }));

    const pendingBuyers: DashboardPendingBuyer[] = pendingBuyerApps.map((app) => ({
      id: app.id,
      userId: app.userId,
      fullName: app.user.fullName,
      email: app.user.email,
      address: app.address,
      ktpPhotoUrl: app.ktpPhotoUrl,
      outletPhotoUrl: app.outletPhotoUrl,
      createdAt: app.createdAt.toISOString(),
    }));

    return {
      stats: {
        totalUsers,
        totalSellers,
        totalBuyersApproved,
        totalListings,
        activeListingsCount,
        totalRequests,
        activeRequestsCount,
        totalTransactions,
        completedTransactionsCount,
        totalVolumeKg: Number(totalVolumeKg.toFixed(1)),
        totalTransactionValue,
        pendingBuyerApplicationsCount: pendingBuyerApps.length,
        avgAiConfidence,
      },
      recentTransactions,
      categoryStats,
      recentListings,
      pendingBuyers,
    };
  }

  async getAllListings(): Promise<{
    listings: AdminListingItem[];
    categories: CategoryItem[];
  }> {
    const [rawListings, rawCategories] = await Promise.all([
      this.repo.findManyListingsWithRelations(),
      this.repo.findManyCategories(),
    ]);

    const listings: AdminListingItem[] = rawListings.map((l) => ({
      id: l.id,
      sellerId: l.sellerId,
      categoryId: l.categoryId,
      title: l.title,
      photoUrl: l.photoUrl,
      estimatedWeightKg: l.estimatedWeightKg ? Number(l.estimatedWeightKg) : null,
      quantity: l.quantity,
      unit: l.unit,
      condition: l.condition,
      description: l.description,
      estimatedPrice: l.estimatedPrice ? Number(l.estimatedPrice) : null,
      address: l.address,
      latitude: l.latitude ? Number(l.latitude) : null,
      longitude: l.longitude ? Number(l.longitude) : null,
      status: l.status,
      cvConfidence: l.cvConfidence ? Number(l.cvConfidence) : null,
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
      category: {
        id: l.category.id,
        name: l.category.name,
      },
      seller: {
        id: l.seller.id,
        fullName: l.seller.fullName,
        email: l.seller.email,
        phone: l.seller.phone,
        avatarUrl: l.seller.avatarUrl,
      },
    }));

    const categories: CategoryItem[] = rawCategories.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
    }));

    return { listings, categories };
  }

  async getAllRequests(): Promise<{
    requests: AdminRequestItem[];
    categories: CategoryItem[];
  }> {
    const [rawRequests, rawCategories] = await Promise.all([
      this.repo.findManyRequestsWithRelations(),
      this.repo.findManyCategories(),
    ]);

    const requests: AdminRequestItem[] = rawRequests.map((r) => ({
      id: r.id,
      buyerId: r.buyerId,
      categoryId: r.categoryId,
      title: r.title,
      description: r.description,
      quantityWanted: r.quantityWanted,
      unit: r.unit || "kg",
      offeredPrice: Number(r.offeredPrice),
      address: r.address,
      latitude: r.latitude ? Number(r.latitude) : null,
      longitude: r.longitude ? Number(r.longitude) : null,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      category: {
        id: r.category.id,
        name: r.category.name,
      },
      buyer: {
        id: r.buyer.id,
        fullName: r.buyer.fullName,
        email: r.buyer.email,
        phone: r.buyer.phone,
        avatarUrl: r.buyer.avatarUrl,
      },
    }));

    const categories: CategoryItem[] = rawCategories.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
    }));

    return { requests, categories };
  }

  async getAllUsers(): Promise<AdminUserItem[]> {
    const rawUsers = await this.repo.findManyUsersWithActivity();

    return rawUsers.map((u) => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      phone: u.phone,
      address: u.address,
      latitude: u.latitude ? Number(u.latitude) : null,
      longitude: u.longitude ? Number(u.longitude) : null,
      avatarUrl: u.avatarUrl,
      isAdmin: u.isAdmin,
      isBuyerApproved: u.isBuyerApproved,
      activeRole: u.activeRole,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
      _count: u._count,
    }));
  }

  async toggleUserAdmin(userId: string, isAdmin: boolean) {
    if (!userId) {
      throw new Error("ID pengguna tidak valid");
    }
    return this.repo.toggleUserAdmin(userId, isAdmin);
  }

  async updateUser(userId: string, data: UpdateUserDTO) {
    if (!userId) {
      throw new Error("ID pengguna tidak valid");
    }
    if (data.email && !data.email.includes("@")) {
      throw new Error("Format email tidak valid");
    }
    return this.repo.updateUser(userId, data);
  }

  async deleteUser(userId: string) {
    if (!userId) {
      throw new Error("ID pengguna tidak valid");
    }
    return this.repo.deleteUserCascade(userId);
  }

  async moderateListing(listingId: string, status: "aktif" | "dihapus" | string) {
    if (!listingId) {
      throw new Error("ID listing tidak valid");
    }
    return this.repo.updateListingStatus(listingId, status);
  }

  async moderateRequest(requestId: string, status: "aktif" | "dibatalkan" | string) {
    if (!requestId) {
      throw new Error("ID permintaan tidak valid");
    }
    return this.repo.updateRequestStatus(requestId, status);
  }
}

export const adminService = new AdminService();
