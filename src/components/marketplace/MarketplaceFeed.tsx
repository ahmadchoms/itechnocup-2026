"use client";

import { useState } from "react";
import { ListingCard } from "./ListingCard";
import { RequestCard } from "./RequestCard";
import { ProximityMap } from "@/components/map/ProximityMap";
import { MapPin, Recycle, PlusCircle, Camera } from "lucide-react";
import Link from "next/link";
import { Listing, WasteRequest, WasteCategory } from "@/types";
import { cn } from "@/lib/utils";

interface MarketplaceFeedProps {
  initialListings: Listing[];
  initialRequests: WasteRequest[];
  categories: WasteCategory[];
  onOpenScanner?: () => void;
}

export function MarketplaceFeed({
  initialListings,
  initialRequests,
  categories,
  onOpenScanner,
}: MarketplaceFeedProps) {
  const [activeTab, setActiveTab] = useState<"listings" | "requests">("listings");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [sortByDistance, setSortByDistance] = useState<boolean>(true);
  const [showMap, setShowMap] = useState<boolean>(true);

  // Filter listings
  const filteredListings = initialListings
    .filter((item) => {
      if (selectedCategoryId !== "all" && item.categoryId !== selectedCategoryId) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortByDistance) {
        return (a.distanceKm || 0) - (b.distanceKm || 0);
      }
      return 0;
    });

  // Filter requests
  const filteredRequests = initialRequests.filter((item) => {
    if (selectedCategoryId !== "all" && item.categoryId !== selectedCategoryId) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Clean Marketplace Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="max-w-2xl space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Marketplace Sirkular Semarang
          </span>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
            Pasar Sampah &amp; Limbah Terdekat
          </h1>

          <p className="text-xs text-slate-600 leading-relaxed">
            Temukan limbah ampas kopi, kardus bekas, botol plastik PET, dan minyak jelantah langsung dengan pembeli &amp; pengolah terdekat.
          </p>
        </div>

        <div className="pt-1 flex flex-wrap gap-2.5">
          {onOpenScanner && (
            <button
              onClick={onOpenScanner}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white transition-colors flex items-center space-x-2 cursor-pointer shadow-xs"
            >
              <Camera className="w-4 h-4" />
              <span>Foto &amp; Jual Sampah</span>
            </button>
          )}

          <Link
            href="/requests/create"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Posting Permintaan (Buyer)</span>
          </Link>
        </div>
      </div>

      {/* Interactive Map Section Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Peta Lokasi &amp; Proksimitas Jarak</span>
          </h2>
          <button
            onClick={() => setShowMap(!showMap)}
            className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
          >
            {showMap ? "Sembunyikan Peta" : "Tampilkan Peta Semarang"}
          </button>
        </div>

        {showMap && <ProximityMap listings={filteredListings} requests={filteredRequests} />}
      </div>

      {/* Segmented Toggle Switch (Seller vs Buyer) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("listings")}
            className={cn(
              "px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 cursor-pointer",
              activeTab === "listings"
                ? "bg-white text-emerald-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <span>📦 Sampah Dijual (Seller) ({filteredListings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={cn(
              "px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 cursor-pointer",
              activeTab === "requests"
                ? "bg-white text-emerald-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <span>🔍 Sampah Dicari (Buyer) ({filteredRequests.length})</span>
          </button>
        </div>

        {/* Sort Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSortByDistance(!sortByDistance)}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center space-x-1.5 cursor-pointer",
              sortByDistance
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            )}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{sortByDistance ? "Urutkan: Terdekat (km)" : "Urutkan: Terbaru"}</span>
          </button>
        </div>
      </div>

      {/* Category Pills Filter Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategoryId("all")}
          className={cn(
            "px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors cursor-pointer border",
            selectedCategoryId === "all"
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
          )}
        >
          Semua Kategori
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors cursor-pointer border",
                isSelected
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              )}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* CARDS FEED GRID */}
      {activeTab === "listings" ? (
        filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredListings.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-2">
            <p className="text-sm font-semibold text-slate-700">Tidak ada listing sampah ditemukan</p>
            <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau kategori filter.</p>
          </div>
        )
      ) : filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRequests.map((item) => (
            <RequestCard key={item.id} requestItem={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-sm font-semibold text-slate-700">Belum ada permintaan pembeli</p>
          <p className="text-xs text-slate-500">Jadilah yang pertama memposting permintaan kebutuhan sampah!</p>
        </div>
      )}
    </div>
  );
}
