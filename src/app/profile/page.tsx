import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileClient } from "./ProfileClient";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const categories = await prisma.wasteCategory.findMany({
    orderBy: { name: "asc" },
  });

  // Gunakan user dari session, fallback ke demo user jika belum login
  const sessionUser = await getSessionUser();
  const targetEmail = sessionUser?.email ?? "ahmad@daurnusa.id";

  // Get user dengan data transaksi & review
  const user = await prisma.user.findFirst({
    where: { email: targetEmail },
    include: {
      sellerTransactions: {
        include: {
          category: true,
          buyer: true,
          listing: true,
        },
        orderBy: { createdAt: "desc" },
      },
      receivedReviews: {
        include: {
          reviewer: true,
        },
        orderBy: { createdAt: "desc" },
      },
      buyerApplication: true,
    },
  });

  if (!user) {
    return <div>User not found</div>;
  }


  // Compute metrics
  const completedTx = user.sellerTransactions.filter((t) => t.status === "selesai");
  const totalRevenue = completedTx.reduce((acc, t) => acc + Number(t.finalPrice), 0);
  const totalKgSold = completedTx.reduce((acc, t) => acc + (t.finalQuantity || 0), 0);

  const reviews = user.receivedReviews;
  const avgRating =
    reviews.length > 0
      ? Number(
          (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        )
      : 4.9;

  const formattedTransactions = user.sellerTransactions.map((t) => ({
    ...t,
    finalPrice: t.finalPrice ? Number(t.finalPrice) : 0,
    listing: t.listing ? {
      ...t.listing,
      estimatedPrice: t.listing.estimatedPrice ? Number(t.listing.estimatedPrice) : 0,
      estimatedWeightKg: t.listing.estimatedWeightKg ? Number(t.listing.estimatedWeightKg) : 0,
      latitude: t.listing.latitude ? Number(t.listing.latitude) : null,
      longitude: t.listing.longitude ? Number(t.listing.longitude) : null,
      cvConfidence: t.listing.cvConfidence ? Number(t.listing.cvConfidence) : null,
    } : null,
    buyer: t.buyer ? {
      ...t.buyer,
      latitude: t.buyer.latitude ? Number(t.buyer.latitude) : null,
      longitude: t.buyer.longitude ? Number(t.buyer.longitude) : null,
    } : null,
  }));

  const safeUser = {
    ...user,
    latitude: user.latitude ? Number(user.latitude) : null,
    longitude: user.longitude ? Number(user.longitude) : null,
  };
  // Prevent sending nested relation with Decimal to the client prop
  delete (safeUser as any).sellerTransactions;
  delete (safeUser as any).receivedReviews;

  const formattedReviews = user.receivedReviews.map((r) => ({
    ...r,
    reviewer: r.reviewer ? {
      ...r.reviewer,
      latitude: r.reviewer.latitude ? Number(r.reviewer.latitude) : null,
      longitude: r.reviewer.longitude ? Number(r.reviewer.longitude) : null,
    } : null,
  }));

  return (
    <AppShell categories={categories} sessionUser={safeUser as any}>
      <ProfileClient
        user={safeUser}
        stats={{
          totalRevenue,
          totalKgSold,
          avgRating,
          totalTransactionsCount: user.sellerTransactions.length,
        }}
        transactions={formattedTransactions}
        reviews={formattedReviews}
        buyerApplication={user.buyerApplication}
      />
    </AppShell>
  );
}
