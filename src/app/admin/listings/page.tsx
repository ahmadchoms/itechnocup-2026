import { prisma } from "@/lib/prisma";
import { ListingsClient } from "@/components/features/admin/ListingsClient";

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  const listings = await prisma.listing.findMany({
    include: { seller: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  const formattedListings = listings.map((l) => ({
    ...l,
    estimatedPrice: l.estimatedPrice ? Number(l.estimatedPrice) : null,
    estimatedWeightKg: l.estimatedWeightKg ? Number(l.estimatedWeightKg) : null,
    cvConfidence: l.cvConfidence ? Number(l.cvConfidence) : null,
    latitude: l.latitude ? Number(l.latitude) : null,
    longitude: l.longitude ? Number(l.longitude) : null,
    seller: {
      ...l.seller,
      latitude: l.seller.latitude ? Number(l.seller.latitude) : null,
      longitude: l.seller.longitude ? Number(l.seller.longitude) : null,
    },
  }));

  return <ListingsClient initialListings={formattedListings} />;
}
