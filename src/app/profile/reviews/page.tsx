import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { getSessionUser } from "@/lib/session";
import { userService } from "@/services/user.service";
import { ReviewsPageClient } from "@/components/features/profile/pages/ReviewsPageClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfileReviewsPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect("/login?redirect=/profile/reviews");
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
  const reviews = profileData?.reviews || [];
  const stats = profileData?.stats || {
    totalRevenue: 0,
    totalKgSold: 0,
    avgRating: 4.9,
    totalTransactionsCount: 0,
  };
  const isSeller = (sessionUser.activeRole as "seller" | "buyer") === "seller";

  return (
    <AppShell categories={categories} sessionUser={sessionUser}>
      <ReviewsPageClient
        reviews={reviews}
        stats={stats}
        isSeller={isSeller}
      />
    </AppShell>
  );
}
