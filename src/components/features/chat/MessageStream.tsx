"use client";

import { useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Handshake,
  CheckCircle2,
  XCircle,
  MapPin,
  Clock,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatIdDate } from "@/lib/format";
import type { ChatMessage } from "@/types";

interface MessageStreamProps {
  messages: ChatMessage[];
  effectiveUserId: string;
  failedMessageIds?: Set<string>;
  onRetryMessage?: (optimisticId: string, content: string) => void;
}

export function MessageStream({
  messages,
  effectiveUserId,
  failedMessageIds,
  onRetryMessage,
}: MessageStreamProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Guarantee strictly unique messages list to prevent duplicate key warning
  const uniqueMessages = useMemo(() => {
    const seenIds = new Set<string>();
    const seenContents = new Set<string>();
    const result: ChatMessage[] = [];

    for (const msg of messages || []) {
      if (!msg) continue;
      const id = String(msg.id);

      // If exact ID was already processed, skip duplicate
      if (seenIds.has(id)) continue;

      // Handle duplicate optimistic vs real message collision
      const contentFingerprint = `${msg.senderId}:${msg.content}`;
      if (id.startsWith("temp-") && seenContents.has(contentFingerprint)) {
        continue;
      }

      seenIds.add(id);
      seenContents.add(contentFingerprint);
      result.push(msg);
    }

    return result;
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [uniqueMessages]);

  if (!uniqueMessages || uniqueMessages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-xs text-[#78766B] space-y-2">
        <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-zinc-200 flex items-center justify-center text-[#6B7B4F]">
          <Sparkles className="w-5 h-5" />
        </div>
        <p className="font-semibold text-[#171717]">
          Belum ada pesan percakapan.
        </p>
        <p className="max-w-xs text-[11px] leading-relaxed">
          Mulai negosiasi harga atau tanyakan titik temu penjemputan limbah
          dengan mitra Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-3.5 sm:p-5 md:p-6 overflow-y-auto space-y-3.5 scrollbar-thin">
      {uniqueMessages.map((msg, index) => {
        const isMe = msg.senderId === effectiveUserId;
        const isSystem = msg.senderId === "system";
        const content = msg.content || "";
        const messageKey = msg.id ? `msg-${msg.id}` : `msg-fallback-${index}`;
        const isFailed = isMe && Boolean(failedMessageIds?.has(String(msg.id)));

        // Check if message is a system milestone
        const isMilestone =
          isSystem ||
          content.includes("[TAWARAN DIAJUKAN]") ||
          content.includes("[TAWARAN DISETUJUI]") ||
          content.includes("[TRANSAKSI SELESAI]") ||
          content.includes("[TRANSAKSI DIBATALKAN]") ||
          content.includes("[TITIK LOKASI");

        if (isMilestone) {
          const isCompleted = content.includes("[TRANSAKSI SELESAI]");
          const isCancelled = content.includes("[TRANSAKSI DIBATALKAN]");
          const isApproved = content.includes("[TAWARAN DISETUJUI]");
          const isLocation = content.includes("[TITIK LOKASI");

          const cardStyles = isCompleted
            ? "bg-emerald-50/90 border-emerald-200 text-emerald-950"
            : isCancelled
              ? "bg-red-50/90 border-red-200 text-red-950"
              : isApproved
                ? "bg-[#E8EEDD]/90 border-[#7A8F5C]/30 text-[#2B3A1C]"
                : isLocation
                  ? "bg-blue-50/90 border-blue-200 text-blue-950"
                  : "bg-amber-50/90 border-amber-200 text-amber-950";

          const Icon = isCompleted
            ? CheckCircle2
            : isCancelled
              ? XCircle
              : isApproved
                ? Handshake
                : isLocation
                  ? MapPin
                  : Clock;

          return (
            <motion.div
              key={messageKey}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex justify-center my-2 sm:my-3"
            >
              <div
                className={cn(
                  "px-4 py-2.5 rounded-2xl border shadow-2xs text-center max-w-sm sm:max-w-md space-y-1 backdrop-blur-xs",
                  cardStyles,
                )}
              >
                <div className="flex items-center justify-center gap-1.5 font-bold text-[11px] uppercase tracking-wider">
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {isCompleted
                      ? "Transaksi Selesai"
                      : isCancelled
                        ? "Kesepakatan Dibatalkan"
                        : isApproved
                          ? "Tawaran Disetujui"
                          : isLocation
                            ? "Titik Penjemputan"
                            : "Tawaran Diajukan"}
                  </span>
                </div>
                <p className="text-[11px] sm:text-[11.5px] font-normal leading-relaxed">
                  {content
                    .replace(/📢\s*\[TAWARAN DIAJUKAN\]\s*/i, "")
                    .replace(/🤝\s*\[TAWARAN DISETUJUI\]\s*/i, "")
                    .replace(/✅\s*\[TRANSAKSI SELESAI\]\s*/i, "")
                    .replace(/❌\s*\[TRANSAKSI DIBATALKAN\]\s*/i, "")
                    .replace(/📍\s*\[TITIK LOKASI.*?\]\s*/i, "")}
                </p>
                <span className="block font-mono text-[9px] opacity-70">
                  {formatIdDate(msg.sentAt, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </motion.div>
          );
        }

        return (
          <motion.div
            key={messageKey}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex flex-col max-w-[85%] sm:max-w-[70%]",
              isMe ? "ml-auto items-end" : "mr-auto items-start",
            )}
          >
            <div
              className={cn(
                "px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-normal leading-relaxed shadow-2xs wrap-break-words",
                isFailed
                  ? "bg-red-50 text-red-900 border border-red-200 rounded-2xl rounded-tr-xs"
                  : isMe
                    ? "bg-[#171717] text-white rounded-2xl rounded-tr-xs"
                    : "bg-white text-[#171717] border border-zinc-200/90 rounded-2xl rounded-tl-xs",
              )}
            >
              {content}
            </div>
            {isFailed ? (
              <button
                type="button"
                onClick={() => onRetryMessage?.(String(msg.id), content)}
                className="flex items-center gap-1 mt-1 px-1.5 text-[9.5px] sm:text-[10px] font-semibold text-red-600 hover:text-red-700 cursor-pointer"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Gagal terkirim &middot; Coba lagi</span>
              </button>
            ) : (
              <span className="font-mono text-[9px] sm:text-[9.5px] text-[#8A8778] mt-1 px-1.5">
                {formatIdDate(msg.sentAt, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </motion.div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
