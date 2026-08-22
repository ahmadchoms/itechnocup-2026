"use client";

import { useState, useMemo, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { formatRupiah } from "@/lib/format";
import { displayFont, bodyFont } from "@/lib/fonts";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConversationList, type ChatFilterTab } from "./ConversationList";
import { ChatHeader } from "./ChatHeader";
import { DealDrawer } from "./DealDrawer";
import { MessageStream } from "./MessageStream";
import { ChatInputBar } from "./ChatInputBar";
import { EmptyChatState } from "./EmptyChatState";
import type { ChatClientProps, ChatConversation, ChatMessage } from "./types";

export function ChatClient({
  conversations,
  activeId,
  currentUserId,
}: ChatClientProps) {
  const [selectedConvId, setSelectedConvId] = useState<string>(
    activeId || (conversations.length > 0 ? conversations[0].id : "")
  );

  // Responsive state: if activeId is provided on mobile, show chat directly; otherwise show list first
  const [showMobileChat, setShowMobileChat] = useState<boolean>(
    Boolean(activeId || conversations.length > 0)
  );

  const [messageInput, setMessageInput] = useState("");
  const [convList, setConvList] = useState<ChatConversation[]>(conversations);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<ChatFilterTab>("semua");
  const [isDealBoxExpanded, setIsDealBoxExpanded] = useState(true);

  // Active conversation
  const activeConv = useMemo(() => {
    return convList.find((c) => c.id === selectedConvId) || convList[0] || null;
  }, [convList, selectedConvId]);

  const activeTx = activeConv?.transactions?.[0] || null;

  // Determine current user persona in this chat
  const effectiveUserId = currentUserId || activeConv?.sellerId || "";
  const isSeller = activeConv ? activeConv.sellerId === effectiveUserId : true;
  const partnerUser = activeConv
    ? isSeller
      ? activeConv.buyer
      : activeConv.seller
    : null;

  // Track customized inputs per conversation
  const [dealInputs, setDealInputs] = useState<Record<string, { price: string; quantity: string }>>({});

  // Computed deal inputs for the active conversation
  const currentDealInput = useMemo(() => {
    if (!activeConv) return { price: "45000", quantity: "25" };

    if (dealInputs[activeConv.id]) {
      return dealInputs[activeConv.id];
    }

    const tx = activeConv.transactions?.[0];
    if (tx) {
      return {
        price: String(tx.finalPrice),
        quantity: String(tx.finalQuantity || 25),
      };
    }

    const p = Number(activeConv.match?.listing?.estimatedPrice) || 1800;
    const q = Number(activeConv.match?.listing?.estimatedWeightKg) || 25;
    return {
      price: String(p * q),
      quantity: String(q),
    };
  }, [activeConv, dealInputs]);

  const handlePriceChange = (value: string) => {
    if (!activeConv) return;
    setDealInputs((prev) => ({
      ...prev,
      [activeConv.id]: {
        ...currentDealInput,
        price: value,
      },
    }));
  };

  const handleQuantityChange = (value: string) => {
    if (!activeConv) return;
    setDealInputs((prev) => ({
      ...prev,
      [activeConv.id]: {
        ...currentDealInput,
        quantity: value,
      },
    }));
  };

  const [isUpdatingTx, setIsUpdatingTx] = useState(false);

  // Filtered conversation list
  const filteredConversations = useMemo(() => {
    return convList.filter((conv) => {
      const isUserSeller = conv.sellerId === effectiveUserId;
      const partner = isUserSeller ? conv.buyer : conv.seller;
      const title = conv.match?.listing?.title || "";
      const q = searchQuery.toLowerCase().trim();

      const matchSearch =
        !q ||
        partner?.fullName?.toLowerCase().includes(q) ||
        title.toLowerCase().includes(q);

      const tx = conv.transactions?.[0];
      const isCompleted = tx?.status === "selesai";

      if (filterTab === "menjual") return matchSearch && isUserSeller;
      if (filterTab === "membeli") return matchSearch && !isUserSeller;
      if (filterTab === "selesai") return matchSearch && isCompleted;
      return matchSearch;
    });
  }, [convList, searchQuery, filterTab, effectiveUserId]);

  const handleSelectConversation = (id: string) => {
    setSelectedConvId(id);
    setShowMobileChat(true);
  };

  const handleBackToConversations = () => {
    setShowMobileChat(false);
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConv) return;

    const currentMsg = messageInput.trim();
    setMessageInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConv.id,
          senderId: effectiveUserId,
          content: currentMsg,
        }),
      });

      if (res.ok) {
        const newMsg: ChatMessage = await res.json();
        setConvList((prev) =>
          prev.map((c) =>
            c.id === activeConv.id
              ? { ...c, messages: [...(c.messages || []), newMsg] }
              : c
          )
        );
      }
    } catch (err) {
      console.error("[ChatClient] sendMessage error:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickMessage = (text: string) => {
    setMessageInput(text);
  };

  const handleUpdateTransactionStatus = async (
    status: "menunggu_konfirmasi" | "selesai" | "dibatalkan"
  ) => {
    if (!activeConv) return;
    setIsUpdatingTx(true);

    const priceNum = Number(currentDealInput.price) || 0;
    const qtyNum = Number(currentDealInput.quantity) || 0;

    try {
      const res = await fetch("/api/transactions/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConv.id,
          status,
          finalPrice: priceNum,
          finalQuantity: qtyNum,
          unit: activeConv.match?.listing?.unit || "kg",
        }),
      });

      if (res.ok) {
        const updatedTx = await res.json();

        // Update in-memory state
        setConvList((prev) =>
          prev.map((c) =>
            c.id === activeConv.id
              ? {
                  ...c,
                  transactions: [
                    {
                      ...updatedTx,
                      finalPrice: Number(updatedTx.finalPrice),
                      finalQuantity: updatedTx.finalQuantity ? Number(updatedTx.finalQuantity) : qtyNum,
                    },
                  ],
                }
              : c
          )
        );

        // Send a system message recording the milestone
        let milestoneText = "";
        if (status === "menunggu_konfirmasi") {
          milestoneText = `📦 [KESEPAKATAN COD DIAJUKAN] Total harga: ${formatRupiah(priceNum)} (${qtyNum} kg). Menunggu serah terima material di lokasi.`;
        } else if (status === "selesai") {
          milestoneText = `✅ [TRANSAKSI SELESAI] Penjemputan dan pembayaran tunai COD senilai ${formatRupiah(priceNum)} telah berhasil diselesaikan.`;
        } else if (status === "dibatalkan") {
          milestoneText = `❌ [TRANSAKSI DIBATALKAN] Kesepakatan transaksi ini telah dibatalkan oleh salah satu pihak.`;
        }

        if (milestoneText) {
          const msgRes = await fetch("/api/chat/message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              conversationId: activeConv.id,
              senderId: effectiveUserId,
              content: milestoneText,
            }),
          });
          if (msgRes.ok) {
            const newMsg = await msgRes.json();
            setConvList((prev) =>
              prev.map((c) =>
                c.id === activeConv.id
                  ? { ...c, messages: [...(c.messages || []), newMsg] }
                  : c
              )
            );
          }
        }
      }
    } catch (err) {
      console.error("[ChatClient] updateTransactionStatus error:", err);
    } finally {
      setIsUpdatingTx(false);
    }
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          displayFont.variable,
          bodyFont.variable,
          "max-w-7xl mx-auto p-2 sm:p-4 lg:p-6 h-[calc(100vh-4rem)] max-h-[880px]"
        )}
      >
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/80 shadow-xs flex overflow-hidden h-full">
          {/* Left Column: Conversation List */}
          <div
            className={cn(
              "w-full md:w-80 lg:w-[360px] h-full flex flex-col shrink-0 transition-all",
              showMobileChat ? "hidden md:flex" : "flex"
            )}
          >
            <ConversationList
              conversations={convList}
              filteredConversations={filteredConversations}
              selectedConvId={selectedConvId}
              searchQuery={searchQuery}
              filterTab={filterTab}
              currentUserId={effectiveUserId}
              onSearchChange={setSearchQuery}
              onFilterChange={setFilterTab}
              onSelectConversation={handleSelectConversation}
            />
          </div>

          {/* Right Column: Chat Room Area */}
          <div
            className={cn(
              "flex-1 flex flex-col h-full bg-[#FAF8F5]/30 min-w-0 transition-all",
              !showMobileChat ? "hidden md:flex" : "flex"
            )}
          >
            {activeConv ? (
              <>
                {/* 1. Partner Header */}
                <ChatHeader
                  partnerUser={partnerUser}
                  activeTx={activeTx}
                  isSeller={isSeller}
                  isDealBoxExpanded={isDealBoxExpanded}
                  onToggleDealBox={() => setIsDealBoxExpanded(!isDealBoxExpanded)}
                  onBackToConversations={handleBackToConversations}
                />

                {/* 2. Interactive COD Settlement Drawer */}
                <DealDrawer
                  activeConv={activeConv}
                  activeTx={activeTx}
                  isExpanded={isDealBoxExpanded}
                  currentDealInput={currentDealInput}
                  isUpdatingTx={isUpdatingTx}
                  onPriceChange={handlePriceChange}
                  onQuantityChange={handleQuantityChange}
                  onUpdateStatus={handleUpdateTransactionStatus}
                />

                {/* 3. Message Stream Bubbles */}
                <MessageStream
                  messages={activeConv.messages || []}
                  effectiveUserId={effectiveUserId}
                />

                {/* 4. Chat Input & Quick Suggestion Bar */}
                <ChatInputBar
                  messageInput={messageInput}
                  isSending={isSending}
                  onInputChange={setMessageInput}
                  onSendMessage={handleSendMessage}
                  onQuickMessage={handleQuickMessage}
                />
              </>
            ) : (
              <EmptyChatState />
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
