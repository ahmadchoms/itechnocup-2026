import { prisma } from "@/lib/prisma";
import { BuyerAppsClient } from "./BuyerAppsClient";

export const dynamic = "force-dynamic";

export default async function BuyerApplicationsPage() {
  const buyerApplications = await prisma.buyerApplication.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const formattedBuyerApplications = buyerApplications.map(app => ({
    ...app,
    user: {
      ...app.user,
      latitude: app.user.latitude ? Number(app.user.latitude) : null,
      longitude: app.user.longitude ? Number(app.user.longitude) : null,
    }
  }));

  return <BuyerAppsClient initialBuyerApplications={formattedBuyerApplications} />;
}
