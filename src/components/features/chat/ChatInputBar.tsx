"use client";

import { type FormEvent } from "react";
import { Send, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputBarProps {
  messageInput: string;
  isSending: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: (e: FormEvent) => void;
  onQuickMessage: (text: string) => void;
}

export function ChatInputBar({
  messageInput,
  isSending,
  onInputChange,
  onSendMessage,
  onQuickMessage,
}: ChatInputBarProps) {
  return (
    <div className="p-3 sm:p-4 bg-white border-t border-zinc-200/80 space-y-2 shrink-0">
      {/* Quick Suggestion Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
        <button
          type="button"
          onClick={() => onQuickMessage("Halo, apakah barangnya bisa saya jemput sore ini?")}
          className="shrink-0 px-2.5 sm:px-3 py-1 rounded-full bg-[#F7F4EE] hover:bg-zinc-200/70 text-[#78766B] hover:text-[#171717] border border-zinc-200/70 transition-colors cursor-pointer text-[10.5px] sm:text-[11px]"
        >
          📍 Bisa jemput sore ini?
        </button>
        <button
          type="button"
          onClick={() => onQuickMessage("Harga sudah pas sesuai aplikasi, siap COD.")}
          className="shrink-0 px-2.5 sm:px-3 py-1 rounded-full bg-[#F7F4EE] hover:bg-zinc-200/70 text-[#78766B] hover:text-[#171717] border border-zinc-200/70 transition-colors cursor-pointer text-[10.5px] sm:text-[11px]"
        >
          🤝 Siap COD harga pas
        </button>
        <button
          type="button"
          onClick={() => onQuickMessage("Boleh minta share lokasi titik jemput persisnya?")}
          className="shrink-0 px-2.5 sm:px-3 py-1 rounded-full bg-[#F7F4EE] hover:bg-zinc-200/70 text-[#78766B] hover:text-[#171717] border border-zinc-200/70 transition-colors cursor-pointer text-[10.5px] sm:text-[11px]"
        >
          📌 Minta titik jemput
        </button>
      </div>

      {/* Message Input Form */}
      <form onSubmit={onSendMessage} className="flex items-center gap-2">
        <Input
          type="text"
          value={messageInput}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Ketik pesan negosiasi atau koordinasi..."
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
              <span>Kirim</span>
              <Send className="w-3 h-3" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
