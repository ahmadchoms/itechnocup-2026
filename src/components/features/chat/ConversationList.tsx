"use client";

import { motion } from "framer-motion";
import { Search, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ConversationItem } from "./ConversationItem";
import type { ChatConversation } from "./types";

export type ChatFilterTab = "semua" | "menjual" | "membeli" | "selesai";

interface ConversationListProps {
  conversations: ChatConversation[];
  filteredConversations: ChatConversation[];
  selectedConvId: string;
  searchQuery: string;
  filterTab: ChatFilterTab;
  currentUserId?: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (tab: ChatFilterTab) => void;
  onSelectConversation: (id: string) => void;
}

export function ConversationList({
  conversations,
  filteredConversations,
  selectedConvId,
  searchQuery,
  filterTab,
  currentUserId,
  onSearchChange,
  onFilterChange,
  onSelectConversation,
}: ConversationListProps) {
  const tabs: { key: ChatFilterTab; label: string }[] = [
    { key: "semua", label: "Semua" },
    { key: "menjual", label: "Jual" },
    { key: "membeli", label: "Beli" },
    { key: "selesai", label: "Selesai" },
  ];

  return (
    <div className="w-full md:w-80 lg:w-[360px] border-r border-zinc-100 flex flex-col shrink-0 bg-[#FAF8F5]/80 h-full">
      {/* Header Panel */}
      <div className="p-4 sm:p-5 border-b border-zinc-200/70 bg-white/70 backdrop-blur-xs space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-[#171717]">
              Pesan &amp; Negosiasi
            </h1>
            <p className="text-[11px] text-[#78766B]">
              Hub Terpadu Penjual &amp; Pengepul
            </p>
          </div>
          <Badge
            variant="outline"
            className="rounded-full border-[#7A8F5C]/30 bg-[#EFF3E7] px-2.5 py-0.5 text-[10.5px] font-bold text-[#6B7B4F]"
          >
            {conversations.length} Chat
          </Badge>
        </div>

        {/* Search Box */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#8A8778] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama mitra atau item limbah..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#F7F4EE] border-zinc-200/70 rounded-full focus-visible:ring-1 focus-visible:ring-[#171717] focus-visible:bg-white placeholder:text-[#A8A594] transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-0.5 bg-[#F7F4EE] rounded-full text-[11px] font-semibold border border-zinc-200/60">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onFilterChange(tab.key)}
              className={cn(
                "relative flex-1 py-1 px-2 rounded-full transition-colors text-center cursor-pointer capitalize text-[11px]",
                filterTab === tab.key
                  ? "text-[#171717] font-bold"
                  : "text-[#78766B] hover:text-[#171717]"
              )}
            >
              {filterTab === tab.key && (
                <motion.div
                  layoutId="activeChatFilterTab"
                  className="absolute inset-0 rounded-full bg-white shadow-2xs"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversation List Feed */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1.5 scrollbar-thin">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#F7F4EE] flex items-center justify-center mx-auto text-[#8A8778]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-[#171717]">Tidak ada percakapan</p>
            <p className="text-[11px] text-[#78766B]">
              {searchQuery
                ? "Coba gunakan kata kunci pencarian lain."
                : "Pesan penawaran limbah atau pembelian akan tampil di sini."}
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conv={conv}
              isSelected={conv.id === selectedConvId}
              currentUserId={currentUserId}
              onSelect={onSelectConversation}
            />
          ))
        )}
      </div>
    </div>
  );
}
