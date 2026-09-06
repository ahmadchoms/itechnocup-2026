import { adminService } from "@/services/admin.service";
import { AdminDashboardClient } from "@/components/features/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const dashboardData = await adminService.getDashboardStats();

  return <AdminDashboardClient data={dashboardData} />;
}
