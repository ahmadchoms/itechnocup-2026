"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Trash2,
  RotateCcw,
  FileText,
  MapPin,
  Package,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  Calendar,
  Layers,
  Coins,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { moderateRequestAction } from "@/actions/admin.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AdminRequestItem, CategoryItem } from "@/types";

interface AdminRequestsClientProps {
  initialRequests: AdminRequestItem[];
  categories: CategoryItem[];
}

export function AdminRequestsClient({ initialRequests, categories }: AdminRequestsClientProps) {
  const [requests, setRequests] = useState<AdminRequestItem[]>(initialRequests || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "aktif" | "terpenuhi" | "dibatalkan">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [inspectingRequest, setInspectingRequest] = useState<AdminRequestItem | null>(null);
  const [requestToDelete, setRequestToDelete] = useState<AdminRequestItem | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = requests.length;
    const active = requests.filter((r) => r.status === "aktif");
    const fulfilled = requests.filter((r) => r.status === "terpenuhi");
    const cancelled = requests.filter((r) => r.status === "dibatalkan");

    return {
      total,
      activeCount: active.length,
      fulfilledCount: fulfilled.length,
      cancelledCount: cancelled.length,
    };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesCategory = selectedCategory === "all" || r.categoryId === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.buyer.fullName.toLowerCase().includes(q) ||
        r.category.name.toLowerCase().includes(q) ||
        (r.address && r.address.toLowerCase().includes(q)) ||
        (r.description && r.description.toLowerCase().includes(q));

      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [requests, statusFilter, selectedCategory, searchQuery]);

  const handleDeleteRequest = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      const res = await moderateRequestAction(requestId, "dibatalkan");

      if (res.success) {
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: "dibatalkan" } : r))
        );
        if (inspectingRequest?.id === requestId) {
          setInspectingRequest((prev) => (prev ? { ...prev, status: "dibatalkan" } : null));
        }
        setRequestToDelete(null);
      } else {
        alert(res.error || "Gagal memoderasi permintaan.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memoderasi permintaan.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRestoreRequest = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      const res = await moderateRequestAction(requestId, "aktif");

      if (res.success) {
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: "aktif" } : r))
        );
        if (inspectingRequest?.id === requestId) {
          setInspectingRequest((prev) => (prev ? { ...prev, status: "aktif" } : null));
        }
      } else {
        alert(res.error || "Gagal memulihkan permintaan.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memulihkan permintaan.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
            Katalog &amp; Moderasi Permintaan Sampah
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau kebutuhan pasokan material yang dipasang oleh pengepul dan lakukan moderasi permintaan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Permintaan
            </span>
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.total}{" "}
            <span className="text-xs font-semibold text-slate-500">Kebutuhan</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Kebutuhan sampah dari pengepul
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Permintaan Aktif
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-primary" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.activeCount}{" "}
            <span className="text-xs font-semibold text-emerald-primary">Membuka Pasokan</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Siap dipasok oleh penjual
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Terpenuhi
            </span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.fulfilledCount}{" "}
            <span className="text-xs font-semibold text-blue-600">Selesai</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Target kuota sampah tercapai
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Dibatalkan
            </span>
            <ShieldAlert className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.cancelledCount}{" "}
            <span className="text-xs font-semibold text-slate-500">Nonaktif</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Dibatalkan atau dimoderasi
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
              onClick={() => setStatusFilter("terpenuhi")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "terpenuhi"
                  ? "bg-white text-blue-700 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Terpenuhi ({stats.fulfilledCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("dibatalkan")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "dibatalkan"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Dibatalkan ({stats.cancelledCount})
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
                placeholder="Cari judul, pengepul, lokasi..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-colors"
              />
            </div>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900">
              Tidak ada data permintaan sampah
            </p>
            <p className="text-[11px] text-slate-400">
              {searchQuery || selectedCategory !== "all"
                ? "Tidak ditemukan permintaan yang cocok dengan filter atau kata kunci pencarian."
                : "Belum ada permintaan yang terdaftar pada filter status ini."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10.5px] font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-4 font-semibold">Judul &amp; Kebutuhan Material</th>
                  <th className="pb-3 pr-4 font-semibold">Kategori</th>
                  <th className="pb-3 pr-4 font-semibold">Pengepul (Buyer)</th>
                  <th className="pb-3 pr-4 font-semibold">Target Volume &amp; Tawaran Harga</th>
                  <th className="pb-3 pr-4 font-semibold">Status</th>
                  <th className="pb-3 text-right font-semibold">Aksi Moderasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="font-bold text-slate-900 text-xs max-w-xs truncate">
                        {r.title}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate max-w-xs">{r.address || "Lokasi tidak diset"}</span>
                      </div>
                    </td>

                    <td className="py-3.5 pr-4">
                      <Badge variant="outline" className="text-[10.5px] font-bold bg-sage/60 text-slate-800 border-slate-200">
                        {r.category.name}
                      </Badge>
                    </td>

                    <td className="py-3.5 pr-4">
                      <div className="font-semibold text-slate-900">{r.buyer.fullName}</div>
                      <div className="text-[11px] text-slate-400">{r.buyer.email}</div>
                    </td>

                    <td className="py-3.5 pr-4">
                      <div className="font-bold text-slate-900">
                        Rp {r.offeredPrice.toLocaleString("id-ID")}{" "}
                        <span className="text-[10.5px] text-slate-400 font-normal">/{r.unit || "kg"}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Target: {r.quantityWanted ? `${r.quantityWanted} ${r.unit || "kg"}` : "Fleksibel"}
                      </div>
                    </td>

                    <td className="py-3.5 pr-4">
                      {r.status === "aktif" ? (
                        <Badge variant="outline" className="text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border-emerald-200">
                          Aktif
                        </Badge>
                      ) : r.status === "terpenuhi" ? (
                        <Badge variant="outline" className="text-[10.5px] font-semibold bg-blue-50 text-blue-700 border-blue-200">
                          Terpenuhi
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10.5px] font-semibold bg-slate-100 text-slate-600 border-slate-200">
                          Dibatalkan
                        </Badge>
                      )}
                    </td>

                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setInspectingRequest(r)}
                          className="h-8 px-2.5 rounded-full text-xs font-semibold border-slate-200 hover:bg-slate-100 text-slate-800"
                        >
                          Detail
                        </Button>

                        {r.status !== "dibatalkan" ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setRequestToDelete(r)}
                            className="h-8 px-2.5 rounded-full border-red-200 bg-red-50/60 hover:bg-red-100 text-red-700 text-xs font-semibold"
                            title="Batalkan Permintaan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={processingId === r.id}
                            onClick={() => handleRestoreRequest(r.id)}
                            className="h-8 px-2.5 rounded-full border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold gap-1"
                          >
                            {processingId === r.id ? (
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

      <Dialog open={!!inspectingRequest} onOpenChange={(open) => !open && setInspectingRequest(null)}>
        <DialogContent className="sm:max-w-xl p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl">
          {inspectingRequest && (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-bold text-slate-900">
                    Detail Permintaan Sampah
                  </DialogTitle>
                  <Badge
                    variant="outline"
                    className={`text-[11px] font-bold capitalize ${
                      inspectingRequest.status === "aktif"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : inspectingRequest.status === "terpenuhi"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {inspectingRequest.status}
                  </Badge>
                </div>
                <DialogDescription className="text-xs text-slate-500 mt-1">
                  Dipasang pada {new Date(inspectingRequest.createdAt).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" })}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{inspectingRequest.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10.5px] font-bold bg-sage text-slate-800 border-slate-200">
                      {inspectingRequest.category.name}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-sage/30 border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Tawaran Harga Beli
                    </span>
                    <p className="font-extrabold text-slate-900 mt-0.5">
                      Rp {inspectingRequest.offeredPrice.toLocaleString("id-ID")} /{inspectingRequest.unit || "kg"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Target Volume
                    </span>
                    <p className="font-extrabold text-slate-900 mt-0.5">
                      {inspectingRequest.quantityWanted
                        ? `${inspectingRequest.quantityWanted} ${inspectingRequest.unit || "kg"}`
                        : "Fleksibel"}
                    </p>
                  </div>
                </div>

                {inspectingRequest.description && (
                  <div>
                    <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                      Kebutuhan Spesifikasi
                    </span>
                    <p className="text-xs text-slate-700 mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {inspectingRequest.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Pengepul
                  </span>
                  <p className="font-bold text-slate-900 mt-0.5">{inspectingRequest.buyer.fullName}</p>
                  <p className="text-[11px] text-slate-500">{inspectingRequest.buyer.email}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Alamat Drop Point / Gudang
                  </span>
                  <p className="font-medium text-slate-700 mt-0.5 leading-relaxed">
                    {inspectingRequest.address || "Lokasi tidak dicantumkan"}
                  </p>
                </div>
              </div>

              <DialogFooter className="flex flex-row gap-2.5 justify-end pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInspectingRequest(null)}
                  className="h-9 px-4 rounded-full text-xs font-semibold"
                >
                  Tutup
                </Button>
                {inspectingRequest.status !== "dibatalkan" ? (
                  <Button
                    type="button"
                    onClick={() => setRequestToDelete(inspectingRequest)}
                    className="h-9 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Batalkan Permintaan</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={processingId === inspectingRequest.id}
                    onClick={() => handleRestoreRequest(inspectingRequest.id)}
                    className="h-9 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold gap-1.5"
                  >
                    {processingId === inspectingRequest.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Pulihkan Permintaan</span>
                      </>
                    )}
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!requestToDelete} onOpenChange={(open) => !open && setRequestToDelete(null)}>
        <DialogContent className="sm:max-w-md p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl">
          {requestToDelete && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-slate-900">
                  Konfirmasi Pembatalan Permintaan
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 mt-1">
                  Permintaan &quot;{requestToDelete.title}&quot; akan dinonaktifkan dari bursa permintaan publik.
                </DialogDescription>
              </DialogHeader>

              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                Tindakan ini dapat dipulihkan kembali oleh administrator sewaktu-waktu.
              </div>

              <DialogFooter className="flex flex-row gap-2.5 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRequestToDelete(null)}
                  className="h-9 px-4 rounded-full text-xs font-semibold"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  disabled={processingId === requestToDelete.id}
                  onClick={() => handleDeleteRequest(requestToDelete.id)}
                  className="h-9 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold gap-1.5"
                >
                  {processingId === requestToDelete.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Batalkan</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
