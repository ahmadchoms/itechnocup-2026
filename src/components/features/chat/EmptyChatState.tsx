"use client";

import { MessageSquare } from "lucide-react";

export function EmptyChatState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-[#FAF8F5]/50 space-y-3 h-full">
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-[#8A8778] shadow-xs">
        <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
      <div>
        <h3 className="font-[family-name:var(--font-display)] font-bold text-sm sm:text-base text-[#171717]">
          Pilih Percakapan
        </h3>
        <p className="text-xs text-[#78766B] max-w-xs sm:max-w-sm mt-1">
          Pilih salah satu obrolan di panel kiri untuk melanjutkan koordinasi penjemputan dan kesepakatan harga COD.
        </p>
      </div>
    </div>
  );
}
