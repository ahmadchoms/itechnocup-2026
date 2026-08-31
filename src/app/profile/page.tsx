import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileClient } from "@/components/features/profile/ProfileClient";
import { getSessionUser } from "@/lib/session";
import { userService } from "@/services/user.service";

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

  const { user, stats, listings, wasteRequests, transactions, reviews, buyerApplication } = profileData;

  const formattedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  return (
    <AppShell categories={formattedCategories} sessionUser={sessionUser}>
      <ProfileClient
        user={user}
        stats={stats}
        listings={listings}
        wasteRequests={wasteRequests}
        transactions={transactions}
        reviews={reviews}
        categories={formattedCategories}
        buyerApplication={buyerApplication}
      />
    </AppShell>
  );
}