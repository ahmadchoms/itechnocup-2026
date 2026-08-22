import { buyerApplicationService } from "@/services/buyerApplicationService";
import { BuyerAppsClient } from "@/components/features/admin/BuyerAppsClient";

export const dynamic = "force-dynamic";

export default async function BuyerApplicationsPage() {
  const formattedBuyerApplications = await buyerApplicationService.getAllApplications();

  return <BuyerAppsClient initialBuyerApplications={formattedBuyerApplications} />;
}
