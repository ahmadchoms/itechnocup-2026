import { AppShell } from "@/components/layout/AppShell";
import { getSessionUser } from "@/lib/session";
import { categoryService } from "@/services/category.service";
import { homeService } from "@/services/home.service";
import {
  HeroSection,
  EffortlessSection,
  ProximityMapSection,
  ImpactStatsSection,
  SecondLifeSection,
  TestimonialsSection,
  CtaSection,
  SiteFooter,
} from "@/components/features/home";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [sessionUser, categories, { listings, requests }] = await Promise.all([
    getSessionUser(),
    categoryService.getAllCategoriesWithAveragePrice(),
    homeService.getHomePageData(),
  ]);

  const initialUserLocation =
    sessionUser?.latitude && sessionUser?.longitude
      ? { lat: sessionUser.latitude, lng: sessionUser.longitude }
      : null;

  return (
    <AppShell categories={categories} sessionUser={sessionUser}>
      <div className="space-y-20 py-4">
        <HeroSection />
        <EffortlessSection />
        <ProximityMapSection
          listings={listings}
          requests={requests}
          initialUserLocation={initialUserLocation}
        />
        <ImpactStatsSection />
        <SecondLifeSection />
        <TestimonialsSection />
        <CtaSection />
        <SiteFooter />
      </div>
    </AppShell>
  );
}