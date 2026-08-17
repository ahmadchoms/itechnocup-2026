"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Scale, PlusCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RequestsClientProps {
  initialRequests: any[];
  categories: { id: string; name: string }[];
  currentRole?: string;
}

export function RequestsClient({ initialRequests, categories, currentRole = "guest" }: RequestsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRequests = initialRequests.filter((req) => {
    const matchesCategory =
      selectedCategory === "all" || req.categoryId === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.address?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Katalog Permintaan Sampah (Buyer)
          </h1>
          <p className="text-xs text-slate-500">
            Daftar kebutuhan sampah/limbah yang sedang dicari oleh Buyer &amp; Petani di lokasi terdekat.
          </p>
        </div>

        {currentRole === "buyer" && (
          <Link
            href="/buyer/requests/create"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold transition-colors inline-flex items-center space-x-2 shrink-0 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Permintaan Baru (Buyer)</span>
          </Link>
        )}
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kebutuhan ampas kopi, kardus, plastik..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 focus:border-emerald-500 rounded-xl focus:outline-none transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 shrink-0">
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0",
              selectedCategory === "all"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            )}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0",
                selectedCategory === cat.id
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
          <p className="font-semibold text-slate-700">Tidak ada permintaan ditemukan</p>
          <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian atau kategori filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {req.category?.name}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(req.createdAt).toLocaleDateString("id-ID")}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-tight">
                    {req.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {req.description || "Tidak ada deskripsi."}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Penawaran Harga:</span>
                    <span className="font-extrabold text-amber-600">
                      Rp {req.offeredPrice.toLocaleString("id-ID")} / {req.unit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Jumlah Dicari:</span>
                    <span className="font-bold text-slate-800">
                      {req.quantityWanted ? `${req.quantityWanted} ${req.unit}` : "-"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{req.address}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100">
                <Link
                  href={`/requests/${req.id}`}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>Lihat Detail &amp; Tawarkan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
