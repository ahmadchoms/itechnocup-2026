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
    finalPrice: Number(t.finalPrice),
  }));

  return (
    <AppShell categories={categories}>
      <ProfileClient
        user={user}
        stats={{
          totalRevenue,
          totalKgSold,
          avgRating,
          totalTransactionsCount: user.sellerTransactions.length,
        }}
        transactions={formattedTransactions}
        reviews={user.receivedReviews}
      />
    </AppShell>
  );
}
