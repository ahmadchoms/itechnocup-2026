"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  PlusCircle,
  Pencil,
  Trash2,
  Compass,
  CheckCircle2,
  RotateCcw,
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
import { deleteListingAction, toggleListingStatusAction } from "@/actions/listing.actions";
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
  isSeller,
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
  const [togglingId, setTogglingId] = useState<string | null>(null);

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

  const handleToggleStatus = async (listing: ProfileListing) => {
    const newStatus = listing.status === "aktif" ? "terjual" : "aktif";
    setTogglingId(listing.id);

    try {
      const res = await toggleListingStatusAction(listing.id, newStatus);
      if (res.success) {
        setListings((prev) =>
          prev.map((l) =>
            l.id === listing.id ? { ...l, status: newStatus } : l
          )
        );
        toast.success(
          newStatus === "terjual"
            ? "Listing Ditandai Terjual"
            : "Listing Diaktifkan Kembali",
          {
            description:
              newStatus === "terjual"
                ? `Listing "${listing.title}" telah ditandai terjual.`
                : `Listing "${listing.title}" kini kembali aktif di marketplace.`,
          }
        );
      } else {
        toast.error("Gagal Mengubah Status", {
          description: res.error || "Terjadi kesalahan pada server.",
        });
      }
    } catch {
      toast.error("Gagal Mengubah Status", {
        description: "Koneksi terputus. Silakan coba lagi.",
      });
    } finally {
      setTogglingId(null);
    }
  };

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
          description: `Listing "${targetTitle}" telah diarsipkan dari marketplace.`,
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

  const handleListingUpdated = (updatedListing: ProfileListing) => {
    setListings((prev) =>
      prev.map((l) => (l.id === updatedListing.id ? { ...l, ...updatedListing } : l))
    );
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#78766B]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari listing sampah..."
            className="pl-9 h-9 text-xs rounded-full bg-[#FAF8F5] border-zinc-200"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-full border border-zinc-200 text-xs">
            {(["semua", "aktif", "terjual"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={cn(
                  "px-3 py-1 rounded-full capitalize font-semibold transition-colors cursor-pointer",
                  statusFilter === tab
                    ? "bg-white text-[#171717] shadow-2xs font-bold"
                    : "text-[#78766B] hover:text-[#171717]",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <Link
            href="/listings/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#171717] text-white text-xs font-bold hover:bg-[#2B2B26] transition-colors shadow-2xs shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#7A8F5C]" />
            <span className="hidden sm:inline">Jual Sampah</span>
          </Link>
        </div>
      </div>

      {/* Grid of Listings Cards */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-zinc-200 bg-[#FAF8F5] space-y-3">
          <div className="w-12 h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center mx-auto text-[#6B7B4F] shadow-2xs">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-[#171717]">
              Tidak Ada Listing Sampah
            </h3>
            <p className="text-xs text-[#78766B] max-w-sm mx-auto mt-0.5">
              {searchQuery
                ? "Tidak ada listing sampah yang cocok dengan filter pencarian Anda."
                : "Anda belum mendaftarkan listing limbah daur ulang. Pasang iklan sekarang agar pengepul sekitar dapat menemukan barang Anda!"}
            </p>
          </div>
          {!searchQuery && (
            <Link
              href="/listings/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#171717] text-white text-xs font-bold hover:bg-[#2B2B26] transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Jual Sampah Pertama</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.map((listing) => {
            const isSold = listing.status === "terjual";
            const isToggling = togglingId === listing.id;

            return (
              <div
                key={listing.id}
                className={cn(
                  "group relative rounded-3xl border bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between",
                  isSold
                    ? "border-zinc-200/60 opacity-85 bg-[#FAF8F5]/40"
                    : "border-zinc-200/80 hover:border-[#171717]",
                )}
              >
                {/* Photo Header */}
                <div className="relative aspect-16/9 w-full bg-zinc-100 overflow-hidden">
                  <Image
                    src={
                      listing.photoUrl ||
                      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600"
                    }
                    alt={listing.title}
                    fill
                    className={cn(
                      "object-cover group-hover:scale-105 transition-transform duration-300",
                      isSold && "grayscale-30",
                    )}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1">
                    <Badge className="rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-white/95 text-[#171717] backdrop-blur-xs border-0 shadow-2xs">
                      {listing.category?.name || "Limbah Sirkular"}
                    </Badge>
                    <Badge
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold border-0 backdrop-blur-xs",
                        isSold
                          ? "bg-zinc-900/90 text-white"
                          : "bg-emerald-600/90 text-white",
                      )}
                    >
                      {isSold ? "Terjual" : "Siap COD"}
                    </Badge>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[10px]">
                    <span className="font-mono">
                      {listing.createdAt
                        ? formatIdDate(listing.createdAt, {
                            day: "numeric",
                            month: "short",
                          })
                        : "-"}
                    </span>
                    {listing.cvConfidence && (
                      <span className="flex items-center gap-1 font-bold">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        AI: {Number(listing.cvConfidence).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-display font-bold text-sm text-[#171717] line-clamp-1 group-hover:text-[#6B7B4F] transition-colors">
                        {listing.title}
                      </h3>
                      {listing.description && (
                        <p className="mt-0.5 text-[11px] text-[#78766B] line-clamp-2 leading-relaxed">
                          {listing.description}
                        </p>
                      )}
                    </div>

                    {/* Weight & Price Box */}
                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#F7F4EE] border border-zinc-200/60 text-xs">
                      <div>
                        <span className="text-[10px] text-[#78766B] block">
                          Sisa Bobot
                        </span>
                        <span className="font-mono font-bold text-[#171717]">
                          {listing.estimatedWeightKg || listing.quantity
                            ? `${listing.estimatedWeightKg || listing.quantity} ${listing.unit || "kg"}`
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
                    {/* Manual Toggle Status Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isToggling}
                      onClick={() => handleToggleStatus(listing)}
                      className={cn(
                        "h-8 rounded-full text-[11px] font-bold flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer border-zinc-200 px-2.5",
                        isSold
                          ? "bg-white hover:bg-zinc-100 text-[#171717]"
                          : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200"
                      )}
                      title={isSold ? "Buka kembali listing sampah" : "Tandai listing sampah telah terjual"}
                    >
                      {isToggling ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : isSold ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Buka Kembali</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tandai Terjual</span>
                        </>
                      )}
                    </Button>

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
                        <span>Terjual</span>
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

      {/* Alert Dialog Konfirmasi Hapus */}
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
                  Tindakan ini akan mengarsipkan listing Anda dari marketplace
                </span>
              </div>
            </div>

            <AlertDialogDescription className="pt-2">
              Apakah Anda yakin ingin menghapus listing{" "}
              <strong className="text-[#171717]">
                &ldquo;{listingToDelete?.title}&rdquo;
              </strong>
              ? Data ini tidak akan lagi ditampilkan ke pengepul di halaman pencarian.
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
