"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Handshake, Clock, CheckCircle2, Info } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ChatConversation, ChatTransaction } from "@/types";

interface DealDrawerProps {
  activeConv: ChatConversation;
  activeTx: ChatTransaction | null;
  isExpanded: boolean;
  isSeller: boolean;
  currentDealInput: { price: string; quantity: string };
  isUpdatingTx: boolean;
  onPriceChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  onUpdateStatus: (
    status: "menunggu_konfirmasi" | "selesai" | "dibatalkan",
  ) => void;
}

export function DealDrawer({
  activeConv,
  activeTx,
  isExpanded,
  isSeller,
  currentDealInput,
  isUpdatingTx,
  onPriceChange,
  onQuantityChange,
  onUpdateStatus,
}: DealDrawerProps) {
  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden border-b border-zinc-200/80 bg-white shrink-0"
        >
          <div className="p-3 sm:p-4">
            <div className="rounded-2xl border border-zinc-200/80 bg-[#F7F4EE]/70 p-3 sm:p-4 space-y-3">
              {/* Top Meta Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-[#C98A0B] shrink-0">
                    <Handshake className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-display font-bold text-xs text-[#171717] block truncate">
                      Formulir Kesepakatan Harga &amp; Penjemputan COD
                    </span>
                    <span className="text-[10.5px] text-[#78766B] truncate block">
                      Item:{" "}
                      {activeConv.match?.listing?.title || "Limbah Sirkular"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs shrink-0">
                  <span className="text-[11px] text-[#78766B]">
                    Estimasi Jarak:
                  </span>
                  <Badge
                    variant="outline"
                    className="font-mono font-bold text-[#6B7B4F] bg-white px-2 py-0.5 rounded-md border-zinc-200/80"
                  >
                    {activeConv.match?.distanceKm
                      ? `${activeConv.match.distanceKm} km`
                      : "0.8 km"}
                  </Badge>
                </div>
              </div>

              {/* Input Parameters: Price and Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div className="space-y-1">
                  <Label className="text-[10.5px] font-bold uppercase tracking-wider text-[#78766B]">
                    Jumlah ({activeConv.match?.listing?.unit || "kg"})
                  </Label>
                  <Input
                    type="number"
                    value={currentDealInput.quantity}
                    onChange={(e) => onQuantityChange(e.target.value)}
                    disabled={isSeller || isUpdatingTx}
                    className="h-9 text-xs font-bold bg-white border-zinc-200 rounded-xl text-[#171717] focus-visible:ring-1 focus-visible:ring-[#171717] disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="25"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[10.5px] font-bold uppercase tracking-wider text-[#78766B]">
                    Total Harga Kesepakatan (Rp)
                  </Label>
                  <Input
                    type="number"
                    value={currentDealInput.price}
                    onChange={(e) => onPriceChange(e.target.value)}
                    disabled={isSeller || isUpdatingTx}
                    className="h-9 text-xs font-mono font-extrabold bg-white border-zinc-200 rounded-xl text-[#171717] focus-visible:ring-1 focus-visible:ring-[#171717] disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="45000"
                  />
                </div>

                {/* Action Trigger Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  
                  {/* NEW OFFER (Belum ada transaksi atau dibatalkan) -> Hanya Pembeli */}
                  {(!activeTx || activeTx.status === "dibatalkan") && !isSeller && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onUpdateStatus("menunggu_persetujuan")}
                      disabled={isUpdatingTx}
                      className="h-9 flex-1 cursor-pointer rounded-full bg-[#171717] hover:bg-[#2B2B26] text-white text-[11.5px] font-bold shadow-xs gap-1.5"
                    >
                      <Handshake className="w-3.5 h-3.5 text-amber-300" />
                      <span>Tawarkan Harga</span>
                    </Button>
                  )}

                  {/* MENUNGGU PERSETUJUAN -> Hanya Penjual yg bisa setuju */}
                  {activeTx?.status === "menunggu_persetujuan" && isSeller && (
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
                  )}
                  {activeTx?.status === "menunggu_persetujuan" && !isSeller && (
                     <Button
                       type="button"
                       size="sm"
                       disabled={true}
                       className="h-9 flex-1 rounded-full bg-zinc-100 text-zinc-500 text-[11.5px] font-bold"
                     >
                       <Clock className="w-3.5 h-3.5 mr-1" /> Menunggu Penjual
                     </Button>
                  )}

                  {/* SELESAIKAN TRANSAKSI -> Hanya Penjual (Sesuai kesepakatan bahwa seller yg tekan tombol complete) */}
                  {activeTx?.status === "menunggu_konfirmasi" && isSeller && (
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

                  {/* BATALKAN (Bisa diakses kapanpun saat belum selesai, oleh siapapun) */}
                  {(activeTx?.status === "menunggu_konfirmasi" || activeTx?.status === "menunggu_persetujuan") && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateStatus("dibatalkan")}
                      disabled={isUpdatingTx}
                      className="h-9 cursor-pointer rounded-full border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-[11.5px] font-bold"
                    >
                      Batal
                    </Button>
                  )}
                </div>
              </div>

              {/* Informational Guidance */}
              {activeTx?.status === "menunggu_persetujuan" && isSeller && (
                <div className="p-2.5 rounded-xl bg-[#FEF3D6] border border-[#C98A0B]/30 flex items-start gap-2 text-xs text-[#92400E]">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#C98A0B]" />
                  <span className="text-[11px] leading-relaxed">
                    Pembeli mengajukan penawaran harga. Jika setuju, silakan klik <strong>Setujui Harga</strong>. Jika menolak, klik <strong>Batal</strong>.
                  </span>
                </div>
              )}
              {activeTx?.status === "menunggu_konfirmasi" && (
                <div className="p-2.5 rounded-xl bg-[#FEF3D6] border border-[#C98A0B]/30 flex items-start gap-2 text-xs text-[#92400E]">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#C98A0B]" />
                  <span className="text-[11px] leading-relaxed">
                    Harga <strong>{formatRupiah(Number(currentDealInput.price))}</strong> telah disepakati. Silakan tentukan waktu penjemputan.
                    {isSeller && " Jika sudah selesai, tekan tombol Selesaikan Transaksi."}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
