import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { MapPin, Scale, MessageSquare, ArrowLeft, User, ShieldCheck } from "lucide-react";
import { getSessionUser } from "@/lib/session";
import { ListingDetailClient } from "./ListingDetailClient";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

export default async function ListingDetailPage({ params }: RouteParams) {
  const { id } = await params;
  const sessionUser = await getSessionUser();

  const categories = await prisma.wasteCategory.findMany({
    orderBy: { name: "asc" },
  });

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      category: true,
      seller: {
        include: {
          receivedReviews: true,
        },
      },
    },
  });

  if (!listing) {
    notFound();
  }

  const sellerReviews = listing.seller.receivedReviews;
  const avgRating =
    sellerReviews.length > 0
      ? Number(
          (sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length).toFixed(1)
        )
      : 4.9;

  const serialized = {
    ...listing,
    estimatedWeightKg: listing.estimatedWeightKg ? Number(listing.estimatedWeightKg) : null,
    estimatedPrice: listing.estimatedPrice ? Number(listing.estimatedPrice) : null,
    cvConfidence: listing.cvConfidence ? Number(listing.cvConfidence) : null,
    latitude: listing.latitude ? Number(listing.latitude) : null,
    longitude: listing.longitude ? Number(listing.longitude) : null,
    seller: {
      ...listing.seller,
      avgRating,
      reviewCount: sellerReviews.length,
    },
  };

  return (
    <AppShell categories={categories}>
      <ListingDetailClient listing={serialized} currentUserId={sessionUser?.id || null} />
    </AppShell>
  );
}
