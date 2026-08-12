import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { MatchesClient } from "./MatchesClient";
import { MatchItem } from "@/types";

export const dynamic = "force-dynamic";

export default async function MatchesPage() {
  const categories = await prisma.wasteCategory.findMany({
    orderBy: { name: "asc" },
  });

  const matches = await prisma.match.findMany({
    include: {
      listing: {
        include: {
          seller: true,
          category: true,
        },
      },
      request: {
        include: {
          buyer: true,
          category: true,
        },
      },
    },
    orderBy: { distanceKm: "asc" },
  });

  const formattedMatches: MatchItem[] = matches.map((m) => ({
    ...m,
    distanceKm: m.distanceKm ? Number(m.distanceKm) : 0.8,
    listing: {
      ...m.listing,
      estimatedPrice: m.listing.estimatedPrice ? Number(m.listing.estimatedPrice) : null,
      estimatedWeightKg: m.listing.estimatedWeightKg ? Number(m.listing.estimatedWeightKg) : null,
    },
    request: {
      ...m.request,
      offeredPrice: Number(m.request.offeredPrice),
    },
  })) as unknown as MatchItem[];

  return (
    <AppShell categories={categories}>
      <MatchesClient matches={formattedMatches} />
    </AppShell>
  );
}
