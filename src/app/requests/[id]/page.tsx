import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { notFound } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { RequestDetailClient } from "./RequestDetailClient";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

export default async function RequestDetailPage({ params }: RouteParams) {
  const { id } = await params;
  const sessionUser = await getSessionUser();

  const categories = await prisma.wasteCategory.findMany({
    orderBy: { name: "asc" },
  });

  const request = await prisma.wasteRequest.findUnique({
    where: { id },
    include: {
      category: true,
      buyer: {
        include: {
          receivedReviews: true,
        },
      },
    },
  });

  if (!request) {
    notFound();
  }

  const buyerReviews = request.buyer.receivedReviews;
  const avgRating =
    buyerReviews.length > 0
      ? Number(
          (buyerReviews.reduce((sum, r) => sum + r.rating, 0) / buyerReviews.length).toFixed(1)
        )
      : 4.9;

  const safeBuyer = {
    ...request.buyer,
    latitude: request.buyer.latitude ? Number(request.buyer.latitude) : null,
    longitude: request.buyer.longitude ? Number(request.buyer.longitude) : null,
    avgRating,
    reviewCount: buyerReviews.length,
  };
  delete (safeBuyer as any).receivedReviews;

  const serialized = {
    ...request,
    offeredPrice: Number(request.offeredPrice),
    latitude: request.latitude ? Number(request.latitude) : null,
    longitude: request.longitude ? Number(request.longitude) : null,
    buyer: safeBuyer,
  };

  return (
    <AppShell categories={categories} sessionUser={sessionUser}>
      <RequestDetailClient 
        request={serialized} 
        currentUserId={sessionUser?.id || null} 
        currentRole={sessionUser?.activeRole || "seller"}
      />
    </AppShell>
  );
}
