import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { AdminClient } from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const categories = await prisma.wasteCategory.findMany({
    orderBy: { name: "asc" },
  });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const listings = await prisma.listing.findMany({
    include: { seller: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  const requests = await prisma.wasteRequest.findMany({
    include: { buyer: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  const transactions = await prisma.transaction.findMany({
    include: { seller: true, buyer: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  const totalVolumeKg = listings.reduce((acc, l) => acc + (Number(l.estimatedWeightKg) || 0), 0);
  const totalTransactionValue = transactions
    .filter((t) => t.status === "selesai")
    .reduce((acc, t) => acc + Number(t.finalPrice), 0);

  const formattedListings = listings.map((l) => ({
    ...l,
    estimatedPrice: l.estimatedPrice ? Number(l.estimatedPrice) : null,
    estimatedWeightKg: l.estimatedWeightKg ? Number(l.estimatedWeightKg) : null,
  }));

  const formattedRequests = requests.map((r) => ({
    ...r,
    offeredPrice: Number(r.offeredPrice),
  }));

  return (
    <AppShell categories={categories}>
      <AdminClient
        stats={{
          totalUsers: users.length,
          totalListings: listings.length,
          totalRequests: requests.length,
          totalTransactions: transactions.length,
          totalVolumeKg,
          totalTransactionValue,
        }}
        initialUsers={users}
        initialListings={formattedListings}
        initialRequests={formattedRequests}
      />
    </AppShell>
  );
}
