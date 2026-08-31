import { AppShell } from "@/components/layout/AppShell";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { CreateListingClient } from "@/components/features/listings/CreateListingClient";
import { categoryService } from "@/services/category.service";

export const dynamic = "force-dynamic";

export default async function CreateListingPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect("/login?redirect=/listings/create");
  }

  const categories = await categoryService.getAllCategoriesWithAveragePrice();

  return (
    <AppShell categories={categories} sessionUser={sessionUser}>
      <CreateListingClient categories={categories} sessionUser={sessionUser} />
    </AppShell>
  );
}
