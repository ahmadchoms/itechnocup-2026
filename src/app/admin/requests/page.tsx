import { adminService } from "@/services/admin.service";
import { AdminRequestsClient } from "@/components/features/admin/AdminRequestsClient";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const { requests, categories } = await adminService.getAllRequests();

  return (
    <AdminRequestsClient
      initialRequests={requests}
      categories={categories}
    />
  );
}
