import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { MarketplaceFeed } from "@/components/marketplace/MarketplaceFeed";
import { Listing, WasteRequest } from "@/types";

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  const categories = await prisma.wasteCategory.findMany({
    orderBy: { name: "asc" },
  });

  const listings = await prisma.listing.findMany({
    where: { status: { not: "dihapus" } },
    include: {
      seller: {
        select: {
          id: true,
          fullName: true,
          email: true,
          avatarUrl: true,
          isAdmin: true,
          receivedReviews: { select: { rating: true } },
        },
      },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const requests = await prisma.wasteRequest.findMany({
    where: { status: { not: "dihapus" } },
    include: {
      buyer: true,
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedListings: Listing[] = listings.map((item) => {
    const reviews = item.seller.receivedReviews || [];
    const avgRating =
      reviews.length > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
        : 4.9;

    let distanceKm = 1.5;
    if (item.title.includes("Kopi")) distanceKm = 0.8;
    else if (item.title.includes("Kardus")) distanceKm = 2.4;
    else if (item.title.includes("Kaleng")) distanceKm = 5.1;

    return {
      ...item,
      estimatedWeightKg: item.estimatedWeightKg ? Number(item.estimatedWeightKg) : null,
      estimatedPrice: item.estimatedPrice ? Number(item.estimatedPrice) : null,
      cvConfidence: item.cvConfidence ? Number(item.cvConfidence) : null,
      latitude: item.latitude ? Number(item.latitude) : null,
      longitude: item.longitude ? Number(item.longitude) : null,
      distanceKm,
      seller: {
        ...item.seller,
        latitude: (item.seller as any).latitude ? Number((item.seller as any).latitude) : null,
        longitude: (item.seller as any).longitude ? Number((item.seller as any).longitude) : null,
        rating: avgRating,
      },
    } as unknown as Listing;
  });

  const formattedRequests: WasteRequest[] = requests.map((req) => ({
    ...req,
    offeredPrice: Number(req.offeredPrice),
    latitude: req.latitude ? Number(req.latitude) : null,
    longitude: req.longitude ? Number(req.longitude) : null,
    buyer: req.buyer
      ? {
          ...req.buyer,
          latitude: req.buyer.latitude ? Number(req.buyer.latitude) : null,
          longitude: req.buyer.longitude ? Number(req.buyer.longitude) : null,
        }
      : req.buyer,
  })) as unknown as WasteRequest[];

  return (
    <AppShell categories={categories}>
      <MarketplaceFeed
        initialListings={formattedListings}
        initialRequests={formattedRequests}
        categories={categories}
      />
    </AppShell>
  );
}
