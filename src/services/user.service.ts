import { userRepository, UserRepository } from "@/repositories/user.repository";

export class UserService {
  constructor(private repo: UserRepository = userRepository) {}

  async getUserProfile(targetEmail: string) {
    const user = await this.repo.findProfileByEmail(targetEmail);

    if (!user) {
      return null;
    }

    const isBuyer = user.activeRole === "buyer";
    const rawTxList = isBuyer ? user.buyerTransactions : user.sellerTransactions;

    const completedTx = rawTxList.filter((t) => t.status === "selesai");
    const totalRevenue = completedTx.reduce((acc, t) => acc + Number(t.finalPrice), 0);
    const totalKgSold = completedTx.reduce((acc, t) => acc + (t.finalQuantity || 0), 0);

    const reviews = user.receivedReviews;
    const avgRating =
      reviews.length > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
        : 4.9;

    const formattedTransactions = rawTxList.map((t: any) => ({
      ...t,
      finalPrice: t.finalPrice ? Number(t.finalPrice) : 0,
      listing: t.listing
        ? {
            ...t.listing,
            estimatedPrice: t.listing.estimatedPrice ? Number(t.listing.estimatedPrice) : 0,
            estimatedWeightKg: t.listing.estimatedWeightKg ? Number(t.listing.estimatedWeightKg) : 0,
            latitude: t.listing.latitude ? Number(t.listing.latitude) : null,
            longitude: t.listing.longitude ? Number(t.listing.longitude) : null,
            cvConfidence: t.listing.cvConfidence ? Number(t.listing.cvConfidence) : null,
          }
        : null,
      buyer: t.buyer
        ? {
            ...t.buyer,
            latitude: t.buyer.latitude ? Number(t.buyer.latitude) : null,
            longitude: t.buyer.longitude ? Number(t.buyer.longitude) : null,
          }
        : null,
      seller: t.seller
        ? {
            ...t.seller,
            latitude: t.seller.latitude ? Number(t.seller.latitude) : null,
            longitude: t.seller.longitude ? Number(t.seller.longitude) : null,
          }
        : null,
    }));

    const safeUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      latitude: user.latitude ? Number(user.latitude) : null,
      longitude: user.longitude ? Number(user.longitude) : null,
      avatarUrl: user.avatarUrl,
      isAdmin: user.isAdmin,
      isBuyerApproved: user.isBuyerApproved,
      activeRole: (user.activeRole as "seller" | "buyer") || "seller",
      createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
      updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : null,
    };

    const formattedReviews = user.receivedReviews.map((r) => ({
      ...r,
      comment: r.comment ?? "",
      reviewer: r.reviewer
        ? {
            ...r.reviewer,
            latitude: r.reviewer.latitude ? Number(r.reviewer.latitude) : null,
            longitude: r.reviewer.longitude ? Number(r.reviewer.longitude) : null,
          }
        : null,
    }));

    const formattedListings = (user.listings || []).map((l) => ({
      ...l,
      estimatedPrice: l.estimatedPrice ? Number(l.estimatedPrice) : null,
      estimatedWeightKg: l.estimatedWeightKg ? Number(l.estimatedWeightKg) : null,
      latitude: l.latitude ? Number(l.latitude) : null,
      longitude: l.longitude ? Number(l.longitude) : null,
      cvConfidence: l.cvConfidence ? Number(l.cvConfidence) : null,
    }));

    const formattedBuyerApplication = user.buyerApplication
      ? {
          ...user.buyerApplication,
          createdAt: user.buyerApplication.createdAt
            ? new Date(user.buyerApplication.createdAt).toISOString()
            : null,
          updatedAt: user.buyerApplication.updatedAt
            ? new Date(user.buyerApplication.updatedAt).toISOString()
            : null,
        }
      : null;

    const formattedWasteRequests = (user.wasteRequests || []).map((r: any) => ({
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
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
      updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : null,
      category: r.category ? { id: r.category.id, name: r.category.name } : null,
      matchCount: r.matches?.length || 0,
    }));

    const activeListingsCount = isBuyer
      ? formattedWasteRequests.filter((r) => r.status === "aktif").length
      : formattedListings.filter((l) => l.status === "aktif").length;

    return {
      user: safeUser,
      stats: {
        totalRevenue,
        totalKgSold,
        avgRating,
        totalTransactionsCount: rawTxList.length,
        activeListingsCount,
      },
      listings: formattedListings,
      wasteRequests: formattedWasteRequests,
      transactions: formattedTransactions,
      reviews: formattedReviews,
      buyerApplication: formattedBuyerApplication,
    };
  }

  async switchUserRole(userId: string, newRole: "seller" | "buyer") {
    if (newRole !== "seller" && newRole !== "buyer") {
      throw new Error("Role tidak valid");
    }

    const updatedUser = await this.repo.updateUser(userId, {
      activeRole: newRole,
    });

    return {
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      latitude: updatedUser.latitude ? Number(updatedUser.latitude) : null,
      longitude: updatedUser.longitude ? Number(updatedUser.longitude) : null,
      avatarUrl: updatedUser.avatarUrl,
      isAdmin: updatedUser.isAdmin,
      isBuyerApproved: updatedUser.isBuyerApproved,
      activeRole: (updatedUser.activeRole as "seller" | "buyer") || "seller",
    };
  }

  async updateProfile(userId: string, data: { fullName?: string; phone?: string | null; address?: string | null }) {
    const updated = await this.repo.updateUser(userId, data);
    return {
      id: updated.id,
      fullName: updated.fullName,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      avatarUrl: updated.avatarUrl,
      latitude: updated.latitude ? Number(updated.latitude) : null,
      longitude: updated.longitude ? Number(updated.longitude) : null,
      isAdmin: updated.isAdmin,
      isBuyerApproved: updated.isBuyerApproved,
      activeRole: (updated.activeRole as "seller" | "buyer") || "seller",
    };
  }
}

export const userService = new UserService();
