"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Sparkles } from "lucide-react";
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
import { FileUploadField } from "./FileUploadField";
import { buyerApplicationSchema, BuyerApplicationInput } from "@/validations/user.schema";
import { submitBuyerApplicationAction } from "@/actions/user.actions";
import { toast } from "@/components/ui/sonner";

interface BuyerRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialAddress?: string | null;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function BuyerRegistrationDialog({
  open,
  onOpenChange,
  initialAddress,
}: BuyerRegistrationDialogProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BuyerApplicationInput>({
    resolver: zodResolver(buyerApplicationSchema),
    defaultValues: {
      ktpPhotoUrl: "",
      outletPhotoUrl: "",
      npwp: "",
      address: initialAddress || "",
    },
  });

  const ktpPhotoUrl = watch("ktpPhotoUrl");
  const outletPhotoUrl = watch("outletPhotoUrl");

  const handleFileSelected = async (
    field: "ktpPhotoUrl" | "outletPhotoUrl",
    file: File,
  ) => {
    try {
      const base64 = await fileToBase64(file);
      setValue(field, base64, { shouldValidate: true });
    } catch {
      setValue(field, "", { shouldValidate: true });
      console.error(`Gagal membaca atau mengonversi file untuk ${field}`);
    }
  };

  const handleRemoveFile = (field: "ktpPhotoUrl" | "outletPhotoUrl") => {
    setValue(field, "", { shouldValidate: true });
  };

  const onSubmit = async (data: BuyerApplicationInput) => {
    setSubmitError("");
    const result = await submitBuyerApplicationAction(data);

    if (result.success) {
      toast.success("Pengajuan Mitra Berhasil Terkirim", {
        description: "Admin kami akan memverifikasi data usaha Anda dalam 1x24 jam.",
      });
      onOpenChange(false);
      router.refresh();
    } else {
      setSubmitError(result.error || "Gagal mengajukan pendaftaran");
      toast.error("Gagal mengajukan pendaftaran", { description: result.error });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-lg flex-col rounded-[32px] border-zinc-200 bg-white p-6 sm:p-8">
        <DialogHeader className="shrink-0">
          <div className="mb-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-sage px-2.5 py-0.5 text-[11px] font-bold text-[#6B7B4F]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Verifikasi Mitra Pengepul</span>
          </div>
          <DialogTitle className="font-display text-xl font-bold text-[#171717]">
            Daftar Menjadi Pengepul
          </DialogTitle>
          <DialogDescription className="text-xs text-[#78766B]">
            Lengkapi identitas KTP dan foto gudang/outlet Anda agar dapat
            membuat postingan kebutuhan sampah.
          </DialogDescription>
        </DialogHeader>

        {submitError && (
          <div className="shrink-0 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700">
            {submitError}
          </div>
        )}

        <form
          id="buyer-register-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 space-y-4 overflow-y-auto pr-1"
        >
          <FileUploadField
            id="ktp-upload"
            label="Foto KTP Pemilik"
            required
            value={ktpPhotoUrl}
            previewAlt="Foto KTP"
            placeholderTitle="Pilih atau Tarik Foto KTP"
            placeholderHelper="Format JPG, PNG (Maks 5MB)"
            onFileSelected={(file: File) =>
              handleFileSelected("ktpPhotoUrl", file)
            }
            onRemove={() => handleRemoveFile("ktpPhotoUrl")}
          />
          {errors.ktpPhotoUrl && (
            <p className="text-[11px] font-semibold text-red-500">{errors.ktpPhotoUrl.message}</p>
          )}

          <FileUploadField
            id="outlet-upload"
            label="Foto Gudang / Lokasi Operasional"
            required
            value={outletPhotoUrl}
            previewAlt="Foto Lokasi"
            placeholderTitle="Pilih atau Tarik Foto Outlet/Lapak"
            placeholderHelper="Foto tempat penampungan sampah"
            onFileSelected={(file: File) =>
              handleFileSelected("outletPhotoUrl", file)
            }
            onRemove={() => handleRemoveFile("outletPhotoUrl")}
          />
          {errors.outletPhotoUrl && (
            <p className="text-[11px] font-semibold text-red-500">{errors.outletPhotoUrl.message}</p>
          )}

          <div className="space-y-1">
            <Label htmlFor="npwp" className="text-xs font-bold text-[#171717]">
              Nomor NPWP (Opsional)
            </Label>
            <Input
              id="npwp"
              placeholder="Contoh: 12.345.678.9-012.000"
              {...register("npwp")}
              className="h-10 rounded-2xl border-zinc-200 bg-[#F7F4EE] text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="buyerAddress"
              className="text-xs font-bold text-[#171717]"
            >
              Alamat Lengkap Operasional <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="buyerAddress"
              rows={2}
              placeholder="Alamat lengkap lapak/gudang sampah..."
              {...register("address")}
              className="resize-none rounded-2xl border-zinc-200 bg-[#F7F4EE] text-xs"
            />
            {errors.address && (
              <p className="text-[11px] font-semibold text-red-500">{errors.address.message}</p>
            )}
          </div>
        </form>

        <div className="flex shrink-0 items-center gap-3 border-t border-zinc-100 bg-white pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 flex-1 cursor-pointer rounded-full border-zinc-200 text-xs font-bold"
          >
            Batal
          </Button>
          <Button
            type="submit"
            form="buyer-register-form"
            disabled={isSubmitting}
            className="h-11 flex-1 cursor-pointer rounded-full bg-[#171717] text-xs font-bold text-white shadow-xs hover:bg-[#2B2B26]"
          >
            {isSubmitting ? (
              <span>Mengirim...</span>
            ) : (
              <>
                <span>Kirim Pengajuan</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
