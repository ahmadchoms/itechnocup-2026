"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, X, RefreshCw } from "lucide-react";
import { Listing, WasteRequest } from "@/types";
import { MapMarkerItem } from "./LeafletMapInner";
import { cn } from "@/lib/utils";

const LeafletMapInner = dynamic(() => import("./LeafletMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400 space-y-2 min-h-[320px]">
      <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
      <span className="text-xs font-medium">Memuat Peta Interaktif Semarang...</span>
    </div>
  ),
});

interface ProximityMapProps {
  listings: Listing[];
  requests: WasteRequest[];
}

export function ProximityMap({ listings, requests }: ProximityMapProps) {
  const [selectedPin, setSelectedPin] = useState<MapMarkerItem | null>(null);
  const defaultCenter = { lat: -7.0051, lng: 110.4381 };

  const markers: MapMarkerItem[] = [
    ...listings.map((l, i) => ({
      id: `listing-${l.id}`,
      type: "seller" as const,
      title: l.title,
      category: l.category?.name || "Limbah",
      price: l.estimatedPrice ? `Rp ${Number(l.estimatedPrice).toLocaleString("id-ID")}/${l.unit || "kg"}` : "Harga Nego",
      distance: `${l.distanceKm || (0.8 + i * 0.5).toFixed(1)} km`,
      address: l.address || "Semarang, Jawa Tengah",
      lat: Number(l.latitude) || defaultCenter.lat + (i * 0.008 - 0.01),
      lng: Number(l.longitude) || defaultCenter.lng + (i * 0.006 - 0.01),
    })),
    ...requests.map((r, i) => ({
      id: `request-${r.id}`,
      type: "buyer" as const,
      title: r.title,
      category: r.category?.name || "Limbah",
      price: `Tawaran: Rp ${Number(r.offeredPrice).toLocaleString("id-ID")}/${r.unit || "kg"}`,
      distance: `${(1.0 + i * 0.8).toFixed(1)} km`,
      address: r.address || "Semarang, Jawa Tengah",
      lat: Number(r.latitude) || defaultCenter.lat - (i * 0.007 - 0.005),
      lng: Number(r.longitude) || defaultCenter.lng - (i * 0.005 - 0.005),
    })),
  ];

  return (
    <div className="relative z-10 isolate bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl overflow-hidden space-y-4">
      {/* Header Info (Tanpa Badge Border) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Peta Sampah Terdekat
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Klik pin pada peta untuk melihat Penjual &amp; Pengepul sampah di sekitarmu.
          </p>
        </div>

        {/* Legend Penanda */}
        <div className="flex items-center space-x-4 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Penjual (Sampah Dijual)
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Pengepul (Sampah Dicari)
          </span>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
        <LeafletMapInner markers={markers} defaultCenter={defaultCenter} onSelectPin={setSelectedPin} />

        {/* Selected Pin Overlay Card */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-slate-950/95 border border-slate-800 backdrop-blur-md rounded-2xl p-4 shadow-2xl z-20 space-y-2.5 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  selectedPin.type === "seller"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-700/50"
                    : "bg-amber-950 text-amber-300 border border-amber-700/50"
                )}
              >
                {selectedPin.type === "seller" ? "Penjual Sampah" : "Kebutuhan Pengepul"} • {selectedPin.category}
              </span>

              <button
                onClick={() => setSelectedPin(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-white line-clamp-1">{selectedPin.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{selectedPin.address}</p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Estimasi Nego</span>
                <span className="text-xs font-extrabold text-emerald-400">{selectedPin.price}</span>
              </div>

              <span className="text-xs font-bold text-amber-400 flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {selectedPin.distance}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}