"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
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
  const [form, setForm] = useState({
    ktpPhotoUrl: "",
    outletPhotoUrl: "",
    npwp: "",
    address: initialAddress || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleFileSelected = async (field: "ktpPhotoUrl" | "outletPhotoUrl", file: File) => {
    try {
      const base64 = await fileToBase64(file);
      setForm((prev) => ({ ...prev, [field]: base64 }));
    } catch {
      setForm((prev) => ({ ...prev, [field]: "" }));
      console.error(`Gagal membaca atau mengonversi file untuk ${field}`);
    }
  };

  const handleRemoveFile = (field: "ktpPhotoUrl" | "outletPhotoUrl") => {
    setForm((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/buyer-applications/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        onOpenChange(false);
        router.refresh();
      } else {
        setSubmitError(data.error || "Gagal mengajukan pendaftaran");
      }
    } catch {
      setSubmitError("Terjadi kesalahan pada server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-lg flex-col rounded-[32px] border-zinc-200 bg-white p-6 sm:p-8">
        <DialogHeader className="shrink-0">
          <div className="mb-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#EFF3E7] px-2.5 py-0.5 text-[11px] font-bold text-[#6B7B4F]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Verifikasi Mitra Pengepul</span>
          </div>
          <DialogTitle className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171717]">
            Daftar Menjadi Pengepul
          </DialogTitle>
          <DialogDescription className="text-xs text-[#78766B]">
            Lengkapi identitas KTP dan foto gudang/outlet Anda agar dapat membuat postingan
            kebutuhan sampah.
          </DialogDescription>
        </DialogHeader>

        {submitError && (
          <div className="shrink-0 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700">
            {submitError}
          </div>
        )}

        <form
          id="buyer-register-form"
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 overflow-y-auto pr-1"
        >
          <FileUploadField
            id="ktp-upload"
            label="Foto KTP Pemilik"
            required
            value={form.ktpPhotoUrl}
            previewAlt="Foto KTP"
            placeholderTitle="Pilih atau Tarik Foto KTP"
            placeholderHelper="Format JPG, PNG (Maks 5MB)"
            onFileSelected={(file: File) => handleFileSelected("ktpPhotoUrl", file)}
            onRemove={() => handleRemoveFile("ktpPhotoUrl")}
          />

          <FileUploadField
            id="outlet-upload"
            label="Foto Gudang / Lokasi Operasional"
            required
            value={form.outletPhotoUrl}
            previewAlt="Foto Lokasi"
            placeholderTitle="Pilih atau Tarik Foto Outlet/Lapak"
            placeholderHelper="Foto tempat penampungan sampah"
            onFileSelected={(file: File) => handleFileSelected("outletPhotoUrl", file)}
            onRemove={() => handleRemoveFile("outletPhotoUrl")}
          />

          <div className="space-y-1">
            <Label htmlFor="npwp" className="text-xs font-bold text-[#171717]">
              Nomor NPWP (Opsional)
            </Label>
            <Input
              id="npwp"
              placeholder="Contoh: 12.345.678.9-012.000"
              value={form.npwp}
              onChange={(e) => setForm((prev) => ({ ...prev, npwp: e.target.value }))}
              className="h-10 rounded-2xl border-zinc-200 bg-[#F7F4EE] text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="buyerAddress" className="text-xs font-bold text-[#171717]">
              Alamat Lengkap Operasional <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="buyerAddress"
              rows={2}
              placeholder="Alamat lengkap lapak/gudang sampah..."
              value={form.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              required
              className="resize-none rounded-2xl border-zinc-200 bg-[#F7F4EE] text-xs"
            />
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
