import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileClient } from "@/components/features/profile/ProfileClient";
import { getSessionUser } from "@/lib/session";
import { userService } from "@/services/userService";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const categories = await prisma.wasteCategory.findMany({
    orderBy: { name: "asc" },
  });

  const sessionUser = await getSessionUser();
  const targetEmail = sessionUser?.email ?? "ahmad@daurnusa.id";

  const profileData = await userService.getUserProfile(targetEmail);

  if (!profileData) {
    return <div>User not found</div>;
  }

  const { user, stats, listings, transactions, reviews, buyerApplication } = profileData;

  const formattedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  return (
    <AppShell categories={categories} sessionUser={user as any}>
      <ProfileClient
        user={user}
        stats={stats}
        listings={listings}
        transactions={transactions}
        reviews={reviews}
        categories={formattedCategories}
        buyerApplication={buyerApplication}
      />
    </AppShell>
  );
}