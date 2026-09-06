import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { getSessionUser } from "@/lib/session";
import { userService } from "@/services/user.service";
import { TransactionsPageClient } from "@/components/features/profile/pages/TransactionsPageClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfileTransactionsPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect("/login?redirect=/profile/transactions");
  }

  const rawCategories = await prisma.wasteCategory.findMany({
    orderBy: { name: "asc" },
  });

  const categories = rawCategories.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
  }));

  const profileData = await userService.getUserProfile(sessionUser.email);
  const transactions = profileData?.transactions || [];
  const isSeller = (sessionUser.activeRole as "seller" | "buyer") === "seller";

  return (
    <AppShell categories={categories} sessionUser={sessionUser}>
      <TransactionsPageClient
        transactions={transactions}
        isSeller={isSeller}
      />
    </AppShell>
  );
}
