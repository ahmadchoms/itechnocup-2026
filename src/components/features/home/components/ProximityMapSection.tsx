import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { ProximityMap } from "@/components/map/ProximityMap";
import type { Listing, WasteRequest } from "@/types";

interface ProximityMapSectionProps {
  listings: Listing[];
  requests: WasteRequest[];
  initialUserLocation?: { lat: number; lng: number } | null;
}

export function ProximityMapSection({
  listings,
  requests,
  initialUserLocation,
}: ProximityMapSectionProps) {
  return (
    <section aria-labelledby="map-section-heading" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <MapPin className="h-3.5 w-3.5" />
            </span>
            <h2
              id="map-section-heading"
              className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight"
            >
              Peta Sebaran Limbah &amp; Pengepul
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Peta interaktif berbasis proksimitas lokasi GPS untuk penjemputan sampah cepat
          </p>
        </div>

        <Link
          href="/requests"
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100/70 flex items-center gap-1.5 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200 transition-colors w-fit"
        >
          <span>Jelajahi Semua Permintaan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <ProximityMap
        listings={listings}
        requests={requests}
        initialUserLocation={initialUserLocation}
      />
    </section>
  );
}
