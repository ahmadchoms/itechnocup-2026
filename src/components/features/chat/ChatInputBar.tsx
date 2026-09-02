"use client";

import { type FormEvent } from "react";
import { Send, RefreshCw, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatInputBarProps {
  messageInput: string;
  isSending: boolean;
  isSeller: boolean;
  userAddress?: string | null;
  onInputChange: (value: string) => void;
  onSendMessage: (e: FormEvent) => void;
  onQuickMessage: (text: string) => void;
}

export function ChatInputBar({
  messageInput,
  isSending,
  isSeller,
  userAddress,
  onInputChange,
  onSendMessage,
  onQuickMessage,
}: ChatInputBarProps) {
  // Adaptive quick suggestion pills based on role
  const sellerPills = [
    { label: "📦 Sampah siap jemput", text: "Halo, sampah sudah saya pilah dan siap dijemput di lokasi." },
    { label: "🕒 Bisa jemput jam berapa?", text: "Bisa estimasi waktu penjemputan hari ini kira-kira jam berapa?" },
    { label: "📍 Titik lokasi sesuai profil", text: userAddress ? `Alamat penjemputan: ${userAddress}` : "Alamat penjemputan sudah sesuai dengan titik di profil saya." },
    { label: "🤝 Siap COD harga pas", text: "Harga dan kuantitas sudah pas, siap untuk serah terima COD." },
  ];

  const buyerPills = [
    { label: "🚛 Bisa jemput sore ini?", text: "Halo, apakah sampahnya bisa saya jadwalkan jemput sore ini?" },
    { label: "⚖️ Bawa timbangan digital", text: "Saya akan bawa timbangan digital langsung ke lokasi untuk kepastian berat." },
    { label: "📍 Minta titik lokasi", text: "Boleh minta konfirmasi titik lokasi atau patokan penjemputannya?" },
    { label: "💵 Siap bayar tunai COD", text: "Saya siap pembayaran tunai / transfer langsung saat serah terima di tempat." },
  ];

  const currentPills = isSeller ? sellerPills : buyerPills;

  const handleShareLocation = () => {
    const locText = userAddress
      ? `📍 [TITIK LOKASI PENJEMPUTAN] Alamat: ${userAddress}`
      : "📍 [TITIK LOKASI] Lokasi penjemputan saya sudah tertera pada profil akun.";
    onQuickMessage(locText);
  };

  return (
    <div className="p-3 sm:p-4 bg-white border-t border-zinc-200/80 space-y-2.5 shrink-0">
      {/* Adaptive Quick Suggestion Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
        {currentPills.map((pill, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onQuickMessage(pill.text)}
            className="shrink-0 px-2.5 sm:px-3 py-1 rounded-full bg-[#F7F4EE] hover:bg-zinc-200/80 text-[#78766B] hover:text-[#171717] border border-zinc-200/70 transition-all cursor-pointer text-[10.5px] sm:text-[11px] active:scale-95"
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Message Input Form */}
      <form onSubmit={onSendMessage} className="flex items-center gap-2">
        {/* Share Location Quick Action Button */}
        <Tooltip>
          <TooltipTrigger
            type="button"
            onClick={handleShareLocation}
            className="h-9 sm:h-10 w-9 sm:w-10 flex items-center justify-center rounded-full border border-zinc-200 bg-[#F7F4EE] hover:bg-white text-[#6B7B4F] hover:text-[#171717] transition-all shrink-0 cursor-pointer shadow-2xs"
            aria-label="Kirim Titik Lokasi"
          >
            <MapPin className="w-4 h-4" />
          </TooltipTrigger>
          <TooltipContent className="text-xs font-semibold">
            Kirim Titik Lokasi / Alamat
          </TooltipContent>
        </Tooltip>

        <Input
          type="text"
          value={messageInput}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={
            isSeller
              ? "Ketik pesan koordinasi penjemputan sampah..."
              : "Ketik tawaran atau tanya kondisi limbah..."
          }
          className="flex-1 h-9 sm:h-10 px-3.5 sm:px-4 text-xs bg-[#F7F4EE] border-zinc-200/80 rounded-full focus-visible:ring-1 focus-visible:ring-[#171717] focus-visible:bg-white placeholder:text-[#A8A594] transition-all"
        />

        <Button
          type="submit"
          disabled={isSending || !messageInput.trim()}
          className="h-9 sm:h-10 px-4 sm:px-5 cursor-pointer rounded-full bg-[#171717] hover:bg-[#2B2B26] text-white text-xs font-bold shadow-xs transition-all gap-1.5 shrink-0 disabled:opacity-40"
        >
          {isSending ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <span className="hidden sm:inline">Kirim</span>
              <Send className="w-3 h-3" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
