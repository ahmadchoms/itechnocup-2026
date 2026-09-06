import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ListingMatchClient } from "@/components/features/listings/ListingMatchClient";
import { aiService } from "@/services/ai.service";

export const dynamic = "force-dynamic";

export default async function ListingMatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect("/login");
  }

  const { id } = await params;

  // Fetch the listing
  const listing = await prisma.listing.findUnique({
    where: { id: id, sellerId: sessionUser.id },
    include: {
      category: true,
    },
  });

  if (!listing) {
    return (
      <div className="p-8 text-center text-slate-500">
        Listing tidak ditemukan atau Anda tidak memiliki akses.
      </div>
    );
  }

  // Fetch all active waste requests
  const wasteRequests = await prisma.wasteRequest.findMany({
    where: {
      status: "aktif",
    },
    include: {
      buyer: true,
      category: true,
    },
  });

  // Convert Decimals to numbers for client component
  const safeListing = {
    ...listing,
    estimatedWeightKg: listing.estimatedWeightKg ? Number(listing.estimatedWeightKg) : null,
    estimatedPrice: listing.estimatedPrice ? Number(listing.estimatedPrice) : null,
    latitude: listing.latitude ? Number(listing.latitude) : null,
    longitude: listing.longitude ? Number(listing.longitude) : null,
    cvConfidence: listing.cvConfidence ? Number(listing.cvConfidence) : null,
  };

  const safeWasteRequests = wasteRequests.map((req) => ({
    ...req,
    offeredPrice: Number(req.offeredPrice),
    latitude: req.latitude ? Number(req.latitude) : null,
    longitude: req.longitude ? Number(req.longitude) : null,
    createdAt: req.createdAt ? req.createdAt.toISOString() : null,
    updatedAt: req.updatedAt ? req.updatedAt.toISOString() : null,
    buyer: req.buyer
      ? {
          ...req.buyer,
          latitude: req.buyer.latitude ? Number(req.buyer.latitude) : null,
          longitude: req.buyer.longitude ? Number(req.buyer.longitude) : null,
          createdAt: req.buyer.createdAt ? req.buyer.createdAt.toISOString() : null,
          updatedAt: req.buyer.updatedAt ? req.buyer.updatedAt.toISOString() : null,
        }
      : null,
  }));

  const safeSessionUser = {
    id: sessionUser.id,
    fullName: sessionUser.fullName,
    activeRole: sessionUser.activeRole,
  };

  // Call AI on-the-fly
  const aiListingArgs = {
    id: safeListing.id,
    title: safeListing.title,
    categoryName: safeListing.category?.name || "",
  };

  const aiRequestsArgs = safeWasteRequests.map((r) => ({
    id: r.id,
    title: r.title,
    categoryName: r.category?.name || "",
  }));

  const aiScores = await aiService.evaluateMatchesOnTheFly(aiListingArgs, aiRequestsArgs);

  // Tambahkan delay 1 detik (1000ms) agar animasi muter (loading.tsx)
  // tidak terlalu cepat menghilang jika backend merespon sangat cepat.
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Attach aiScore back to safeWasteRequests
  const safeWasteRequestsWithAI = safeWasteRequests.map((r) => {
    const scoreObj = aiScores.find((s) => s.requestId === r.id);
    return { ...r, aiScore: scoreObj?.aiScore ?? 0 };
  });

  return (
    <ListingMatchClient
      listing={safeListing as any}
      wasteRequests={safeWasteRequestsWithAI as any}
      sessionUser={safeSessionUser}
    />
  );
}
