import { userRepository, UserRepository } from "@/repositories/userRepository";

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
      ...user,
      latitude: user.latitude ? Number(user.latitude) : null,
      longitude: user.longitude ? Number(user.longitude) : null,
    };
    delete (safeUser as any).sellerTransactions;
    delete (safeUser as any).buyerTransactions;
    delete (safeUser as any).receivedReviews;
    delete (safeUser as any).listings;

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

    const formattedListings = (user.listings || []).map((l: any) => ({
      ...l,
      estimatedPrice: l.estimatedPrice ? Number(l.estimatedPrice) : null,
      estimatedWeightKg: l.estimatedWeightKg ? Number(l.estimatedWeightKg) : null,
      latitude: l.latitude ? Number(l.latitude) : null,
      longitude: l.longitude ? Number(l.longitude) : null,
      cvConfidence: l.cvConfidence ? Number(l.cvConfidence) : null,
    }));

    const activeListingsCount = formattedListings.filter((l: any) => l.status === "aktif").length;

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
      transactions: formattedTransactions,
      reviews: formattedReviews,
      buyerApplication: user.buyerApplication,
    };
  }

  async switchUserRole(userId: string, newRole: "seller" | "buyer") {
    if (newRole !== "seller" && newRole !== "buyer") {
      throw new Error("Invalid role");
    }

    const updatedUser = await this.repo.updateUser(userId, {
      activeRole: newRole,
    });

    return updatedUser;
  }
}

export const userService = new UserService();
