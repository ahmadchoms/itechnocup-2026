"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Handshake,
  Clock,
  CheckCircle2,
  XCircle,
  Info,
  Star,
  PlusCircle,
  RotateCcw,
  Camera,
  Lock,
  Sparkles,
} from "lucide-react";
import { formatRupiah } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ChatConversation, ChatTransaction } from "@/types";

interface DealDrawerProps {
  activeConv: ChatConversation;
  activeTx: ChatTransaction | null;
  isExpanded: boolean;
  isSeller: boolean;
  currentDealInput: { price: string; quantity: string };
  isUpdatingTx: boolean;
  hasReviewed?: boolean;
  onPriceChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  onUpdateStatus: (
    status: "menunggu_persetujuan" | "menunggu_konfirmasi" | "selesai" | "dibatalkan",
  ) => void;
  onOpenReviewDialog?: () => void;
}

export function DealDrawer({
  activeConv,
  activeTx,
  isExpanded,
  isSeller,
  currentDealInput,
  isUpdatingTx,
  hasReviewed,
  onPriceChange,
  onQuantityChange,
  onUpdateStatus,
  onOpenReviewDialog,
}: DealDrawerProps) {
  const [isCreatingNewDeal, setIsCreatingNewDeal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const currentStatus = activeTx?.status || "draft";
  const isCompleted = currentStatus === "selesai";
  const isCancelled = currentStatus === "dibatalkan";
  const isAgreed = currentStatus === "menunggu_konfirmasi" && !isCreatingNewDeal;

  // Maximum quantity available based on listing or request
  const maxAvailableQty =
    Number(activeConv.match?.listing?.estimatedWeightKg) ||
    Number(activeConv.match?.listing?.quantity) ||
    Number(activeConv.match?.request?.quantityWanted) ||
    1000;

  const unit =
    activeConv.match?.listing?.unit ||
    activeConv.match?.request?.unit ||
    "kg";

  const listingTitle =
    activeConv.match?.listing?.title ||
    activeConv.match?.request?.title ||
    "Limbah Sirkular";

  const photoUrl = activeConv.match?.listing?.photoUrl;

  // Quick preset modifiers with max clamp
  const handleModifyQuantity = (delta: number) => {
    const current = Number(currentDealInput.quantity) || 0;
    const nextVal = Math.min(maxAvailableQty, Math.max(1, current + delta));
    onQuantityChange(String(nextVal));
  };

  const handleModifyPrice = (delta: number) => {
    const current = Number(currentDealInput.price) || 0;
    const nextVal = Math.max(0, current + delta);
    onPriceChange(String(nextVal));
  };

  const handleQuantityInputChange = (val: string) => {
    const num = Number(val);
    if (!isNaN(num) && num > maxAvailableQty) {
      onQuantityChange(String(maxAvailableQty));
    } else {
      onQuantityChange(val);
    }
  };

  // Step Progress State
  const steps = [
    {
      id: "menunggu_persetujuan",
      label: "Tawaran Diajukan",
      done: !isCreatingNewDeal && (currentStatus === "menunggu_konfirmasi" || isCompleted),
      active: isCreatingNewDeal || currentStatus === "menunggu_persetujuan" || currentStatus === "draft",
    },
    {
      id: "menunggu_konfirmasi",
      label: "Disetujui & Jadwal COD",
      done: !isCreatingNewDeal && isCompleted,
      active: !isCreatingNewDeal && currentStatus === "menunggu_konfirmasi",
    },
    {
      id: "selesai",
      label: "COD Selesai",
      done: !isCreatingNewDeal && isCompleted,
      active: !isCreatingNewDeal && isCompleted,
    },
  ];

  const handleStartNewDeal = () => {
    setIsCreatingNewDeal(true);
  };

  const handleCancelNewDeal = () => {
    setIsCreatingNewDeal(false);
  };

  const handleProposeNewDeal = () => {
    onUpdateStatus("menunggu_persetujuan");
    setIsCreatingNewDeal(false);
  };

  return (
    <>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-b border-zinc-200/80 bg-white shrink-0 shadow-2xs"
          >
            <div className="p-3 sm:p-4">
              <div className="rounded-2xl border border-zinc-200/80 bg-[#FAF8F5] p-3 sm:p-4 space-y-3.5">
                {/* 1. Header Meta Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/60 pb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Thumbnail if photo available */}
                    {photoUrl ? (
                      <button
                        type="button"
                        onClick={() => setShowPhotoModal(true)}
                        className="relative w-10 h-10 rounded-xl overflow-hidden border border-zinc-200 shrink-0 group cursor-pointer shadow-2xs"
                        title="Klik untuk memperbesar foto sampah"
                      >
                        <Image
                          src={photoUrl}
                          alt={listingTitle}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform"
                        />
                        <span className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                          <Camera className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200/80 flex items-center justify-center text-[#6B7B4F] shrink-0 shadow-2xs">
                        <Handshake className="w-4 h-4" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-bold text-xs sm:text-sm text-[#171717] truncate">
                          Formulir Kesepakatan Harga COD
                        </span>
                        {activeConv.match?.request && (
                          <Badge className="bg-[#E8EEDD] text-[#2B3A1C] border-0 text-[10px] font-bold px-2 py-0 shrink-0">
                            Kebutuhan Pasokan
                          </Badge>
                        )}
                      </div>
                      <span className="text-[11px] text-[#78766B] truncate block">
                        Barang:{" "}
                        <strong className="text-[#171717]">
                          {listingTitle}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs shrink-0 self-start sm:self-auto">
                    {photoUrl && (
                      <button
                        type="button"
                        onClick={() => setShowPhotoModal(true)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-zinc-200 text-[10.5px] font-semibold text-[#6B7B4F] hover:bg-[#F7F4EE] transition-colors cursor-pointer"
                      >
                        <Camera className="w-3 h-3" />
                        <span>Foto</span>
                      </button>
                    )}
                    <span className="text-[11px] text-[#78766B]">Jarak:</span>
                    <Badge
                      variant="outline"
                      className="font-mono font-bold text-[#6B7B4F] bg-white px-2.5 py-0.5 rounded-full border-zinc-200 shadow-2xs"
                    >
                      {activeConv.match?.distanceKm
                        ? `${activeConv.match.distanceKm} km`
                        : "0.8 km"}
                    </Badge>
                  </div>
                </div>

                {/* 2. Visual Step Progress Flow */}
                {(!isCancelled || isCreatingNewDeal) && (
                  <div className="hidden sm:grid grid-cols-3 gap-2 px-1">
                    {steps.map((step, idx) => (
                      <div
                        key={step.id}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-xl border text-xs transition-all",
                          step.done
                            ? "bg-emerald-50/80 border-emerald-200 text-emerald-800 font-semibold"
                            : step.active
                              ? "bg-amber-50/80 border-amber-200 text-amber-900 font-bold shadow-2xs"
                              : "bg-white/60 border-zinc-200/60 text-[#8A8778]"
                        )}
                      >
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                            step.done
                              ? "bg-emerald-600 text-white"
                              : step.active
                                ? "bg-amber-500 text-white"
                                : "bg-zinc-200 text-[#78766B]"
                          )}
                        >
                          {step.done ? "✓" : idx + 1}
                        </div>
                        <span className="truncate text-[11px]">{step.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Input Parameters & Preset Modifiers (Quantity & Price) */}
                {(!isCompleted || isCreatingNewDeal) && (!isCancelled || isCreatingNewDeal) && (
                  <div className="space-y-2">
                    {isAgreed && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-medium">
                        <Lock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span>
                          <strong>Kesepakatan Terkunci:</strong> Harga &amp; bobot telah disetujui untuk serah terima COD.
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                      {/* Quantity Input */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label className="text-[10.5px] font-bold uppercase tracking-wider text-[#78766B]">
                            Kuantitas ({unit})
                          </Label>
                          {!isAgreed && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleModifyQuantity(-5)}
                                disabled={isUpdatingTx || isAgreed}
                                className="h-5 px-1.5 rounded-md bg-white border border-zinc-200 text-[10px] font-bold text-[#78766B] hover:text-[#171717] hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50"
                              >
                                -5
                              </button>
                              <button
                                type="button"
                                onClick={() => handleModifyQuantity(5)}
                                disabled={isUpdatingTx || isAgreed}
                                className="h-5 px-1.5 rounded-md bg-white border border-zinc-200 text-[10px] font-bold text-[#78766B] hover:text-[#171717] hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50"
                              >
                                +5
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="relative">
                          <Input
                            type="number"
                            min={1}
                            max={maxAvailableQty}
                            value={currentDealInput.quantity}
                            onChange={(e) => handleQuantityInputChange(e.target.value)}
                            disabled={isUpdatingTx || isAgreed}
                            className={cn(
                              "h-9 text-xs font-bold rounded-xl",
                              isAgreed
                                ? "bg-zinc-100 text-zinc-600 border-zinc-200 cursor-not-allowed"
                                : "bg-white border-zinc-200 text-[#171717] focus-visible:ring-1 focus-visible:ring-[#171717]"
                            )}
                            placeholder="25"
                          />
                          {maxAvailableQty < 1000 && !isAgreed && (
                            <span className="absolute right-2.5 top-2 text-[10px] text-[#78766B] font-mono pointer-events-none">
                              Maks {maxAvailableQty} {unit}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price Input */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label className="text-[10.5px] font-bold uppercase tracking-wider text-[#78766B]">
                            Total Harga (Rp)
                          </Label>
                          {!isAgreed && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleModifyPrice(-5000)}
                                disabled={isUpdatingTx || isAgreed}
                                className="h-5 px-1.5 rounded-md bg-white border border-zinc-200 text-[10px] font-bold text-[#78766B] hover:text-[#171717] hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50"
                              >
                                -5k
                              </button>
                              <button
                                type="button"
                                onClick={() => handleModifyPrice(5000)}
                                disabled={isUpdatingTx || isAgreed}
                                className="h-5 px-1.5 rounded-md bg-white border border-zinc-200 text-[10px] font-bold text-[#78766B] hover:text-[#171717] hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50"
                              >
                                +5k
                              </button>
                            </div>
                          )}
                        </div>
                        <Input
                          type="number"
                          min={0}
                          value={currentDealInput.price}
                          onChange={(e) => onPriceChange(e.target.value)}
                          disabled={isUpdatingTx || isAgreed}
                          className={cn(
                            "h-9 text-xs font-mono font-extrabold rounded-xl",
                            isAgreed
                              ? "bg-zinc-100 text-zinc-600 border-zinc-200 cursor-not-allowed"
                              : "bg-white border-zinc-200 text-[#171717] focus-visible:ring-1 focus-visible:ring-[#171717]"
                          )}
                          placeholder="45000"
                        />
                      </div>

                      {/* 4. Action Trigger Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* NEW TRANSACTION FLOW WHEN CREATING NEW DEAL */}
                        {isCreatingNewDeal && (
                          <>
                            <Button
                              type="button"
                              size="sm"
                              onClick={handleProposeNewDeal}
                              disabled={isUpdatingTx}
                              className="h-9 flex-1 cursor-pointer rounded-full bg-[#171717] hover:bg-[#2B2B26] text-white text-[11.5px] font-bold shadow-xs gap-1.5"
                            >
                              <Handshake className="w-3.5 h-3.5 text-amber-300" />
                              <span>Ajukan Tawaran Baru</span>
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={handleCancelNewDeal}
                              disabled={isUpdatingTx}
                              className="h-9 cursor-pointer rounded-full border-zinc-300 text-[11px] font-semibold text-[#171717] bg-white hover:bg-zinc-100"
                            >
                              Batal
                            </Button>
                          </>
                        )}

                        {/* Status: DRAFT -> Pembeli / Penjual bisa ajukan tawaran */}
                        {!isCreatingNewDeal && !activeTx && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => onUpdateStatus("menunggu_persetujuan")}
                            disabled={isUpdatingTx}
                            className="h-9 flex-1 cursor-pointer rounded-full bg-[#171717] hover:bg-[#2B2B26] text-white text-[11.5px] font-bold shadow-xs gap-1.5"
                          >
                            <Handshake className="w-3.5 h-3.5 text-amber-300" />
                            <span>Ajukan Tawaran</span>
                          </Button>
                        )}

                        {/* Status: MENUNGGU PERSETUJUAN */}
                        {!isCreatingNewDeal && currentStatus === "menunggu_persetujuan" && isSeller && (
                          <>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => onUpdateStatus("menunggu_konfirmasi")}
                              disabled={isUpdatingTx}
                              className="h-9 flex-1 cursor-pointer rounded-full bg-[#171717] hover:bg-[#2B2B26] text-white text-[11.5px] font-bold shadow-xs gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Setujui Harga</span>
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => onUpdateStatus("menunggu_persetujuan")}
                              disabled={isUpdatingTx}
                              className="h-9 cursor-pointer rounded-full border-zinc-300 text-[11px] font-semibold text-[#171717] bg-white hover:bg-zinc-100"
                              title="Perbarui angka tawar balik"
                            >
                              Tawar Balik
                            </Button>
                          </>
                        )}

                        {!isCreatingNewDeal && currentStatus === "menunggu_persetujuan" && !isSeller && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => onUpdateStatus("menunggu_persetujuan")}
                            disabled={isUpdatingTx}
                            className="h-9 flex-1 rounded-full bg-white border border-zinc-300 text-[#171717] text-[11px] font-bold hover:bg-zinc-100 shadow-2xs"
                          >
                            <Clock className="w-3.5 h-3.5 mr-1 text-amber-500" />
                            <span>Perbarui Tawaran</span>
                          </Button>
                        )}

                        {/* Status: MENUNGGU KONFIRMASI (Siap COD) */}
                        {!isCreatingNewDeal && currentStatus === "menunggu_konfirmasi" && isSeller && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => onUpdateStatus("selesai")}
                            disabled={isUpdatingTx}
                            className="h-9 flex-1 cursor-pointer rounded-full bg-[#6B7B4F] hover:bg-[#586640] text-white text-[11.5px] font-bold shadow-xs gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Selesaikan Transaksi</span>
                          </Button>
                        )}

                        {!isCreatingNewDeal && currentStatus === "menunggu_konfirmasi" && !isSeller && (
                          <div className="flex-1 h-9 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 px-3">
                            <Clock className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                            <span>Menunggu Serah Terima COD</span>
                          </div>
                        )}

                        {/* Tombol Batalkan Transaksi */}
                        {!isCreatingNewDeal &&
                          (currentStatus === "menunggu_konfirmasi" ||
                            currentStatus === "menunggu_persetujuan") && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => onUpdateStatus("dibatalkan")}
                              disabled={isUpdatingTx}
                              className="h-9 cursor-pointer rounded-full border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold"
                            >
                              Batal
                            </Button>
                          )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Transaksi Dibatalkan: Banner & Tombol Mulai Tawar Ulang */}
                {isCancelled && !isCreatingNewDeal && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-red-50/80 border border-red-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <XCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-xs text-red-950">
                          Kesepakatan Sebelumnya Dibatalkan
                        </h4>
                        <p className="text-[11px] text-red-700">
                          Ingin bernegosiasi ulang atau mengajukan tawaran harga baru untuk sampah ini?
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      onClick={handleStartNewDeal}
                      disabled={isUpdatingTx}
                      className="rounded-full h-8.5 px-4 text-xs font-bold bg-[#171717] hover:bg-[#2B2B26] text-white shadow-xs gap-1.5 shrink-0 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                      <span>Mulai Tawar Ulang</span>
                    </Button>
                  </div>
                )}

                {/* 5. Transaksi Selesai: Banner, CTA Beri Ulasan, & Tombol Buat Transaksi Baru */}
                {isCompleted && !isCreatingNewDeal && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-xs text-emerald-950">
                          Transaksi Selesai &amp; Pembayaran Berhasil
                        </h4>
                        <p className="text-[11px] text-emerald-700">
                          Total {formatRupiah(Number(activeTx?.finalPrice || currentDealInput.price))} telah diserahterimakan di lokasi.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasReviewed ? (
                        <Badge
                          variant="outline"
                          className="rounded-full h-8.5 px-3.5 text-xs font-bold bg-emerald-100/90 text-emerald-800 border-emerald-300 gap-1.5 shrink-0"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Ulasan Terkirim</span>
                        </Badge>
                      ) : onOpenReviewDialog ? (
                        <Button
                          type="button"
                          size="sm"
                          onClick={onOpenReviewDialog}
                          className="rounded-full h-8.5 px-3.5 text-xs font-bold bg-[#171717] hover:bg-[#2B2B26] text-white shadow-xs gap-1.5 shrink-0 cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>Beri Ulasan</span>
                        </Button>
                      ) : null}

                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleStartNewDeal}
                        className="rounded-full h-8.5 px-3.5 text-xs font-bold border-emerald-300 bg-white hover:bg-emerald-100 text-emerald-800 shadow-2xs gap-1.5 shrink-0 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Transaksi Baru</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* 6. Contextual Help Tip */}
                {!isCreatingNewDeal && currentStatus === "menunggu_persetujuan" && isSeller && (
                  <div className="p-2.5 rounded-xl bg-[#FEF3D6] border border-[#C98A0B]/30 flex items-start gap-2 text-xs text-[#92400E]">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#C98A0B]" />
                    <span className="text-[11px] leading-relaxed">
                      Pembeli mengajukan penawaran harga. Jika sepakat, klik <strong>Setujui Harga</strong>. Jika ingin mengubah harga/jumlah, ketik angka baru lalu klik <strong>Tawar Balik</strong>.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialog Preview Foto Sampah Penjual */}
      {photoUrl && (
        <Dialog open={showPhotoModal} onOpenChange={setShowPhotoModal}>
          <DialogContent className="max-w-md rounded-[28px] sm:rounded-[32px] border-zinc-200/80 bg-white p-5 sm:p-6 shadow-2xl">
            <DialogHeader className="text-left space-y-1 pb-2 border-b border-zinc-100">
              <div className="flex items-center gap-2 text-[#6B7B4F]">
                <Camera className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Foto Sampah dari Penjual
                </span>
              </div>
              <DialogTitle className="font-display text-base font-bold text-[#171717]">
                {listingTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#78766B]">
                Kondisi fisik limbah yang terdaftar untuk transaksi ini.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-2">
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100 shadow-inner">
                <Image
                  src={photoUrl}
                  alt={listingTitle}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 400px"
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPhotoModal(false)}
                  className="rounded-full h-8.5 px-4 text-xs font-semibold border-zinc-200"
                >
                  Tutup
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
