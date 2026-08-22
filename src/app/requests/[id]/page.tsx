import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { notFound } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { RequestDetailClient } from "@/components/features/requests/RequestDetailClient";

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
          buyerTransactions: {
            where: { status: "selesai" },
          },
        },
      },
    },
  });

  if (!request) {
    notFound();
  }

  let sellerListings: {
    id: string;
    title: string;
    categoryId: string;
    unit: string;
    estimatedWeightKg: number;
    estimatedPrice: number;
  }[] = [];

  if (sessionUser && sessionUser.id) {
    const rawListings = await prisma.listing.findMany({
      where: {
        sellerId: sessionUser.id,
        status: "aktif",
      },
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    sellerListings = rawListings.map((l) => ({
      id: l.id,
      title: l.title,
      categoryId: l.categoryId,
      unit: l.unit || "kg",
      estimatedWeightKg: l.estimatedWeightKg ? Number(l.estimatedWeightKg) : 0,
      estimatedPrice: l.estimatedPrice ? Number(l.estimatedPrice) : 0,
    }));
  }

  const rawRelated = await prisma.wasteRequest.findMany({
    where: {
      categoryId: request.categoryId,
      id: { not: request.id },
      status: "aktif",
    },
    take: 3,
    include: {
      category: true,
      buyer: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const relatedRequests = rawRelated.map((r) => ({
    ...r,
    offeredPrice: r.offeredPrice ? Number(r.offeredPrice) : 0,
    unit: r.unit || "kg",
    latitude: r.latitude ? Number(r.latitude) : null,
    longitude: r.longitude ? Number(r.longitude) : null,
    buyer: r.buyer
      ? {
        ...r.buyer,
        latitude: r.buyer.latitude ? Number(r.buyer.latitude) : null,
        longitude: r.longitude ? Number(r.longitude) : null,
      }
      : null,
  }));

  const buyerReviews = request.buyer?.receivedReviews || [];
  const avgRating =
    buyerReviews.length > 0
      ? Number(
        (buyerReviews.reduce((sum, r) => sum + r.rating, 0) / buyerReviews.length).toFixed(1)
      )
      : 4.9;

  const completedTxCount = request.buyer?.buyerTransactions?.length || 0;

  const { receivedReviews, buyerTransactions, ...buyerRest } = request.buyer || {};

  const safeBuyer = {
    ...buyerRest,
    id: request.buyer?.id || "",
    fullName: request.buyer?.fullName || "Pengepul",
    avatarUrl: request.buyer?.avatarUrl || null,
    latitude: request.buyer?.latitude ? Number(request.buyer.latitude) : null,
    longitude: request.buyer?.longitude ? Number(request.buyer.longitude) : null,
    avgRating,
    reviewCount: buyerReviews.length,
    completedTxCount,
  };

  const serialized = {
    ...request,
    unit: request.unit || "kg",
    offeredPrice: request.offeredPrice ? Number(request.offeredPrice) : 0,
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
        sellerListings={sellerListings}
        relatedRequests={relatedRequests}
      />
    </AppShell>
  );
}