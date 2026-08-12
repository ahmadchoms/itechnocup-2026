import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { RequestsClient } from "./RequestsClient";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const categories = await prisma.wasteCategory.findMany({
    orderBy: { name: "asc" },
  });

  const requests = await prisma.wasteRequest.findMany({
    where: { status: "aktif" },
    include: {
      category: true,
      buyer: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = requests.map((r) => ({
    ...r,
    offeredPrice: Number(r.offeredPrice),
    latitude: r.latitude ? Number(r.latitude) : null,
    longitude: r.longitude ? Number(r.longitude) : null,
  }));

  return (
    <AppShell categories={categories}>
      <RequestsClient initialRequests={serialized} categories={categories} />
    </AppShell>
  );
}
