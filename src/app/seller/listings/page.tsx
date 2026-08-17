import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { MyListingsClient } from "./MyListingsClient";

export const dynamic = "force-dynamic";

export default async function MyListingsPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect("/login?redirect=/seller/listings");
  }

  const categories = await prisma.wasteCategory.findMany({ orderBy: { name: "asc" } });

  const listings = await prisma.listing.findMany({
    where: { sellerId: sessionUser.id },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const serialized = listings.map((l) => ({
    ...l,
    estimatedWeightKg: l.estimatedWeightKg ? Number(l.estimatedWeightKg) : null,
    estimatedPrice: l.estimatedPrice ? Number(l.estimatedPrice) : null,
    cvConfidence: l.cvConfidence ? Number(l.cvConfidence) : null,
    latitude: l.latitude ? Number(l.latitude) : null,
    longitude: l.longitude ? Number(l.longitude) : null,
  }));

  return (
    <AppShell categories={categories} sessionUser={sessionUser}>
      <MyListingsClient
        initialListings={serialized}
        categories={categories}
        currentUser={sessionUser}
      />
    </AppShell>
  );
}
