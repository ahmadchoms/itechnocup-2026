import { prisma } from "@/lib/prisma";
import { ListingsClient } from "@/components/features/admin/ListingsClient";
import { AdminListingItem } from "@/components/features/admin/types";

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  const [listings, categories] = await Promise.all([
    prisma.listing.findMany({
      include: {
        seller: {
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
    prisma.wasteCategory.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const formattedListings: AdminListingItem[] = listings.map((l) => ({
    id: l.id,
    sellerId: l.sellerId,
    categoryId: l.categoryId,
    title: l.title,
    photoUrl: l.photoUrl,
    estimatedWeightKg: l.estimatedWeightKg ? Number(l.estimatedWeightKg) : null,
    quantity: l.quantity,
    unit: l.unit,
    condition: l.condition,
    description: l.description,
    estimatedPrice: l.estimatedPrice ? Number(l.estimatedPrice) : null,
    address: l.address,
    latitude: l.latitude ? Number(l.latitude) : null,
    longitude: l.longitude ? Number(l.longitude) : null,
    status: l.status,
    cvConfidence: l.cvConfidence ? Number(l.cvConfidence) : null,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
    category: {
      id: l.category.id,
      name: l.category.name,
    },
    seller: {
      id: l.seller.id,
      fullName: l.seller.fullName,
      email: l.seller.email,
      phone: l.seller.phone,
      avatarUrl: l.seller.avatarUrl,
    },
  }));

  return (
    <ListingsClient
      initialListings={formattedListings}
      categories={categories}
    />
  );
}
