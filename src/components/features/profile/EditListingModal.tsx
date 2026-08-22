"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
import type { ProfileListing, WasteCategoryOption } from "./types";

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
  const [title, setTitle] = useState(listing?.title || "");
  const [description, setDescription] = useState(listing?.description || "");
  const [estimatedWeight, setEstimatedWeight] = useState(String(listing?.estimatedWeightKg || ""));
  const [estimatedPrice, setEstimatedPrice] = useState(String(listing?.estimatedPrice || ""));
  const [categoryId, setCategoryId] = useState(listing?.categoryId || categories[0]?.id || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state when listing changes
  const handleOpen = () => {
    if (listing) {
      setTitle(listing.title);
      setDescription(listing.description || "");
      setEstimatedWeight(String(listing.estimatedWeightKg || ""));
      setEstimatedPrice(String(listing.estimatedPrice || ""));
      setCategoryId(listing.categoryId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/listings/${listing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          estimatedWeightKg: Number(estimatedWeight) || null,
          estimatedPrice: Number(estimatedPrice) || null,
          categoryId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onSuccess(data);
        onClose();
      } else {
        const err = await res.json();
        alert(err.error || "Gagal memperbarui listing");
      }
    } catch {
      alert("Terjadi kesalahan pada server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); else handleOpen(); }}>
      <DialogContent className="sm:max-w-md rounded-3xl bg-white p-6">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-display)] text-lg font-bold text-[#171717]">
            Edit Listing Limbah
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label className="text-xs font-bold text-[#78766B]">Judul Listing</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Kardus Tebal Bekas Gudang"
              required
              className="h-10 text-xs bg-[#F7F4EE] border-zinc-200 rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold text-[#78766B]">Kategori Limbah</Label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-[#F7F4EE] border border-zinc-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#171717]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-[#78766B]">Estimasi Berat (kg)</Label>
              <Input
                type="number"
                value={estimatedWeight}
                onChange={(e) => setEstimatedWeight(e.target.value)}
                placeholder="25"
                className="h-10 text-xs bg-[#F7F4EE] border-zinc-200 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-[#78766B]">Estimasi Harga (Rp)</Label>
              <Input
                type="number"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
                placeholder="45000"
                className="h-10 text-xs font-mono bg-[#F7F4EE] border-zinc-200 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold text-[#78766B]">Deskripsi / Kondisi Barang</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              disabled={isSubmitting || !title.trim()}
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
