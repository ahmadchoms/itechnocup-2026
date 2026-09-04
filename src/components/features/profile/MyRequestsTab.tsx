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
  RotateCcw,
  AlertTriangle,
  RefreshCw,
  MapPin,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRupiah, formatIdDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditRequestModal } from "./EditRequestModal";
import { deleteRequestAction, toggleRequestStatusAction } from "@/actions/request.actions";
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
import type { ProfileWasteRequest, WasteCategoryOption } from "@/types";

interface MyRequestsTabProps {
  initialRequests: ProfileWasteRequest[];
  categories: WasteCategoryOption[];
}

export function MyRequestsTab({ initialRequests, categories }: MyRequestsTabProps) {
  const [requests, setRequests] =
    useState<ProfileWasteRequest[]>(initialRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "semua" | "aktif" | "terpenuhi"
  >("semua");
  const [editingRequest, setEditingRequest] = useState<ProfileWasteRequest | null>(null);
  const [requestToDelete, setRequestToDelete] =
    useState<ProfileWasteRequest | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (r.status === "dihapus") return false;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.category?.name.toLowerCase().includes(q);

      if (statusFilter === "aktif") return matchSearch && r.status === "aktif";
      if (statusFilter === "terpenuhi")
        return matchSearch && r.status === "terpenuhi";
      return matchSearch;
    });
  }, [requests, searchQuery, statusFilter]);

  const handleToggleStatus = async (req: ProfileWasteRequest) => {
    const newStatus = req.status === "aktif" ? "terpenuhi" : "aktif";
    setTogglingId(req.id);

    try {
      const res = await toggleRequestStatusAction(req.id, newStatus);
      if (res.success) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === req.id ? { ...r, status: newStatus } : r
          )
        );
        toast.success(
          newStatus === "terpenuhi"
            ? "Permintaan Ditandai Terpenuhi"
            : "Permintaan Diaktifkan Kembali",
          {
            description:
              newStatus === "terpenuhi"
                ? `Permintaan "${req.title}" berhasil ditandai selesai/terpenuhi.`
                : `Permintaan "${req.title}" kini kembali aktif di papan pasar.`,
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

  const confirmDeleteRequest = async () => {
    if (!requestToDelete) return;
    const targetId = requestToDelete.id;
    const targetTitle = requestToDelete.title;

    setIsDeleting(true);
    try {
      const res = await deleteRequestAction(targetId);
      if (res.success) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === targetId ? { ...r, status: "dihapus" } : r,
          ),
        );
        toast.success("Permintaan Pasokan Dihapus", {
          description: `Permintaan "${targetTitle}" telah diarsipkan dari papan pasar.`,
        });
        setRequestToDelete(null);
      } else {
        toast.error("Gagal Menghapus Permintaan", {
          description: res.error || "Terjadi kesalahan pada server.",
        });
      }
    } catch {
      toast.error("Gagal Menghapus Permintaan", {
        description: "Koneksi terputus. Silakan coba beberapa saat lagi.",
      });
    } finally {
      setIsDeleting(false);
    }
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
            placeholder="Cari permintaan..."
            className="pl-9 h-9 text-xs rounded-full bg-[#FAF8F5] border-zinc-200"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-full border border-zinc-200 text-xs">
            {(["semua", "aktif", "terpenuhi"] as const).map((tab) => (
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
            href="/requests/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#171717] text-white text-xs font-bold hover:bg-[#2B2B26] transition-colors shadow-2xs shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#7A8F5C]" />
            <span className="hidden sm:inline">Buka Permintaan</span>
          </Link>
        </div>
      </div>

      {/* Grid of Request Cards */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-zinc-200 bg-[#FAF8F5] space-y-3">
          <div className="w-12 h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center mx-auto text-[#6B7B4F] shadow-2xs">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-[#171717]">
              Tidak Ada Permintaan Pasokan
            </h3>
            <p className="text-xs text-[#78766B] max-w-sm mx-auto mt-0.5">
              {searchQuery
                ? "Tidak ada permintaan pasokan yang cocok dengan filter pencarian Anda."
                : "Anda belum membuka permintaan pasokan material sampah. Buat permintaan sekarang agar warga & UMKM dapat menawarkan sampah mereka!"}
            </p>
          </div>
          {!searchQuery && (
            <Link
              href="/requests/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#171717] text-white text-xs font-bold hover:bg-[#2B2B26] transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Buat Permintaan Pertama</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((req) => {
            const isFulfilled = req.status === "terpenuhi";
            const isToggling = togglingId === req.id;

            return (
              <div
                key={req.id}
                className={cn(
                  "group relative rounded-3xl border bg-white p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between",
                  isFulfilled
                    ? "border-zinc-200/60 opacity-85 bg-[#FAF8F5]/50"
                    : "border-zinc-200/80 hover:border-[#171717]",
                )}
              >
                <div className="space-y-3">
                  {/* Header Badge & Date */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Badge className="rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-[#E8EEDD] text-[#2B3A1C] border-0">
                        {req.category?.name || "Material Sampah"}
                      </Badge>
                      <Badge
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold border-0",
                          isFulfilled
                            ? "bg-zinc-800 text-white"
                            : "bg-emerald-100 text-emerald-800",
                        )}
                      >
                        {isFulfilled ? "Terpenuhi" : "Menerima Pasokan"}
                      </Badge>
                    </div>

                    <span className="text-[10px] font-mono text-[#8A8778] shrink-0">
                      {req.createdAt
                        ? formatIdDate(req.createdAt, {
                            day: "numeric",
                            month: "short",
                          })
                        : "-"}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-display font-bold text-sm text-[#171717] line-clamp-1 group-hover:text-[#6B7B4F] transition-colors">
                      {req.title}
                    </h3>
                    {req.description && (
                      <p className="mt-1 text-[11px] text-[#78766B] line-clamp-2 leading-relaxed">
                        {req.description}
                      </p>
                    )}
                  </div>

                  {/* Target Quantity & Price Card */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F4EE] border border-zinc-200/60 text-xs">
                    <div>
                      <span className="text-[10px] text-[#78766B] block">
                        Target Pasokan
                      </span>
                      <span className="font-mono font-bold text-[#171717]">
                        {req.quantityWanted
                          ? `${req.quantityWanted} ${req.unit || "kg"}`
                          : "Jumlah Bebas"}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#78766B] block">
                        Harga Beli Ditawarkan
                      </span>
                      <span className="font-mono font-extrabold text-[#6B7B4F]">
                        {formatRupiah(req.offeredPrice)}
                        <span className="text-[10px] font-normal text-[#78766B]">
                          /{req.unit || "kg"}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Address Location Info */}
                  {req.address && (
                    <div className="flex items-center gap-1.5 text-[11px] text-[#78766B]">
                      <MapPin className="h-3.5 w-3.5 text-[#6B7B4F] shrink-0" />
                      <span className="truncate">{req.address}</span>
                    </div>
                  )}
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center gap-1.5 pt-3 mt-4 border-t border-zinc-100">
                  {/* Manual Toggle Status Button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isToggling}
                    onClick={() => handleToggleStatus(req)}
                    className={cn(
                      "flex-1 h-8 rounded-full text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer border-zinc-200",
                      isFulfilled
                        ? "bg-white hover:bg-zinc-100 text-[#171717]"
                        : "bg-[#6B7B4F] hover:bg-[#586640] text-white border-transparent"
                    )}
                    title={isFulfilled ? "Buka kembali permintaan pasokan" : "Tandai kebutuhan pasokan telah selesai/terpenuhi"}
                  >
                    {isToggling ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : isFulfilled ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Buka Kembali</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tandai Terpenuhi</span>
                      </>
                    )}
                  </Button>

                  <Link
                    href={`/requests/${req.id}`}
                    className="h-8 w-8 rounded-full border border-zinc-200 bg-white hover:bg-[#F7F4EE] text-[#171717] flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
                    title="Lihat detail halaman permintaan"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#6B7B4F]" />
                  </Link>

                  {/* Edit Request Button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingRequest(req)}
                    className="h-8 w-8 rounded-full border-zinc-200 text-[#78766B] hover:text-[#171717] hover:bg-[#F7F4EE] shrink-0 cursor-pointer"
                    title="Edit permintaan pasokan"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>

                  {/* Delete Request Button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setRequestToDelete(req)}
                    className="h-8 w-8 rounded-full border-zinc-200 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0 cursor-pointer"
                    title="Hapus permintaan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Request Modal */}
      <EditRequestModal
        request={editingRequest}
        categories={categories}
        isOpen={Boolean(editingRequest)}
        onClose={() => setEditingRequest(null)}
        onSuccess={(updated) => {
          setRequests((prev) =>
            prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
          );
        }}
      />

      {/* Alert Dialog Konfirmasi Hapus Permintaan */}
      <AlertDialog
        open={Boolean(requestToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setRequestToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-600 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <AlertDialogTitle>Hapus Permintaan Pasokan?</AlertDialogTitle>
                <span className="text-[11px] text-[#78766B] font-medium block">
                  Tindakan ini akan mengarsipkan permintaan Anda dari pasar
                </span>
              </div>
            </div>

            <AlertDialogDescription className="pt-2">
              Apakah Anda yakin ingin menghapus permintaan pasokan{" "}
              <strong className="text-[#171717]">
                &ldquo;{requestToDelete?.title}&rdquo;
              </strong>
              ? Permintaan ini tidak akan lagi ditampilkan ke warga dan UMKM di
              halaman eksplorasi permintaan.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              onClick={() => setRequestToDelete(null)}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteRequest}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                <span>Ya, Hapus Permintaan</span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
