import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ListingMatchClient from "./ListingMatchClient";

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

  // Fetch all active waste requests (ideally filtered by category to be relevant)
  const wasteRequests = await prisma.wasteRequest.findMany({
    where: {
      status: "aktif",
      // Optionally filter by categoryId if we only want strictly same category
      // categoryId: listing.categoryId, 
    },
    include: {
      buyer: true,
      category: true,
    },
  });

  // Convert Decimals to string/number to pass to client component
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
  }));

  const safeSessionUser = {
    id: sessionUser.id,
    fullName: sessionUser.fullName,
    activeRole: sessionUser.activeRole,
  };

  return (
    <ListingMatchClient
      listing={safeListing as any}
      wasteRequests={safeWasteRequests as any}
      sessionUser={safeSessionUser}
    />
  );
}
