"use client";

import {
  ArrowLeft,
  Coins,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ChatUser, ChatTransaction } from "./types";

interface ChatHeaderProps {
  partnerUser?: ChatUser | null;
  activeTx?: ChatTransaction | null;
  isSeller: boolean;
  isDealBoxExpanded: boolean;
  onToggleDealBox: () => void;
  onBackToConversations?: () => void;
}

export function ChatHeader({
  partnerUser,
  activeTx,
  isSeller,
  isDealBoxExpanded,
  onToggleDealBox,
  onBackToConversations,
}: ChatHeaderProps) {
  const partnerInitials = partnerUser?.fullName?.slice(0, 2).toUpperCase() || "DN";

  return (
    <div className="px-4 sm:px-5 py-3 border-b border-zinc-200/80 bg-white flex items-center justify-between gap-2 sm:gap-3 shadow-2xs shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Back Button */}
        {onBackToConversations && (
          <button
            type="button"
            onClick={onBackToConversations}
            className="md:hidden p-1.5 -ml-1 rounded-full text-[#171717] hover:bg-[#F7F4EE] transition-colors cursor-pointer shrink-0"
            aria-label="Kembali ke daftar percakapan"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        {/* Partner Avatar */}
        <div className="relative shrink-0">
          <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border border-zinc-200">
            <AvatarImage
              src={
                partnerUser?.avatarUrl ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
              }
              alt={partnerUser?.fullName || "Mitra"}
              className="object-cover"
            />
            <AvatarFallback className="bg-[#EFF3E7] text-xs font-bold text-[#6B7B4F]">
              {partnerInitials}
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#7A8F5C] border-2 border-white" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="font-[family-name:var(--font-display)] font-bold text-xs sm:text-sm text-[#171717] truncate">
              {partnerUser?.fullName || "Mitra DaurNusa"}
            </h2>
            <Badge
              variant="secondary"
              className="hidden sm:inline-flex border-none gap-0.5 rounded-full bg-[#EFF3E7] px-2 py-0.5 text-[10px] font-bold text-[#6B7B4F] shrink-0"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>{isSeller ? "Pengepul Terverifikasi" : "Penjual Terverifikasi"}</span>
            </Badge>
          </div>

          <p className="text-[10.5px] sm:text-[11px] text-[#78766B] flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 text-[#7A8F5C] shrink-0" />
            <span className="truncate max-w-[180px] sm:max-w-[260px]">
              {partnerUser?.address || "Semarang, Jawa Tengah"}
            </span>
          </p>
        </div>
      </div>

      {/* Right Controls: Deal Status & Toggle Button */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {activeTx && (
          <Badge
            variant="outline"
            className={cn(
              "gap-1 sm:gap-1.5 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold",
              activeTx.status === "selesai"
                ? "bg-[#E8EEDD] text-[#6B7B4F] border-[#7A8F5C]/30"
                : activeTx.status === "menunggu_konfirmasi"
                ? "bg-[#FEF3D6] text-[#C98A0B] border-[#C98A0B]/30 animate-pulse"
                : "bg-red-50 text-red-700 border-red-200"
            )}
          >
            {activeTx.status === "selesai" && <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            {activeTx.status === "menunggu_konfirmasi" && <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            {activeTx.status === "dibatalkan" && <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            <span className="truncate max-w-[80px] sm:max-w-none">
              {activeTx.status === "menunggu_konfirmasi" ? "Menunggu COD" : activeTx.status}
            </span>
          </Badge>
        )}

        <Tooltip>
          <TooltipTrigger
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className:
                "h-7 sm:h-8 rounded-full border-zinc-200 bg-[#F7F4EE] hover:bg-white text-[11px] sm:text-xs font-semibold text-[#171717] px-2.5 sm:px-3 gap-1 cursor-pointer",
            })}
            onClick={onToggleDealBox}
          >
            <Coins className="w-3.5 h-3.5 text-[#C98A0B]" />
            <span className="hidden sm:inline">Detail Kesepakatan</span>
            {isDealBoxExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-[#78766B]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-[#78766B]" />
            )}
          </TooltipTrigger>
          <TooltipContent className="text-xs font-semibold">
            {isDealBoxExpanded ? "Sembunyikan form kesepakatan" : "Buka form kesepakatan COD"}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
