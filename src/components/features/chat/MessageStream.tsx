"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatIdDate } from "@/lib/format";
import type { ChatMessage } from "./types";

interface MessageStreamProps {
  messages: ChatMessage[];
  effectiveUserId: string;
}

export function MessageStream({ messages, effectiveUserId }: MessageStreamProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-xs text-[#78766B] space-y-2">
        <p className="font-semibold text-[#171717]">Belum ada pesan terkirim.</p>
        <p className="max-w-xs">Mulai negosiasi harga atau tanyakan titik temu penjemputan limbah.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-3.5 sm:p-5 md:p-6 overflow-y-auto space-y-3.5 scrollbar-thin">
      {messages.map((msg) => {
        const isMe = msg.senderId === effectiveUserId;
        const isSystem = msg.senderId === "system";

        if (isSystem) {
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex justify-center my-2 sm:my-3"
            >
              <div className="px-3.5 py-2 rounded-2xl bg-white border border-zinc-200 shadow-2xs text-center max-w-sm sm:max-w-md space-y-1">
                <p className="text-[11px] sm:text-[11.5px] font-medium text-[#171717] leading-relaxed">
                  {msg.content}
                </p>
                <span className="block font-mono text-[9px] sm:text-[9.5px] text-[#8A8778]">
                  {formatIdDate(msg.sentAt, { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </motion.div>
          );
        }

        return (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex flex-col max-w-[85%] sm:max-w-[70%]",
              isMe ? "ml-auto items-end" : "mr-auto items-start"
            )}
          >
            <div
              className={cn(
                "px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-normal leading-relaxed shadow-2xs break-words",
                isMe
                  ? "bg-[#171717] text-white rounded-2xl rounded-tr-xs"
                  : "bg-white text-[#171717] border border-zinc-200/90 rounded-2xl rounded-tl-xs"
              )}
            >
              {msg.content}
            </div>
            <span className="font-mono text-[9px] sm:text-[9.5px] text-[#8A8778] mt-1 px-1.5">
              {formatIdDate(msg.sentAt, { hour: "2-digit", minute: "2-digit" })}
            </span>
          </motion.div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
