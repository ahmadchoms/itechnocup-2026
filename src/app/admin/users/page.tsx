import { adminService } from "@/services/admin.service";
import { UsersClient } from "@/components/features/admin/UsersClient";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await adminService.getAllUsers();

  return <UsersClient initialUsers={users} />;
}
