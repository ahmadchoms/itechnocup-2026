"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  PlusCircle,
  Pencil,
  Trash2,
  Compass,
  CheckCircle2,
  Layers,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRupiah, formatIdDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditListingModal } from "./EditListingModal";
import type { ProfileListing, WasteCategoryOption } from "./types";

interface MyListingsTabProps {
  initialListings: ProfileListing[];
  categories: WasteCategoryOption[];
  isSeller: boolean;
}

export function MyListingsTab({
  initialListings,
  categories,
}: MyListingsTabProps) {
  const [listings, setListings] = useState<ProfileListing[]>(initialListings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"semua" | "aktif" | "terjual">("semua");
  const [editingListing, setEditingListing] = useState<ProfileListing | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      if (l.status === "dihapus") return false;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.category?.name.toLowerCase().includes(q);

      if (statusFilter === "aktif") return matchSearch && l.status === "aktif";
      if (statusFilter === "terjual") return matchSearch && l.status === "terjual";
      return matchSearch;
    });
  }, [listings, searchQuery, statusFilter]);

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm("Hapus listing sampah ini? Status akan diarsipkan.")) return;
    setDeletingId(listingId);
    try {
      const res = await fetch(`/api/listings/${listingId}`, { method: "DELETE" });
      if (res.ok) {
        setListings((prev) =>
          prev.map((l) => (l.id === listingId ? { ...l, status: "dihapus" } : l))
        );
      } else {
        const d = await res.json();
        alert(d.error || "Gagal menghapus listing");
      }
    } catch {
      alert("Terjadi kesalahan pada server");
    } finally {
      setDeletingId(null);
    }
  };

  const handleListingUpdated = (updated: ProfileListing) => {
    setListings((prev) =>
      prev.map((l) => (l.id === updated.id ? { ...l, ...updated } : l))
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-zinc-200/80 shadow-2xs">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#8A8778] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama sampah atau kategori..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#F7F4EE] border-zinc-200/80 rounded-full focus-visible:ring-1 focus-visible:ring-[#171717] focus-visible:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#F7F4EE] p-0.5 rounded-full border border-zinc-200/70 text-[11px] font-semibold shrink-0">
            {(["semua", "aktif", "terjual"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={cn(
                  "px-3 py-1 rounded-full capitalize transition-all cursor-pointer",
                  statusFilter === tab
                    ? "bg-white text-[#171717] font-bold shadow-2xs"
                    : "text-[#78766B] hover:text-[#171717]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button: Navigate directly to AI Scanner / Create Page */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/listings/create"
            className="w-full sm:w-auto h-9 px-4 rounded-full bg-[#171717] hover:bg-[#2B2B26] text-white text-xs font-bold shadow-xs gap-1.5 flex items-center justify-center cursor-pointer transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#7A8F5C]" />
            <span>Tambah Sampah</span>
          </Link>
        </div>
      </div>

      {/* Visual Grid of Listings */}
      {filteredListings.length === 0 ? (
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-10 sm:p-14 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-[#F7F4EE] border border-zinc-200 flex items-center justify-center mx-auto text-[#8A8778]">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-display)] font-bold text-sm sm:text-base text-[#171717]">
              {searchQuery ? "Tidak ada listing yang cocok" : "Belum ada listing sampah"}
            </h3>
            <p className="text-xs text-[#78766B] max-w-sm mx-auto mt-1">
              {searchQuery
                ? "Coba gunakan kata kunci pencarian lain atau ubah filter status."
                : "Mulai jual limbah bernilai sirkular Anda dengan foto dan deteksi AI otomatis."}
            </p>
          </div>
          {!searchQuery && (
            <Link
              href="/listings/create"
              className="inline-flex items-center gap-1.5 mt-2 h-9 px-5 rounded-full bg-[#6B7B4F] hover:bg-[#586640] text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Scan Sampah Sekarang</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredListings.map((listing) => {
            const isSold = listing.status === "terjual";

            return (
              <div
                key={listing.id}
                className="group relative flex flex-col rounded-3xl border border-zinc-200/80 bg-white p-3.5 sm:p-4 shadow-2xs transition-all hover:border-zinc-300 hover:shadow-xs"
              >
                {/* Photo Image with Badges */}
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-zinc-100 mb-3 border border-zinc-200/60">
                  <img
                    src={listing.photoUrl || "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500"}
                    alt={listing.title}
                    className={cn(
                      "h-full w-full object-cover transition-transform duration-300 group-hover:scale-103",
                      isSold && "grayscale-40 opacity-70"
                    )}
                  />

                  {/* Top Category Badge */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                    <Badge
                      variant="secondary"
                      className="rounded-full bg-white/95 backdrop-blur-xs px-2.5 py-0.5 text-[10.5px] font-bold text-[#171717] border border-zinc-200/70 shadow-2xs"
                    >
                      {listing.category?.name || "Limbah Sirkular"}
                    </Badge>
                  </div>

                  {/* Top Status Pill */}
                  <div className="absolute top-2.5 right-2.5">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10.5px] font-bold shadow-2xs",
                        isSold
                          ? "bg-zinc-800 text-white"
                          : "bg-[#EFF3E7] text-[#6B7B4F] border border-[#7A8F5C]/30"
                      )}
                    >
                      {isSold ? (
                        "Terjual"
                      ) : (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Aktif</span>
                        </span>
                      )}
                    </Badge>
                  </div>

                  {/* Bottom AI Confidence Tag if exists */}
                  {listing.cvConfidence && (
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#171717]/85 backdrop-blur-xs px-2 py-0.5 text-[9.5px] font-mono font-bold text-white shadow-2xs">
                        <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                        <span>AI {(listing.cvConfidence * 100).toFixed(0)}%</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Info */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <h4 className="font-[family-name:var(--font-display)] font-bold text-sm text-[#171717] line-clamp-1">
                        {listing.title}
                      </h4>
                      <span className="text-[10px] font-mono text-[#8A8778] shrink-0">
                        {formatIdDate(listing.createdAt, { day: "numeric", month: "short" })}
                      </span>
                    </div>

                    {listing.description && (
                      <p className="text-[11px] text-[#78766B] line-clamp-2 leading-relaxed mb-2">
                        {listing.description}
                      </p>
                    )}

                    {/* Weight & Price Stats */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F4EE] border border-zinc-200/60 text-xs">
                      <div>
                        <span className="text-[10px] text-[#78766B] block">Estimasi Bobot</span>
                        <span className="font-mono font-bold text-[#171717]">
                          {listing.estimatedWeightKg ? `${listing.estimatedWeightKg} ${listing.unit || "kg"}` : "-"}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#78766B] block">Estimasi Nilai</span>
                        <span className="font-mono font-extrabold text-[#6B7B4F]">
                          {listing.estimatedPrice ? formatRupiah(listing.estimatedPrice) : "Sesuai Tawar"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-1.5 pt-1 border-t border-zinc-100">
                    {!isSold ? (
                      <Link
                        href={`/listings/match/${listing.id}`}
                        className="flex-1 h-8 rounded-full bg-[#171717] hover:bg-[#2B2B26] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <Compass className="w-3.5 h-3.5 text-[#7A8F5C]" />
                        <span>Cari Pengepul</span>
                      </Link>
                    ) : (
                      <div className="flex-1 h-8 rounded-full bg-zinc-100 text-[#78766B] text-[11px] font-semibold flex items-center justify-center">
                        Transaksi Selesai
                      </div>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingListing(listing)}
                      className="h-8 w-8 rounded-full border-zinc-200 text-[#78766B] hover:text-[#171717] hover:bg-[#F7F4EE] shrink-0 cursor-pointer"
                      title="Edit listing"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={deletingId === listing.id}
                      onClick={() => handleDeleteListing(listing.id)}
                      className="h-8 w-8 rounded-full border-zinc-200 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0 cursor-pointer"
                      title="Hapus listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal Dialog */}
      <EditListingModal
        listing={editingListing}
        categories={categories}
        isOpen={Boolean(editingListing)}
        onClose={() => setEditingListing(null)}
        onSuccess={handleListingUpdated}
      />
    </div>
  );
}
