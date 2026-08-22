"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
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
import type { ProfileUser } from "@/components/features/profile/types";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Pick<ProfileUser, "fullName" | "phone" | "address">;
}

export function EditProfileDialog({ open, onOpenChange, user }: EditProfileDialogProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: user.fullName || "",
    phone: user.phone || "",
    address: user.address || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        onOpenChange(false);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal memperbarui profil");
      }
    } catch {
      alert("Terjadi kesalahan server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[32px] border-zinc-200 bg-white p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171717]">
            Perbarui Data Profil
          </DialogTitle>
          <DialogDescription className="text-xs text-[#78766B]">
            Perubahan kontak dan alamat akan digunakan untuk koordinasi transaksi penjemputan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label htmlFor="fullName" className="text-xs font-bold text-[#171717]">
              Nama Lengkap
            </Label>
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
              required
              className="h-10 rounded-2xl border-zinc-200 bg-[#F7F4EE] text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone" className="text-xs font-bold text-[#171717]">
              Nomor WhatsApp / Telepon
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Contoh: 08123456789"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              className="h-10 rounded-2xl border-zinc-200 bg-[#F7F4EE] text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="address" className="text-xs font-bold text-[#171717]">
              Alamat Utama
            </Label>
            <Textarea
              id="address"
              rows={2}
              value={form.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              className="resize-none rounded-2xl border-zinc-200 bg-[#F7F4EE] text-xs"
            />
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
