import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { CreateListingClient } from "./CreateListingClient";

export const dynamic = "force-dynamic";

export default async function CreateListingPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect("/login?redirect=/seller/listings/create");
  }

  if (sessionUser.activeRole !== "seller") {
    redirect("/profile");
  }

  const categories = await prisma.wasteCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <AppShell categories={categories} sessionUser={sessionUser}>
      <CreateListingClient categories={categories} sessionUser={sessionUser} />
    </AppShell>
  );
}
