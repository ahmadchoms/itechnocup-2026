import { prisma } from "@/lib/prisma";
import { AdminDashboardClient } from "@/components/features/admin/AdminDashboardClient";
import {
  AdminDashboardData,
  DashboardCategoryStat,
  DashboardPendingBuyer,
  DashboardRecentListing,
  DashboardTransaction,
} from "@/components/features/admin/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [
    users,
    listings,
    requests,
    transactions,
    categories,
    pendingBuyerApps,
  ] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        isBuyerApproved: true,
        activeRole: true,
      },
    }),
    prisma.listing.findMany({
      include: {
        category: true,
        seller: { select: { fullName: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.wasteRequest.findMany({
      select: {
        id: true,
        status: true,
      },
    }),
    prisma.transaction.findMany({
      include: {
        seller: { select: { fullName: true } },
        buyer: { select: { fullName: true } },
        listing: { select: { title: true } },
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.wasteCategory.findMany({
      include: {
        listings: {
          select: { estimatedWeightKg: true },
        },
        wasteRequests: {
          select: { id: true },
        },
      },
    }),
    prisma.buyerApplication.findMany({
      where: { status: "menunggu" },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

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

  const recentTransactions: DashboardTransaction[] = transactions.slice(0, 5).map((t) => ({
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

  const recentListings: DashboardRecentListing[] = listings.slice(0, 5).map((l) => ({
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

  const dashboardData: AdminDashboardData = {
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

  return <AdminDashboardClient data={dashboardData} />;
}
