"use client";

import { CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRupiah, formatIdDate } from "@/lib/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ChatConversation } from "./types";

interface ConversationItemProps {
  conv: ChatConversation;
  isSelected: boolean;
  currentUserId?: string;
  onSelect: (id: string) => void;
}

export function ConversationItem({
  conv,
  isSelected,
  currentUserId,
  onSelect,
}: ConversationItemProps) {
  const isUserSeller = conv.sellerId === currentUserId;
  const partner = isUserSeller ? conv.buyer : conv.seller;
  const lastMsg =
    conv.messages && conv.messages.length > 0
      ? conv.messages[conv.messages.length - 1]
      : null;
  const tx = conv.transactions?.[0];
  const listing = conv.match?.listing;
  const partnerInitials = partner?.fullName?.slice(0, 2).toUpperCase() || "DN";

  return (
    <button
      type="button"
      onClick={() => onSelect(conv.id)}
      className={cn(
        "w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3 cursor-pointer border",
        isSelected
          ? "bg-white border-zinc-300/90 shadow-xs ring-1 ring-black/5"
          : "bg-transparent border-transparent hover:bg-white/70 hover:border-zinc-200/50"
      )}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <Avatar className="h-11 w-11 border border-zinc-200 shadow-2xs">
          <AvatarImage
            src={
              partner?.avatarUrl ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
            }
            alt={partner?.fullName || "User"}
            className="object-cover"
          />
          <AvatarFallback className="bg-[#EFF3E7] text-xs font-bold text-[#6B7B4F]">
            {partnerInitials}
          </AvatarFallback>
        </Avatar>
        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#7A8F5C] border-2 border-white" />
      </div>

      {/* Meta Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className="font-bold text-xs text-[#171717] truncate">
            {partner?.fullName || "Mitra DaurNusa"}
          </span>
          <span className="text-[10px] font-mono text-[#8A8778] shrink-0">
            {lastMsg ? formatIdDate(lastMsg.sentAt, { hour: "2-digit", minute: "2-digit" }) : ""}
          </span>
        </div>

        {/* Role Badge + Waste Title */}
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          <Badge
            variant="secondary"
            className={cn(
              "px-1.5 py-0 rounded-md text-[9.5px] font-bold border",
              isUserSeller
                ? "bg-[#EFF3E7] text-[#6B7B4F] border-[#7A8F5C]/30"
                : "bg-[#FEF3D6] text-[#C98A0B] border-[#C98A0B]/30"
            )}
          >
            {isUserSeller ? "Menjual" : "Membeli"}
          </Badge>

          <span className="text-[11px] font-semibold text-[#171717] truncate max-w-[140px]">
            {listing?.title || "Limbah Sirkular"}
          </span>
          {listing?.estimatedWeightKg && (
            <span className="text-[9.5px] font-mono text-[#8A8778] shrink-0 bg-[#F7F4EE] px-1 py-0.2 rounded">
              {Number(listing.estimatedWeightKg)} kg
            </span>
          )}
        </div>

        {/* Last Message Snippet */}
        <p className="text-[11px] text-[#78766B] truncate">
          {lastMsg ? lastMsg.content : "Klik untuk membuka percakapan."}
        </p>

        {/* Transaction Status Pill */}
        {tx && (
          <div className="mt-2 flex items-center gap-1.5">
            <Badge
              variant="secondary"
              className={cn(
                "border-none px-2 py-0.5 text-[10px] font-bold gap-1 rounded-full",
                tx.status === "selesai"
                  ? "bg-[#E8EEDD] text-[#6B7B4F]"
                  : tx.status === "menunggu_konfirmasi"
                  ? "bg-[#FEF3D6] text-[#C98A0B]"
                  : "bg-red-50 text-red-700"
              )}
            >
              {tx.status === "selesai" && <CheckCircle2 className="w-2.5 h-2.5" />}
              {tx.status === "menunggu_konfirmasi" && <Clock className="w-2.5 h-2.5" />}
              <span>{tx.status === "menunggu_konfirmasi" ? "Menunggu COD" : tx.status}</span>
            </Badge>
            <span className="text-[10px] font-mono font-bold text-[#171717]">
              {formatRupiah(Number(tx.finalPrice))}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
