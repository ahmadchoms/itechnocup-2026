import { prisma } from "@/lib/prisma";
import { AdminRequestsClient } from "@/components/features/admin/AdminRequestsClient";
import { AdminRequestItem } from "@/components/features/admin/types";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const [categories, requests] = await Promise.all([
    prisma.wasteCategory.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.wasteRequest.findMany({
      include: {
        buyer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const formattedRequests: AdminRequestItem[] = requests.map((r) => ({
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
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    category: {
      id: r.category.id,
      name: r.category.name,
    },
    buyer: {
      id: r.buyer.id,
      fullName: r.buyer.fullName,
      email: r.buyer.email,
      phone: r.buyer.phone,
      avatarUrl: r.buyer.avatarUrl,
    },
  }));

  return (
    <AdminRequestsClient
      initialRequests={formattedRequests}
      categories={categories}
    />
  );
}
