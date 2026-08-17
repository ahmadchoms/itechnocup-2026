import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { RequestsClient } from "./RequestsClient";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const sessionUser = await getSessionUser();
  const currentRole = sessionUser?.activeRole || "guest";
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
    buyer: r.buyer
      ? {
          ...r.buyer,
          latitude: r.buyer.latitude ? Number(r.buyer.latitude) : null,
          longitude: r.buyer.longitude ? Number(r.buyer.longitude) : null,
        }
      : r.buyer,
  }));

  return (
    <AppShell categories={categories} sessionUser={sessionUser}>
      <RequestsClient initialRequests={serialized} categories={categories} currentRole={currentRole} />
    </AppShell>
  );
}
