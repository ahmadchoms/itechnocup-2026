"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfileSchema, UpdateProfileInput } from "@/validations/user.schema";
import { updateUserProfileAction } from "@/actions/user.actions";
import { toast } from "@/components/ui/sonner";
import type { ProfileUser } from "@/types";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Pick<ProfileUser, "fullName" | "phone" | "address">;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  user,
}: EditProfileDialogProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: user.fullName || "",
      phone: user.phone || "",
      address: user.address || "",
    },
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    setServerError(null);
    const result = await updateUserProfileAction(data);

    if (result.success) {
      toast.success("Profil berhasil diperbarui");
      onOpenChange(false);
      router.refresh();
    } else {
      setServerError(result.error || "Gagal memperbarui profil");
      toast.error("Gagal memperbarui profil", { description: result.error });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[32px] border-zinc-200 bg-white p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold text-[#171717]">
            Perbarui Data Profil
          </DialogTitle>
          <DialogDescription className="text-xs text-[#78766B]">
            Perubahan kontak dan alamat akan digunakan untuk koordinasi
            transaksi penjemputan.
          </DialogDescription>
        </DialogHeader>

        {serverError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label
              htmlFor="fullName"
              className="text-xs font-bold text-[#171717]"
            >
              Nama Lengkap
            </Label>
            <Input
              id="fullName"
              {...register("fullName")}
              required
              className="h-10 rounded-2xl border-zinc-200 bg-[#F7F4EE] text-xs"
            />
            {errors.fullName && (
              <p className="text-[11px] font-semibold text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone" className="text-xs font-bold text-[#171717]">
              Nomor WhatsApp / Telepon
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Contoh: 08123456789"
              {...register("phone")}
              className="h-10 rounded-2xl border-zinc-200 bg-[#F7F4EE] text-xs"
            />
            {errors.phone && (
              <p className="text-[11px] font-semibold text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="address"
              className="text-xs font-bold text-[#171717]"
            >
              Alamat Utama
            </Label>
            <Textarea
              id="address"
              rows={2}
              {...register("address")}
              className="resize-none rounded-2xl border-zinc-200 bg-[#F7F4EE] text-xs"
            />
            {errors.address && (
              <p className="text-[11px] font-semibold text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 flex-1 cursor-pointer rounded-full border-zinc-200 text-xs font-bold"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 flex-1 cursor-pointer rounded-full bg-[#171717] text-xs font-bold text-white hover:bg-[#2B2B26]"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
