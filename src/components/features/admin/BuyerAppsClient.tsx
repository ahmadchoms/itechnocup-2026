"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Check,
  X,
  FileText,
  MapPin,
  Building2,
  Calendar,
  Eye,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { approveBuyerAppAction, rejectBuyerAppAction } from "@/actions/admin.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { BuyerApplicationItem } from "@/types";
import { toast } from "@/components/ui/sonner";

interface BuyerAppsClientProps {
  initialBuyerApplications: BuyerApplicationItem[];
}

export function BuyerAppsClient({ initialBuyerApplications }: BuyerAppsClientProps) {
  const [buyerApps, setBuyerApps] = useState<BuyerApplicationItem[]>(initialBuyerApplications || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "menunggu" | "disetujui" | "ditolak">("all");
  
  const [inspectingApp, setInspectingApp] = useState<BuyerApplicationItem | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<{ url: string; title: string } | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = buyerApps.length;
    const pending = buyerApps.filter((a) => a.status === "menunggu").length;
    const approved = buyerApps.filter((a) => a.status === "disetujui").length;
    const rejected = buyerApps.filter((a) => a.status === "ditolak").length;
    return { total, pending, approved, rejected };
  }, [buyerApps]);

  const filteredApps = useMemo(() => {
    return buyerApps.filter((app) => {
      const matchesStatus = statusFilter === "all" || app.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        app.user.fullName.toLowerCase().includes(q) ||
        app.user.email.toLowerCase().includes(q) ||
        app.address.toLowerCase().includes(q) ||
        (app.npwp && app.npwp.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [buyerApps, searchQuery, statusFilter]);

  const handleApproveBuyer = async (appId: string) => {
    setProcessingId(appId);
    try {
      const res = await approveBuyerAppAction(appId);
      if (res.success) {
        setBuyerApps((prev) =>
          prev.map((app) =>
            app.id === appId ? { ...app, status: "disetujui" } : app
          )
        );
        if (inspectingApp?.id === appId) {
          setInspectingApp((prev) => (prev ? { ...prev, status: "disetujui" } : null));
        }
      } else {
        toast.error(res.error || "Gagal menyetujui pengepul");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat memproses pengajuan");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectBuyer = async (appId: string) => {
    setProcessingId(appId);
    try {
      const res = await rejectBuyerAppAction(appId);
      if (res.success) {
        setBuyerApps((prev) =>
          prev.map((app) =>
            app.id === appId ? { ...app, status: "ditolak" } : app
          )
        );
        if (inspectingApp?.id === appId) {
          setInspectingApp((prev) => (prev ? { ...prev, status: "ditolak" } : null));
        }
      } else {
        toast.error(res.error || "Gagal menolak pengepul");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat memproses penolakan");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
            Verifikasi Pengajuan Pengepul
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tinjau identitas KTP dan foto gudang operasional untuk memberikan status verifikasi akun pengepul resmi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Menunggu Verifikasi
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.pending}{" "}
            <span className="text-xs font-semibold text-amber-600">Pengajuan</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Prioritas tindakan verifikasi operasional
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Pengepul Disetujui
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-primary" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.approved}{" "}
            <span className="text-xs font-semibold text-emerald-primary">Akun Aktif</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Memiliki hak memasang kebutuhan limbah
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Pengajuan Ditolak
            </span>
            <XCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.rejected}{" "}
            <span className="text-xs font-semibold text-slate-500">Pengajuan</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Dokumen tidak memenuhi kualifikasi
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
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
              onClick={() => setStatusFilter("menunggu")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "menunggu"
                  ? "bg-white text-amber-700 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Menunggu ({stats.pending})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("disetujui")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "disetujui"
                  ? "bg-white text-emerald-700 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Disetujui ({stats.approved})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("ditolak")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "ditolak"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Ditolak ({stats.rejected})
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, email, atau alamat..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-colors"
            />
          </div>
        </div>

        {filteredApps.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900">
              Tidak ada data pengajuan pengepul
            </p>
            <p className="text-[11px] text-slate-400">
              {searchQuery
                ? `Tidak ditemukan hasil yang cocok dengan kata kunci "${searchQuery}".`
                : "Belum ada calon pengepul yang terdaftar pada filter status ini."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10.5px] font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-4 font-semibold">Pemohon Pengepul</th>
                  <th className="pb-3 pr-4 font-semibold">Lokasi Gudang / Drop Point</th>
                  <th className="pb-3 pr-4 font-semibold">NPWP</th>
                  <th className="pb-3 pr-4 font-semibold">Dokumen Verifikasi</th>
                  <th className="pb-3 pr-4 font-semibold">Status</th>
                  <th className="pb-3 text-right font-semibold">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="font-bold text-slate-900">{app.user.fullName}</div>
                      <div className="text-[11px] text-slate-500">{app.user.email}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(app.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    </td>

                    <td className="py-3.5 pr-4 max-w-xs">
                      <div className="flex items-start gap-1.5 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-relaxed text-[11.5px]">{app.address}</span>
                      </div>
                    </td>

                    <td className="py-3.5 pr-4">
                      <span className="font-mono text-slate-700 text-[11px]">
                        {app.npwp || "-"}
                      </span>
                    </td>

                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewImageUrl({ url: app.ktpPhotoUrl, title: `Foto KTP - ${app.user.fullName}` })}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer border border-slate-200/80"
                        >
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>KTP</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewImageUrl({ url: app.outletPhotoUrl, title: `Foto Gudang/Outlet - ${app.user.fullName}` })}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer border border-slate-200/80"
                        >
                          <Building2 className="w-3 h-3 text-slate-500" />
                          <span>Gudang</span>
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 pr-4">
                      {app.status === "disetujui" ? (
                        <Badge variant="outline" className="text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border-emerald-200">
                          Disetujui
                        </Badge>
                      ) : app.status === "ditolak" ? (
                        <Badge variant="outline" className="text-[10.5px] font-semibold bg-red-50 text-red-700 border-red-200">
                          Ditolak
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10.5px] font-semibold bg-amber-50 text-amber-700 border-amber-200">
                          Menunggu
                        </Badge>
                      )}
                    </td>

                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setInspectingApp(app)}
                          className="h-8 px-3 rounded-full text-xs font-semibold border-slate-200 hover:bg-slate-100 text-slate-800"
                        >
                          Tinjau
                        </Button>

                        {app.status === "menunggu" && (
                          <>
                            <Button
                              type="button"
                              size="sm"
                              disabled={processingId === app.id}
                              onClick={() => handleApproveBuyer(app.id)}
                              className="h-8 px-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold gap-1"
                            >
                              {processingId === app.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Setujui</span>
                                </>
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={processingId === app.id}
                              onClick={() => handleRejectBuyer(app.id)}
                              className="h-8 px-3 rounded-full border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold"
                            >
                              Tolak
                            </Button>
                          </>
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

      <Dialog open={!!inspectingApp} onOpenChange={(open) => !open && setInspectingApp(null)}>
        <DialogContent className="sm:max-w-2xl p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl">
          {inspectingApp && (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-bold text-slate-900">
                    Detail Pengajuan Pengepul
                  </DialogTitle>
                  <Badge
                    variant="outline"
                    className={`text-[11px] font-bold capitalize ${
                      inspectingApp.status === "disetujui"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : inspectingApp.status === "ditolak"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {inspectingApp.status}
                  </Badge>
                </div>
                <DialogDescription className="text-xs text-slate-500 mt-1">
                  Diajukan pada {new Date(inspectingApp.createdAt).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" })}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-2xl bg-sage/30 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                    Nama Pemohon
                  </span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{inspectingApp.user.fullName}</p>
                </div>
                <div>
                  <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                    Email Kontak
                  </span>
                  <p className="font-medium text-slate-800 mt-0.5">{inspectingApp.user.email}</p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                    Alamat Operasional Gudang
                  </span>
                  <p className="font-medium text-slate-800 mt-0.5 leading-relaxed">{inspectingApp.address}</p>
                </div>
                <div>
                  <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                    NPWP Badan / Pribadi
                  </span>
                  <p className="font-mono font-medium text-slate-800 mt-0.5">{inspectingApp.npwp || "Tidak dilampirkan"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 block">
                    Foto Identitas (KTP Pemohon)
                  </span>
                  <div
                    onClick={() => setPreviewImageUrl({ url: inspectingApp.ktpPhotoUrl, title: `Foto KTP - ${inspectingApp.user.fullName}` })}
                    className="relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer group shadow-2xs"
                  >
                    <img
                      src={inspectingApp.ktpPhotoUrl}
                      alt="KTP Pemohon"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                      <Eye className="w-4 h-4" />
                      <span>Perbesar</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 block">
                    Foto Gudang / Drop Point
                  </span>
                  <div
                    onClick={() => setPreviewImageUrl({ url: inspectingApp.outletPhotoUrl, title: `Foto Gudang - ${inspectingApp.user.fullName}` })}
                    className="relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer group shadow-2xs"
                  >
                    <img
                      src={inspectingApp.outletPhotoUrl}
                      alt="Gudang Operasional"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                      <Eye className="w-4 h-4" />
                      <span>Perbesar</span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6 flex flex-row gap-2.5 justify-end pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInspectingApp(null)}
                  className="h-9 px-4 rounded-full text-xs font-semibold"
                >
                  Tutup
                </Button>
                {inspectingApp.status === "menunggu" && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={processingId === inspectingApp.id}
                      onClick={() => handleRejectBuyer(inspectingApp.id)}
                      className="h-9 px-4 rounded-full border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold"
                    >
                      Tolak Pengajuan
                    </Button>
                    <Button
                      type="button"
                      disabled={processingId === inspectingApp.id}
                      onClick={() => handleApproveBuyer(inspectingApp.id)}
                      className="h-9 px-5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold gap-1.5"
                    >
                      {processingId === inspectingApp.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Setujui Sebagai Pengepul</span>
                        </>
                      )}
                    </Button>
                  </>
                )}
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
