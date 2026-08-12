"use client";

import { useState } from "react";
import { MapPin, Navigation, Compass, Sparkles, Store, ShoppingBag } from "lucide-react";
import { Listing, WasteRequest } from "@/types";
import { cn } from "@/lib/utils";

interface ProximityMapProps {
  listings: Listing[];
  requests: WasteRequest[];
  onSelectListing?: (listing: Listing) => void;
}

export function ProximityMap({ listings, requests, onSelectListing }: ProximityMapProps) {
  const [selectedPin, setSelectedPin] = useState<{
    id: string;
    type: "seller" | "buyer";
    title: string;
    category: string;
    price: string;
    distance: string;
    address: string;
    x: number;
    y: number;
  } | null>({
    id: "pin-1",
    type: "seller",
    title: "Ampas Kopi Basah Espresso 25kg",
    category: "Ampas Kopi",
    price: "Rp 1.500/kg",
    distance: "0.8 km",
    address: "Jl. Siranda No. 5, Semarang",
    x: 45,
    y: 40,
  });

  // Mock Semarang Map Pins mapped to SVG percentage coordinates
  const mapPins = [
    {
      id: "pin-1",
      type: "seller" as const,
      title: "Ampas Kopi Basah Espresso 25kg",
      category: "Ampas Kopi",
      price: "Rp 1.500/kg",
      distance: "0.8 km",
      address: "Jl. Siranda No. 5, Semarang",
      x: 45,
      y: 40,
    },
    {
      id: "pin-2",
      type: "seller" as const,
      title: "Kardus Bekas Pack Tebal 50kg",
      category: "Anorganik",
      price: "Rp 2.000/kg",
      distance: "2.4 km",
      address: "Jl. Tembalang Raya No. 12, Semarang",
      x: 65,
      y: 55,
    },
    {
      id: "pin-3",
      type: "buyer" as const,
      title: "Butuh Ampas Kopi Rutin untuk Pupuk",
      category: "Ampas Kopi",
      price: "Tawaran: Rp 2.000/kg",
      distance: "0.8 km",
      address: "Jl. Raya Ungaran No. 88, Semarang",
      x: 40,
      y: 35,
    },
    {
      id: "pin-4",
      type: "buyer" as const,
      title: "Dibutuhkan Kardus Bekas Pengepul",
      category: "Anorganik",
      price: "Tawaran: Rp 1.500/kg",
      distance: "2.4 km",
      address: "Jl. Genuk Krajan No. 45, Semarang",
      x: 58,
      y: 60,
    },
    {
      id: "pin-5",
      type: "seller" as const,
      title: "Kaleng Alumunium Minuman 5kg",
      category: "Logam",
      price: "Rp 12.000/kg",
      distance: "5.1 km",
      address: "Banyumanik, Semarang",
      x: 75,
      y: 70,
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/40 mb-1">
            <Navigation className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Peta Visualisasi Proksimitas Semarang</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Interaktif Peta Lokasi Sampah Terdekat
          </h2>
          <p className="text-xs text-slate-400">
            Klik pin pada peta untuk meninjau radius jarak Seller & Buyer di sekitarmu.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            Seller (Hijau)
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Buyer (Kuning)
          </span>
        </div>
      </div>

      {/* Interactive Map Visualizer Canvas */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
        {/* Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

        {/* Radius Proximity Concentric Rings */}
        <div className="absolute w-40 h-40 rounded-full border border-emerald-500/20 bg-emerald-500/5" />
        <div className="absolute w-80 h-80 rounded-full border border-emerald-500/10" />
        <div className="absolute w-120 h-120 rounded-full border border-slate-800" />

        {/* Center Point User Location */}
        <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
          <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-md flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <span className="text-[10px] font-bold text-emerald-300 bg-slate-950 px-2 py-0.5 rounded-full border border-emerald-500/30 mt-1">
            Lokasi Anda
          </span>
        </div>

        {/* Pins Rendering */}
        {mapPins.map((pin) => {
          const isSelected = selectedPin?.id === pin.id;
          const isSeller = pin.type === "seller";

          return (
            <button
              key={pin.id}
              onClick={() => setSelectedPin(pin)}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-transform duration-200 hover:scale-125 cursor-pointer group"
            >
              <div
                className={cn(
                  "p-2 rounded-full shadow-lg border backdrop-blur-md transition-colors flex items-center justify-center",
                  isSeller
                    ? "bg-emerald-600 text-white border-emerald-300 shadow-emerald-600/40"
                    : "bg-amber-500 text-slate-950 border-amber-300 shadow-amber-500/40",
                  isSelected && "ring-4 ring-white scale-110"
                )}
              >
                {isSeller ? (
                  <Store className="w-4 h-4" />
                ) : (
                  <ShoppingBag className="w-4 h-4" />
                )}
              </div>

              {/* Pin Label Tag */}
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-[10px] font-semibold bg-slate-950/90 text-white px-2 py-0.5 rounded-md border border-slate-800 whitespace-nowrap opacity-90 group-hover:opacity-100">
                {pin.distance}
              </span>
            </button>
          );
        })}

        {/* Selected Pin Floating Card Info Overlay */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-slate-950/90 border border-slate-800 backdrop-blur-md rounded-2xl p-4 shadow-2xl z-40 space-y-2 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  selectedPin.type === "seller"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-700/50"
                    : "bg-amber-950 text-amber-300 border border-amber-700/50"
                )}
              >
                {selectedPin.type === "seller" ? "Seller Listing" : "Buyer Request"} • {selectedPin.category}
              </span>
              <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {selectedPin.distance}
              </span>
            </div>

            <h4 className="font-semibold text-sm text-white line-clamp-1">{selectedPin.title}</h4>
            <p className="text-xs text-slate-400 line-clamp-1">{selectedPin.address}</p>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">{selectedPin.price}</span>
              <span className="text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer">
                Lihat Detail Match &rarr;
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
