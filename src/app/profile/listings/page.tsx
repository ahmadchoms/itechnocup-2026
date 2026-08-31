import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { getSessionUser } from "@/lib/session";
import { userService } from "@/services/user.service";
import { MyListingsPageClient } from "@/components/features/profile/pages/MyListingsPageClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfileListingsPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect("/login?redirect=/profile/listings");
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
  const listings = profileData?.listings || [];
  const wasteRequests = profileData?.wasteRequests || [];
  const isSeller = (sessionUser.activeRole as "seller" | "buyer") === "seller";

  return (
    <AppShell categories={categories} sessionUser={sessionUser}>
      <MyListingsPageClient
        initialListings={listings}
        initialRequests={wasteRequests}
        categories={categories}
        isSeller={isSeller}
      />
    </AppShell>
  );
}
