import { prisma } from "@/lib/prisma";
import { AdminDashboardClient } from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const usersCount = await prisma.user.count();
  const listings = await prisma.listing.findMany({ select: { estimatedWeightKg: true } });
  const requestsCount = await prisma.wasteRequest.count();
  const transactions = await prisma.transaction.findMany({
    select: { status: true, finalPrice: true },
  });

  const totalVolumeKg = listings.reduce((acc, l) => acc + (Number(l.estimatedWeightKg) || 0), 0);
  const totalTransactionValue = transactions
    .filter((t) => t.status === "selesai")
    .reduce((acc, t) => acc + Number(t.finalPrice), 0);

  return (
    <AdminDashboardClient
      stats={{
        totalUsers: usersCount,
        totalListings: listings.length,
        totalRequests: requestsCount,
        totalTransactions: transactions.length,
        totalVolumeKg,
        totalTransactionValue,
      }}
    />
  );
}
