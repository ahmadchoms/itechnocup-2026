"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Trash2,
  RotateCcw,
  Eye,
  FileText,
  MapPin,
  Sparkles,
  ExternalLink,
  Package,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  X,
  Calendar,
  Layers,
  Scale,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { moderateListingAction } from "@/actions/admin.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AdminListingItem, CategoryItem } from "@/types";
import { toast } from "@/components/ui/sonner";

interface ListingsClientProps {
  initialListings: AdminListingItem[];
  categories: { id: string; name: string }[];
}

export function ListingsClient({ initialListings, categories }: ListingsClientProps) {
  const [listings, setListings] = useState<AdminListingItem[]>(initialListings || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "aktif" | "terjual" | "dihapus">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [inspectingListing, setInspectingListing] = useState<AdminListingItem | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<{ url: string; title: string } | null>(null);
  const [listingToDelete, setListingToDelete] = useState<AdminListingItem | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = listings.length;
    const active = listings.filter((l) => l.status === "aktif");
    const sold = listings.filter((l) => l.status === "terjual");
    const deleted = listings.filter((l) => l.status === "dihapus");
    const totalActiveVolume = active.reduce((acc, l) => acc + (l.estimatedWeightKg || 0), 0);

    return {
      total,
      activeCount: active.length,
      soldCount: sold.length,
      deletedCount: deleted.length,
      totalActiveVolume: Number(totalActiveVolume.toFixed(1)),
    };
  }, [listings]);

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      const matchesStatus = statusFilter === "all" || l.status === statusFilter;
      const matchesCategory = selectedCategory === "all" || l.categoryId === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.seller.fullName.toLowerCase().includes(q) ||
        l.category.name.toLowerCase().includes(q) ||
        (l.address && l.address.toLowerCase().includes(q)) ||
        (l.description && l.description.toLowerCase().includes(q));

      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [listings, statusFilter, selectedCategory, searchQuery]);

  const handleDeleteListing = async (listingId: string) => {
    setProcessingId(listingId);
    try {
      const res = await moderateListingAction(listingId, "dihapus");

      if (res.success) {
        setListings((prev) =>
          prev.map((l) => (l.id === listingId ? { ...l, status: "dihapus" } : l))
        );
        if (inspectingListing?.id === listingId) {
          setInspectingListing((prev) => (prev ? { ...prev, status: "dihapus" } : null));
        }
        setListingToDelete(null);
      } else {
        toast.error(res.error || "Gagal menghapus listing.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat memoderasi listing.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRestoreListing = async (listingId: string) => {
    setProcessingId(listingId);
    try {
      const res = await moderateListingAction(listingId, "aktif");

      if (res.success) {
        setListings((prev) =>
          prev.map((l) => (l.id === listingId ? { ...l, status: "aktif" } : l))
        );
        if (inspectingListing?.id === listingId) {
          setInspectingListing((prev) => (prev ? { ...prev, status: "aktif" } : null));
        }
      } else {
        toast.error(res.error || "Gagal memulihkan listing.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat memulihkan listing.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
            Katalog &amp; Moderasi Listing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola pasokan limbah aktif, pantau prediksi klasifikasi AI, dan lakukan moderasi konten marketplace.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Listing
            </span>
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.total}{" "}
            <span className="text-xs font-semibold text-slate-500">Pasokan</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Akumulasi seluruh postingan limbah
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Listing Aktif
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-primary" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.activeCount}{" "}
            <span className="text-xs font-semibold text-emerald-primary">Tersedia</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {stats.totalActiveVolume.toLocaleString("id-ID")} kg siap dijemput pengepul
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Limbah Terjual
            </span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.soldCount}{" "}
            <span className="text-xs font-semibold text-blue-600">Terdistribusi</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Berhasil terserap ke daur ulang
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Dimoderasi
            </span>
            <ShieldAlert className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.deletedCount}{" "}
            <span className="text-xs font-semibold text-slate-500">Dihapus</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Dinonaktifkan oleh administrator
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100/80 border border-slate-200/60 w-fit">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Semua ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("aktif")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "aktif"
                  ? "bg-white text-emerald-700 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Aktif ({stats.activeCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("terjual")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "terjual"
                  ? "bg-white text-blue-700 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Terjual ({stats.soldCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("dihapus")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "dihapus"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Dihapus ({stats.deletedCount})
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-slate-400 cursor-pointer"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul, penjual, alamat..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-colors"
              />
            </div>
          </div>
        </div>

        {filteredListings.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900">
              Tidak ada data listing sampah
            </p>
            <p className="text-[11px] text-slate-400">
              {searchQuery || selectedCategory !== "all"
                ? "Tidak ditemukan listing yang sesuai dengan filter atau kata kunci pencarian."
                : "Belum ada postingan limbah pada filter status ini."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10.5px] font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-4 font-semibold">Foto &amp; Informasi Sampah</th>
                  <th className="pb-3 pr-4 font-semibold">Kategori</th>
                  <th className="pb-3 pr-4 font-semibold">Penjual (Seller)</th>
                  <th className="pb-3 pr-4 font-semibold">Volume &amp; Estimasi Harga</th>
                  <th className="pb-3 pr-4 font-semibold">Status</th>
                  <th className="pb-3 text-right font-semibold">Aksi Moderasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredListings.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => setPreviewImageUrl({ url: l.photoUrl, title: l.title })}
                          className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 cursor-pointer group relative"
                        >
                          <img
                            src={l.photoUrl}
                            alt={l.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Eye className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-xs truncate max-w-xs">
                            {l.title}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate max-w-xs">{l.address || "Lokasi tidak diset"}</span>
                          </div>
                          {l.cvConfidence !== null && (
                            <div className="inline-flex items-center gap-1 px-1.5 py-0.2 mt-1 rounded-md bg-sage text-[9.5px] font-bold text-emerald-primary">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>AI {l.cvConfidence}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 pr-4">
                      <Badge variant="outline" className="text-[10.5px] font-bold bg-sage/60 text-slate-800 border-slate-200">
                        {l.category.name}
                      </Badge>
                    </td>

                    <td className="py-3.5 pr-4">
                      <div className="font-semibold text-slate-900">{l.seller.fullName}</div>
                      <div className="text-[11px] text-slate-400">{l.seller.email}</div>
                    </td>

                    <td className="py-3.5 pr-4">
                      <div className="font-bold text-slate-900">
                        {l.estimatedPrice
                          ? `Rp ${l.estimatedPrice.toLocaleString("id-ID")}`
                          : "-"}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {l.estimatedWeightKg ? `${l.estimatedWeightKg} ${l.unit || "kg"}` : "-"}
                      </div>
                    </td>

                    <td className="py-3.5 pr-4">
                      {l.status === "aktif" ? (
                        <Badge variant="outline" className="text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border-emerald-200">
                          Aktif
                        </Badge>
                      ) : l.status === "terjual" ? (
                        <Badge variant="outline" className="text-[10.5px] font-semibold bg-blue-50 text-blue-700 border-blue-200">
                          Terjual
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10.5px] font-semibold bg-slate-100 text-slate-600 border-slate-200">
                          Dihapus
                        </Badge>
                      )}
                    </td>

                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setInspectingListing(l)}
                          className="h-8 px-2.5 rounded-full text-xs font-semibold border-slate-200 hover:bg-slate-100 text-slate-800"
                        >
                          Detail
                        </Button>

                        {l.status !== "dihapus" ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setListingToDelete(l)}
                            className="h-8 px-2.5 rounded-full border-red-200 bg-red-50/60 hover:bg-red-100 text-red-700 text-xs font-semibold"
                            title="Hapus Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={processingId === l.id}
                            onClick={() => handleRestoreListing(l.id)}
                            className="h-8 px-2.5 rounded-full border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold gap-1"
                          >
                            {processingId === l.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <RotateCcw className="w-3 h-3" />
                                <span>Pulihkan</span>
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={!!inspectingListing} onOpenChange={(open) => !open && setInspectingListing(null)}>
        <DialogContent className="sm:max-w-2xl p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl">
          {inspectingListing && (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-bold text-slate-900">
                    Detail Listing Sampah
                  </DialogTitle>
                  <Badge
                    variant="outline"
                    className={`text-[11px] font-bold capitalize ${
                      inspectingListing.status === "aktif"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : inspectingListing.status === "terjual"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {inspectingListing.status}
                  </Badge>
                </div>
                <DialogDescription className="text-xs text-slate-500 mt-1">
                  Dipublikasikan pada {new Date(inspectingListing.createdAt).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" })}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  onClick={() => setPreviewImageUrl({ url: inspectingListing.photoUrl, title: inspectingListing.title })}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer group shadow-2xs"
                >
                  <img
                    src={inspectingListing.photoUrl}
                    alt={inspectingListing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                    <Eye className="w-4 h-4" />
                    <span>Perbesar</span>
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{inspectingListing.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10.5px] font-bold bg-sage text-slate-800 border-slate-200">
                        {inspectingListing.category.name}
                      </Badge>
                      {inspectingListing.condition && (
                        <span className="text-xs text-slate-500">
                          Kondisi: <span className="font-semibold text-slate-700">{inspectingListing.condition}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-sage/30 border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Estimasi Harga
                      </span>
                      <p className="font-extrabold text-slate-900 mt-0.5">
                        {inspectingListing.estimatedPrice
                          ? `Rp ${inspectingListing.estimatedPrice.toLocaleString("id-ID")}`
                          : "Gratis / Donasi"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Estimasi Berat
                      </span>
                      <p className="font-extrabold text-slate-900 mt-0.5">
                        {inspectingListing.estimatedWeightKg
                          ? `${inspectingListing.estimatedWeightKg} ${inspectingListing.unit || "kg"}`
                          : "-"}
                      </p>
                    </div>
                  </div>

                  {inspectingListing.description && (
                    <div>
                      <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                        Deskripsi Sampah
                      </span>
                      <p className="text-xs text-slate-700 mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {inspectingListing.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Penjual
                  </span>
                  <p className="font-bold text-slate-900 mt-0.5">{inspectingListing.seller.fullName}</p>
                  <p className="text-[11px] text-slate-500">{inspectingListing.seller.email}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Lokasi Penjemputan
                  </span>
                  <p className="font-medium text-slate-700 mt-0.5 leading-relaxed">
                    {inspectingListing.address || "Lokasi tidak dicantumkan"}
                  </p>
                </div>
              </div>

              <DialogFooter className="flex flex-row gap-2.5 justify-end pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInspectingListing(null)}
                  className="h-9 px-4 rounded-full text-xs font-semibold"
                >
                  Tutup
                </Button>
                <Link href={`/listings/match/${inspectingListing.id}`} target="_blank">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 px-4 rounded-full text-xs font-semibold gap-1.5"
                  >
                    <span>Lihat Halaman Match</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                {inspectingListing.status !== "dihapus" ? (
                  <Button
                    type="button"
                    onClick={() => {
                      setListingToDelete(inspectingListing);
                    }}
                    className="h-9 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Listing</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={processingId === inspectingListing.id}
                    onClick={() => handleRestoreListing(inspectingListing.id)}
                    className="h-9 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold gap-1.5"
                  >
                    {processingId === inspectingListing.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Pulihkan Listing</span>
                      </>
                    )}
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!listingToDelete} onOpenChange={(open) => !open && setListingToDelete(null)}>
        <DialogContent className="sm:max-w-md p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl">
          {listingToDelete && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-slate-900">
                  Konfirmasi Hapus Listing
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 mt-1">
                  Listing &quot;{listingToDelete.title}&quot; akan dinonaktifkan dari katalog marketplace publik.
                </DialogDescription>
              </DialogHeader>

              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                Tindakan moderasi ini dapat dipulihkan kembali oleh administrator sewaktu-waktu.
              </div>

              <DialogFooter className="flex flex-row gap-2.5 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setListingToDelete(null)}
                  className="h-9 px-4 rounded-full text-xs font-semibold"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  disabled={processingId === listingToDelete.id}
                  onClick={() => handleDeleteListing(listingToDelete.id)}
                  className="h-9 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold gap-1.5"
                >
                  {processingId === listingToDelete.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Listing</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewImageUrl} onOpenChange={(open) => !open && setPreviewImageUrl(null)}>
        <DialogContent className="sm:max-w-3xl p-4 rounded-3xl bg-white border border-slate-200 shadow-2xl">
          {previewImageUrl && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{previewImageUrl.title}</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewImageUrl(null)}
                  className="h-7 w-7 p-0 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="max-h-[75vh] overflow-hidden rounded-2xl border border-slate-200 bg-black/5 flex items-center justify-center">
                <img
                  src={previewImageUrl.url}
                  alt={previewImageUrl.title}
                  className="max-h-[70vh] w-auto object-contain rounded-xl"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
