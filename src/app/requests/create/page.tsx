import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { CreateRequestClient } from "@/components/features/requests/CreateRequestClient";

export const dynamic = "force-dynamic";

export default async function CreateRequestPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect("/login?redirect=/requests/create");
  }

  const categories = await prisma.wasteCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <AppShell categories={categories} sessionUser={sessionUser}>
      <CreateRequestClient categories={categories} />
    </AppShell>
  );
}
