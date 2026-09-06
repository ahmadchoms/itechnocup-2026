import { adminService } from "@/services/admin.service";
import { ListingsClient } from "@/components/features/admin/ListingsClient";

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  const { listings, categories } = await adminService.getAllListings();

  return (
    <ListingsClient
      initialListings={listings}
      categories={categories}
    />
  );
}
