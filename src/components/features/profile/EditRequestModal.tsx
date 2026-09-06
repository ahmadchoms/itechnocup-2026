"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RefreshCw, Layers, DollarSign, Scale, MapPin } from "lucide-react";
import { updateRequestSchema, UpdateRequestInput } from "@/validations/request.schema";
import { updateRequestAction } from "@/actions/request.actions";
import { toast } from "@/components/ui/sonner";
import type { ProfileWasteRequest, WasteCategoryOption } from "@/types";

interface EditRequestModalProps {
  request: ProfileWasteRequest | null;
  categories: WasteCategoryOption[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: ProfileWasteRequest) => void;
}

export function EditRequestModal({
  request,
  categories,
  isOpen,
  onClose,
  onSuccess,
}: EditRequestModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(updateRequestSchema),
    defaultValues: {
      title: request?.title || "",
      description: request?.description || "",
      quantityWanted: request?.quantityWanted ? Number(request.quantityWanted) : undefined,
      offeredPrice: request?.offeredPrice ? Number(request.offeredPrice) : undefined,
      unit: request?.unit || "kg",
      categoryId: request?.categoryId || categories[0]?.id || "",
      address: request?.address || "",
    },
  });

  useEffect(() => {
    if (request) {
      reset({
        title: request.title,
        description: request.description || "",
        quantityWanted: request.quantityWanted ? Number(request.quantityWanted) : undefined,
        offeredPrice: request.offeredPrice ? Number(request.offeredPrice) : undefined,
        unit: request.unit || "kg",
        categoryId: request.categoryId || categories[0]?.id || "",
        address: request.address || "",
      });
      setServerError(null);
    }
  }, [request, categories, reset]);

  const onSubmit = async (data: UpdateRequestInput) => {
    if (!request) return;
    setServerError(null);

    try {
      const res = await updateRequestAction(request.id, data);

      if (res.success && res.wasteRequest) {
        toast.success("Permintaan Pasokan Diperbarui", {
          description: `Perubahan pada "${data.title || request.title}" berhasil disimpan.`,
        });
        onSuccess(res.wasteRequest as unknown as ProfileWasteRequest);
        onClose();
      } else {
        setServerError(res.error || "Gagal memperbarui permintaan");
      }
    } catch {
      setServerError("Terjadi kesalahan pada server");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg rounded-[28px] sm:rounded-[32px] bg-white p-6 sm:p-7 shadow-2xl">
        <DialogHeader className="space-y-1 text-left pb-2 border-b border-zinc-100">
          <div className="flex items-center gap-2 text-[#6B7B4F]">
            <Layers className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Pembaruan Pasokan
            </span>
          </div>
          <DialogTitle className="font-display text-lg font-bold text-[#171717]">
            Edit Permintaan Pasokan
          </DialogTitle>
          <DialogDescription className="text-xs text-[#78766B]">
            Sesuaikan target kuantitas material, harga penawaran beli, dan keterangan untuk warga.
          </DialogDescription>
        </DialogHeader>

        {serverError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-medium">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          {/* Judul Permintaan */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#171717]">
              Judul Permintaan Pasokan
            </Label>
            <Input
              {...register("title")}
              placeholder="Contoh: Butuh Pasokan Kardus & Karton Tebal"
              className="h-10 text-xs rounded-xl bg-[#FAF8F5] border-zinc-200 focus-visible:bg-white"
            />
            {errors.title && (
              <p className="text-[11px] font-medium text-red-600">
                {String(errors.title.message)}
              </p>
            )}
          </div>

          {/* Kategori Sampah */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#171717]">
              Kategori Material Sampah
            </Label>
            <select
              {...register("categoryId")}
              className="w-full h-10 px-3 text-xs rounded-xl bg-[#FAF8F5] border border-zinc-200 text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717] focus:bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-[11px] font-medium text-red-600">
                {String(errors.categoryId.message)}
              </p>
            )}
          </div>

          {/* Target Kuantitas & Harga Beli */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#171717] flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-[#6B7B4F]" />
                <span>Target Bobot ({request?.unit || "kg"})</span>
              </Label>
              <Input
                type="number"
                min={1}
                {...register("quantityWanted")}
                placeholder="50"
                className="h-10 text-xs rounded-xl bg-[#FAF8F5] border-zinc-200 focus-visible:bg-white font-bold font-mono"
              />
              {errors.quantityWanted && (
                <p className="text-[11px] font-medium text-red-600">
                  {String(errors.quantityWanted.message)}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#171717] flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#6B7B4F]" />
                <span>Harga Beli Ditawarkan (Rp/{request?.unit || "kg"})</span>
              </Label>
              <Input
                type="number"
                min={0}
                {...register("offeredPrice")}
                placeholder="2500"
                className="h-10 text-xs rounded-xl bg-[#FAF8F5] border-zinc-200 focus-visible:bg-white font-extrabold font-mono text-[#6B7B4F]"
              />
              {errors.offeredPrice && (
                <p className="text-[11px] font-medium text-red-600">
                  {String(errors.offeredPrice.message)}
                </p>
              )}
            </div>
          </div>

          {/* Alamat Lokasi Gudang */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#171717] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#6B7B4F]" />
              <span>Titik Alamat Penjemputan / Gudang</span>
            </Label>
            <Input
              {...register("address")}
              placeholder="Contoh: Jl. Pemuda No. 45, Semarang"
              className="h-10 text-xs rounded-xl bg-[#FAF8F5] border-zinc-200 focus-visible:bg-white"
            />
          </div>

          {/* Deskripsi Catatan */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#171717]">
              Catatan / Ketentuan Limbah (Opsional)
            </Label>
            <Textarea
              {...register("description")}
              placeholder="Contoh: Kardus kering tidak terkena minyak/air. Bersedia jemput area Semarang Barat jika bobot di atas 30kg."
              rows={3}
              className="text-xs rounded-2xl bg-[#FAF8F5] border-zinc-200 focus-visible:bg-white resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full h-9 px-4 text-xs font-semibold border-zinc-200"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full h-9 px-5 text-xs font-bold bg-[#171717] hover:bg-[#2B2B26] text-white shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Perubahan</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
