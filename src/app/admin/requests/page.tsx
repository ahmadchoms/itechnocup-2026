import { prisma } from "@/lib/prisma";
import { RequestsClient } from "./RequestsClient";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const requests = await prisma.wasteRequest.findMany({
    include: { buyer: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  const formattedRequests = requests.map((r) => ({
    ...r,
    offeredPrice: Number(r.offeredPrice),
    latitude: r.latitude ? Number(r.latitude) : null,
    longitude: r.longitude ? Number(r.longitude) : null,
    buyer: {
      ...r.buyer,
      latitude: r.buyer.latitude ? Number(r.buyer.latitude) : null,
      longitude: r.buyer.longitude ? Number(r.buyer.longitude) : null,
    },
  }));

  return <RequestsClient initialRequests={formattedRequests} />;
}
