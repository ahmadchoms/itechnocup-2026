"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
import { updateListingSchema, UpdateListingInput } from "@/validations/listing.schema";
import { updateListingAction } from "@/actions/listing.actions";
import type { ProfileListing, WasteCategoryOption } from "@/types";

interface EditListingModalProps {
  listing: ProfileListing | null;
  categories: WasteCategoryOption[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: ProfileListing) => void;
}

export function EditListingModal({
  listing,
  categories,
  isOpen,
  onClose,
  onSuccess,
}: EditListingModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(updateListingSchema),
    defaultValues: {
      title: listing?.title || "",
      description: listing?.description || "",
      estimatedWeightKg: listing?.estimatedWeightKg ? Number(listing.estimatedWeightKg) : undefined,
      estimatedPrice: listing?.estimatedPrice ? Number(listing.estimatedPrice) : undefined,
      categoryId: listing?.categoryId || categories[0]?.id || "",
    },
  });

  useEffect(() => {
    if (listing) {
      reset({
        title: listing.title,
        description: listing.description || "",
        estimatedWeightKg: listing.estimatedWeightKg ? Number(listing.estimatedWeightKg) : undefined,
        estimatedPrice: listing.estimatedPrice ? Number(listing.estimatedPrice) : undefined,
        categoryId: listing.categoryId,
      });
    }
  }, [listing, reset]);

  const onSubmit = async (data: UpdateListingInput) => {
    if (!listing) return;
    setServerError(null);

    try {
      const res = await updateListingAction(listing.id, data);

      if (res.success && res.listing) {
        onSuccess(res.listing as unknown as ProfileListing);
        onClose();
      } else {
        setServerError(res.error || "Gagal memperbarui listing");
      }
    } catch {
      setServerError("Terjadi kesalahan pada server");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl bg-white p-6">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold text-[#171717]">
            Edit Listing Limbah
          </DialogTitle>
        </DialogHeader>

        {serverError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label className="text-xs font-bold text-[#78766B]">
              Judul Listing *
            </Label>
            <Input
              {...register("title")}
              placeholder="Contoh: Kardus Tebal Bekas Gudang"
              className="h-10 text-xs bg-[#F7F4EE] border-zinc-200 rounded-xl"
            />
            {errors.title && (
              <p className="text-xs text-rose-600 font-medium">{errors.title.message as string}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold text-[#78766B]">
              Kategori Limbah *
            </Label>
            <select
              {...register("categoryId")}
              className="w-full h-10 px-3 text-xs bg-[#F7F4EE] border border-zinc-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#171717]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-rose-600 font-medium">{errors.categoryId.message as string}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-[#78766B]">
                Estimasi Berat (kg)
              </Label>
              <Input
                type="number"
                step="0.1"
                {...register("estimatedWeightKg")}
                placeholder="25"
                className="h-10 text-xs bg-[#F7F4EE] border-zinc-200 rounded-xl"
              />
              {errors.estimatedWeightKg && (
                <p className="text-xs text-rose-600 font-medium">{errors.estimatedWeightKg.message as string}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-[#78766B]">
                Estimasi Harga (Rp)
              </Label>
              <Input
                type="number"
                {...register("estimatedPrice")}
                placeholder="45000"
                className="h-10 text-xs font-mono bg-[#F7F4EE] border-zinc-200 rounded-xl"
              />
              {errors.estimatedPrice && (
                <p className="text-xs text-rose-600 font-medium">{errors.estimatedPrice.message as string}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold text-[#78766B]">
              Deskripsi / Kondisi Barang
            </Label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Jelaskan kondisi limbah, kebersihan, atau lokasi penyimpanan..."
              className="w-full p-3 text-xs bg-[#F7F4EE] border border-zinc-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#171717] resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 px-4 rounded-full text-xs font-semibold"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9 px-5 rounded-full bg-[#171717] hover:bg-[#2B2B26] text-white text-xs font-bold gap-1.5"
            >
              {isSubmitting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
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
