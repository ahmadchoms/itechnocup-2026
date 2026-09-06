import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { getSessionUser } from "@/lib/session";
import { WasteRequest } from "@/types";
import { RequestsClient } from "@/components/features/requests/RequestsClient";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const sessionUser = await getSessionUser();
  const currentRole = sessionUser?.activeRole || "guest";
  const rawCategories = await prisma.wasteCategory.findMany({
    orderBy: { name: "asc" },
  });

  const categories = rawCategories.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
  }));

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
    createdAt: r.createdAt ? r.createdAt.toISOString() : null,
    updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
    buyer: r.buyer
      ? {
        ...r.buyer,
        latitude: r.buyer.latitude ? Number(r.buyer.latitude) : null,
        longitude: r.buyer.longitude ? Number(r.buyer.longitude) : null,
        createdAt: r.buyer.createdAt ? r.buyer.createdAt.toISOString() : null,
        updatedAt: r.buyer.updatedAt ? r.buyer.updatedAt.toISOString() : null,
      }
      : r.buyer,
  }));

  return (
    <AppShell categories={categories} sessionUser={sessionUser}>
      <RequestsClient initialRequests={serialized as any} categories={categories} currentRole={currentRole} />
    </AppShell>
  );
}
