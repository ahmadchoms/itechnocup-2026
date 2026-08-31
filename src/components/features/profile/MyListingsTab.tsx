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
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRupiah, formatIdDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditListingModal } from "./EditListingModal";
import { deleteListingAction } from "@/actions/listing.actions";
import { toast } from "@/components/ui/sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import type { ProfileListing, WasteCategoryOption } from "@/types";

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
  const [statusFilter, setStatusFilter] = useState<
    "semua" | "aktif" | "terjual"
  >("semua");
  const [editingListing, setEditingListing] = useState<ProfileListing | null>(
    null
  );
  const [listingToDelete, setListingToDelete] = useState<ProfileListing | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      if (l.status === "dihapus") return false;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.category?.name.toLowerCase().includes(q);

      if (statusFilter === "aktif") return matchSearch && l.status === "aktif";
      if (statusFilter === "terjual")
        return matchSearch && l.status === "terjual";
      return matchSearch;
    });
  }, [listings, searchQuery, statusFilter]);

  const confirmDeleteListing = async () => {
    if (!listingToDelete) return;
    const targetId = listingToDelete.id;
    const targetTitle = listingToDelete.title;

    setIsDeleting(true);
    try {
      const res = await deleteListingAction(targetId);
      if (res.success) {
        setListings((prev) =>
          prev.map((l) =>
            l.id === targetId ? { ...l, status: "dihapus" } : l
          )
        );
        toast.success("Listing Berhasil Dihapus", {
          description: `Listing "${targetTitle}" telah diarsipkan dari penawaran.`,
        });
        setListingToDelete(null);
      } else {
        toast.error("Gagal Menghapus Listing", {
          description: res.error || "Terjadi kesalahan pada server.",
        });
      }
    } catch {
      toast.error("Gagal Menghapus Listing", {
        description: "Koneksi terputus. Silakan coba beberapa saat lagi.",
      });
    } finally {
      setIsDeleting(false);
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
              className="pl-9 h-9 text-xs rounded-full bg-[#F7F4EE] border-zinc-200 focus:bg-white transition-colors"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#F7F4EE] p-1 rounded-full border border-zinc-200 self-start sm:self-auto shrink-0">
            {(["semua", "aktif", "terjual"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={cn(
                  "px-3 py-1 text-xs font-semibold rounded-full capitalize transition-all cursor-pointer",
                  statusFilter === st
                    ? "bg-white text-[#171717] shadow-2xs font-bold"
                    : "text-[#78766B] hover:text-[#171717]"
                )}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Create New Listing Button */}
        <Link
          href="/listings/create"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#171717] hover:bg-[#2B2B26] text-white text-xs font-bold transition-colors shrink-0 shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Pasang Sampah Baru</span>
        </Link>
      </div>

      {/* Grid of Listings */}
      {filteredListings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F7F4EE] text-[#8A8778] flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-[#171717]">
              Tidak Ada Listing Sampah
            </h3>
            <p className="text-xs text-[#78766B] max-w-sm mx-auto mt-0.5">
              {searchQuery
                ? "Tidak ada listing sampah yang cocok dengan filter pencarian Anda."
                : "Anda belum memiliki listing sampah aktif. Mulai jual sampah Anda sekarang!"}
            </p>
          </div>
          {!searchQuery && (
            <Link
              href="/listings/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#171717] text-white text-xs font-bold hover:bg-[#2B2B26] transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tambah Listing Pertama</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.map((listing) => {
            const isSold = listing.status === "terjual";

            return (
              <div
                key={listing.id}
                className={cn(
                  "group relative rounded-3xl border bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between",
                  isSold
                    ? "border-zinc-200/60 opacity-80"
                    : "border-zinc-200/80 hover:border-[#171717]"
                )}
              >
                {/* Image & Badges */}
                <div className="relative aspect-4/3 w-full bg-zinc-100 overflow-hidden">
                  <img
                    src={listing.photoUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />

                  {/* Status Overlay Badge */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <Badge
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-xs border-0",
                        isSold
                          ? "bg-zinc-800 text-white"
                          : "bg-[#E8EEDD] text-[#2B3A1C]"
                      )}
                    >
                      {isSold ? "Terjual" : "Aktif di Pasar"}
                    </Badge>

                    {listing.cvConfidence && (
                      <Badge className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-black/60 backdrop-blur-xs text-white border-0 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-[#7A8F5C]" />
                        <span>AI {Math.round(listing.cvConfidence)}%</span>
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-[11px] font-bold text-[#6B7B4F] uppercase tracking-wider">
                        {listing.category?.name || "Sampah"}
                      </span>
                      <span className="text-[10px] font-mono text-[#8A8778] shrink-0">
                        {formatIdDate(listing.createdAt, {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-sm text-[#171717] line-clamp-1 mb-1 group-hover:text-[#6B7B4F] transition-colors">
                      {listing.title}
                    </h3>

                    {listing.description && (
                      <p className="text-[11px] text-[#78766B] line-clamp-2 leading-relaxed mb-2">
                        {listing.description}
                      </p>
                    )}

                    {/* Weight & Price Stats */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F4EE] border border-zinc-200/60 text-xs">
                      <div>
                        <span className="text-[10px] text-[#78766B] block">
                          Estimasi Bobot
                        </span>
                        <span className="font-mono font-bold text-[#171717]">
                          {listing.estimatedWeightKg
                            ? `${listing.estimatedWeightKg} ${listing.unit || "kg"}`
                            : "-"}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#78766B] block">
                          Estimasi Nilai
                        </span>
                        <span className="font-mono font-extrabold text-[#6B7B4F]">
                          {listing.estimatedPrice
                            ? formatRupiah(listing.estimatedPrice)
                            : "Sesuai Tawar"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-1.5 pt-2 border-t border-zinc-100">
                    {!isSold ? (
                      <Link
                        href={`/listings/match/${listing.id}`}
                        className="flex-1 h-8 rounded-full bg-[#171717] hover:bg-[#2B2B26] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5 text-[#7A8F5C]" />
                        <span>Cari Pengepul</span>
                      </Link>
                    ) : (
                      <div className="flex-1 h-8 rounded-full bg-zinc-100 text-[#78766B] text-[11px] font-semibold flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        <span>Transaksi Selesai</span>
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
                      onClick={() => setListingToDelete(listing)}
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

      {/* Alert Dialog Konfirmasi Hapus Listing */}
      <AlertDialog
        open={Boolean(listingToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setListingToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-600 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <AlertDialogTitle>Hapus Listing Sampah?</AlertDialogTitle>
                <span className="text-[11px] text-[#78766B] font-medium block">
                  Tindakan ini akan mengarsipkan penawaran Anda
                </span>
              </div>
            </div>

            <AlertDialogDescription className="pt-2">
              Apakah Anda yakin ingin menghapus listing{" "}
              <strong className="text-[#171717]">
                &ldquo;{listingToDelete?.title}&rdquo;
              </strong>
              ? Listing ini tidak akan lagi ditampilkan ke pengepul dan riwayat
              pencocokan akan ditutup.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              onClick={() => setListingToDelete(null)}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteListing}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                <span>Ya, Hapus Listing</span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
