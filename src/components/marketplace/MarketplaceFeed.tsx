"use client";

import { useState } from "react";
import { ListingCard } from "./ListingCard";
import { RequestCard } from "./RequestCard";
import { ProximityMap } from "@/components/map/ProximityMap";
import { MapPin, Recycle, PlusCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Listing, WasteRequest, WasteCategory } from "@/types";
import { cn } from "@/lib/utils";

interface MarketplaceFeedProps {
  initialListings: Listing[];
  initialRequests: WasteRequest[];
  categories: WasteCategory[];
}

export function MarketplaceFeed({
  initialListings,
  initialRequests,
  categories,
}: MarketplaceFeedProps) {
  const [activeTab, setActiveTab] = useState<"listings" | "requests">("listings");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [sortByDistance, setSortByDistance] = useState<boolean>(true);
  const [showMap, setShowMap] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter listings
  const filteredListings = initialListings
    .filter((item) => {
      if (selectedCategoryId !== "all" && item.categoryId !== selectedCategoryId) {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchCat = item.category?.name?.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        if (!matchTitle && !matchCat && !matchDesc) return false;
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
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchCat = item.category?.name?.toLowerCase().includes(q);
      if (!matchTitle && !matchCat) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Clean Marketplace Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Marketplace Sirkular Semarang
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Pasar Sampah & Limbah Terdekat
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Cari atau tawarkan limbah ampas kopi, kardus bekas, botol plastik PET, dan minyak jelantah langsung dengan pembeli & pengolah terdekat.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href="/matches"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <MapPin className="w-4 h-4" />
            <span>Match Proksimitas (0.8 km)</span>
          </Link>

          <Link
            href="/requests/create"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Posting Kebutuhan Buyer</span>
          </Link>
        </div>
      </div>

      {/* Interactive Map Section Toggle */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Peta Lokasi & Proksimitas Jarak</span>
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

      {/* Navigation Switch Tabs & Interactive Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Toggle Switch */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-200/80 border border-slate-300/60 text-xs font-semibold shadow-xs">
          <button
            onClick={() => setActiveTab("listings")}
            className={cn(
              "px-4 py-2 rounded-xl transition-all duration-150 flex items-center space-x-2 cursor-pointer",
              activeTab === "listings"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Recycle className="w-4 h-4 text-emerald-600" />
            <span>Sampah Siap Jual ({filteredListings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={cn(
              "px-4 py-2 rounded-xl transition-all duration-150 flex items-center space-x-2 cursor-pointer",
              activeTab === "requests"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <span>Permintaan Pembeli ({filteredRequests.length})</span>
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
            "px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-colors cursor-pointer border",
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
                "px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-colors cursor-pointer border",
                isSelected
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Recycle className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Tidak ada listing sampah ditemukan</p>
            <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau kategori filter.</p>
          </div>
        )
      ) : filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((item) => (
            <RequestCard key={item.id} requestItem={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <PlusCircle className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Belum ada permintaan pembeli</p>
          <p className="text-xs text-slate-500">Jadilah yang pertama memposting permintaan kebutuhan sampah!</p>
        </div>
      )}
    </div>
  );
}
