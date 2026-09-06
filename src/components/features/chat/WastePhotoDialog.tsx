"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatRupiah } from "@/lib/format";
import { Camera, MapPin, Scale, Layers } from "lucide-react";
import type { ChatListing } from "@/types";

interface WastePhotoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  listing?: ChatListing | null;
}

export function WastePhotoDialog({
  isOpen,
  onClose,
  listing,
}: WastePhotoDialogProps) {
  if (!listing?.photoUrl) return null;

  const displayWeight = listing.estimatedWeightKg || listing.quantity;
  const unit = listing.unit || "kg";
  const categoryName = listing.category?.name || "Limbah Sirkular";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl border-zinc-200 bg-white shadow-2xl">
        <DialogHeader className="p-4 sm:p-5 border-b border-zinc-100 bg-[#F7F4EE]/60">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
              <Camera className="w-3.5 h-3.5" />
            </span>
            <div>
              <DialogTitle className="text-sm font-bold text-[#171717] line-clamp-1">
                {listing.title}
              </DialogTitle>
              <p className="text-[11px] text-[#78766B] mt-0.5 flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#7A8F5C]" />
                <span>{categoryName}</span>
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Gambar Foto Sampah */}
        <div className="relative aspect-4/3 w-full bg-zinc-950 overflow-hidden">
          <Image
            src={listing.photoUrl}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover"
          />
        </div>

        {/* Informasi Detail Sampah */}
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F4EE] border border-zinc-200/80">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#78766B] block">
                Estimasi Harga
              </span>
              <span className="text-xs font-extrabold text-[#6B7B4F]">
                {listing.estimatedPrice
                  ? `${formatRupiah(listing.estimatedPrice)} / ${unit}`
                  : "Harga Negosiasi"}
              </span>
            </div>

            {displayWeight && (
              <div className="text-right">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#78766B] block">
                  Total Tersedia
                </span>
                <span className="text-xs font-extrabold text-[#171717] flex items-center justify-end gap-1">
                  <Scale className="w-3.5 h-3.5 text-[#7A8F5C]" />
                  {displayWeight} {unit}
                </span>
              </div>
            )}
          </div>

          {(listing as any).address && (
            <div className="flex items-start gap-1.5 text-[11px] text-[#78766B]">
              <MapPin className="w-3.5 h-3.5 text-[#7A8F5C] shrink-0 mt-0.5" />
              <span className="line-clamp-2">{(listing as any).address}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
