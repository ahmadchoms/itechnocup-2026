"use client";

import { useState, useMemo, useEffect, useOptimistic, startTransition, type FormEvent } from "react";
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
import { sendMessageAction, getUserConversationsAction } from "@/actions/chat.actions";
import { updateTransactionStatusAction } from "@/actions/transaction.actions";
import type { ChatClientProps, ChatConversation, ChatMessage } from "@/types";

type OptimisticAction =
  | { type: "add_message"; conversationId: string; message: ChatMessage }
  | { type: "update_tx"; conversationId: string; transaction: any };

export function ChatClient({
  conversations,
  activeId,
  currentUserId,
}: ChatClientProps) {
  const [selectedConvId, setSelectedConvId] = useState<string>(
    activeId || (conversations.length > 0 ? conversations[0].id : ""),
  );

  // Responsive state: if activeId is provided on mobile, show chat directly; otherwise show list first
  const [showMobileChat, setShowMobileChat] = useState<boolean>(
    Boolean(activeId || conversations.length > 0),
  );

  const [messageInput, setMessageInput] = useState("");
  const [convList, setConvList] = useState<ChatConversation[]>(conversations);

  // Smart Real-time polling every 3.5 seconds for incoming messages & updates
  useEffect(() => {
    const interval = setInterval(async () => {
      if (typeof document !== "undefined" && document.hidden) return;

      const res = await getUserConversationsAction();
      if (res.success && res.conversations) {
        setConvList(res.conversations);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // React 19 Optimistic State for zero-lag messaging
  const [optimisticConvs, setOptimisticUpdate] = useOptimistic(
    convList,
    (state: ChatConversation[], action: OptimisticAction) => {
      if (action.type === "add_message") {
        return state.map((c) =>
          c.id === action.conversationId
            ? { ...c, messages: [...(c.messages || []), action.message] }
            : c
        );
      }
      if (action.type === "update_tx") {
        return state.map((c) =>
          c.id === action.conversationId
            ? {
                ...c,
                transactions: [
                  {
                    ...action.transaction,
                    finalPrice: Number(action.transaction.finalPrice),
                    finalQuantity: Number(action.transaction.finalQuantity || 0),
                  },
                ],
              }
            : c
        );
      }
      return state;
    }
  );

  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<ChatFilterTab>("semua");
  const [isDealBoxExpanded, setIsDealBoxExpanded] = useState(true);

  // Active conversation from optimistic state
  const activeConv = useMemo(() => {
    return optimisticConvs.find((c) => c.id === selectedConvId) || optimisticConvs[0] || null;
  }, [optimisticConvs, selectedConvId]);

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
  const [dealInputs, setDealInputs] = useState<
    Record<string, { price: string; quantity: string }>
  >({});

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

    const p = Number(activeConv.match?.request?.offeredPrice) || Number(activeConv.match?.listing?.estimatedPrice) || 1800;
    const q = Number(activeConv.match?.listing?.quantity) || Number(activeConv.match?.listing?.estimatedWeightKg) || 25;
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
    return optimisticConvs.filter((conv) => {
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
  }, [optimisticConvs, searchQuery, filterTab, effectiveUserId]);

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
    const convId = activeConv.id;
    setMessageInput("");

    // Optimistic message object
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversationId: convId,
      senderId: effectiveUserId,
      content: currentMsg,
      sentAt: new Date(),
    };

    startTransition(async () => {
      setOptimisticUpdate({
        type: "add_message",
        conversationId: convId,
        message: optimisticMessage,
      });

      setIsSending(true);
      try {
        const res = await sendMessageAction({
          conversationId: convId,
          content: currentMsg,
        });

        if (res.success && res.message) {
          setConvList((prev) =>
            prev.map((c) =>
              c.id === convId
                ? { ...c, messages: [...(c.messages || []), res.message as unknown as ChatMessage] }
                : c,
            ),
          );
        }
      } catch (err) {
        console.error("[ChatClient] sendMessage error:", err);
      } finally {
        setIsSending(false);
      }
    });
  };

  const handleQuickMessage = (text: string) => {
    setMessageInput(text);
  };

  const handleUpdateTransactionStatus = async (
    status: "menunggu_persetujuan" | "menunggu_konfirmasi" | "selesai" | "dibatalkan",
  ) => {
    if (!activeConv) return;
    const convId = activeConv.id;
    setIsUpdatingTx(true);

    const priceNum = Number(currentDealInput.price) || 0;
    const qtyNum = Number(currentDealInput.quantity) || 0;

    let milestoneText = "";
    if (status === "menunggu_persetujuan") {
      milestoneText = `📢 [TAWARAN DIAJUKAN] Pembeli mengajukan tawaran harga total sebesar ${formatRupiah(priceNum)} (${qtyNum} ${activeConv.match?.listing?.unit || "kg"}). Menunggu persetujuan penjual.`;
    } else if (status === "menunggu_konfirmasi") {
      milestoneText = `🤝 [TAWARAN DISETUJUI] Penjual telah menyetujui harga kesepakatan. Silakan jadwalkan penjemputan COD.`;
    } else if (status === "selesai") {
      milestoneText = `✅ [TRANSAKSI SELESAI] Penjemputan dan pembayaran tunai COD senilai ${formatRupiah(priceNum)} telah berhasil diselesaikan.`;
    } else if (status === "dibatalkan") {
      milestoneText = `❌ [TRANSAKSI DIBATALKAN] Kesepakatan transaksi ini telah dibatalkan oleh salah satu pihak.`;
    }

    startTransition(async () => {
      // Optimistic update for deal drawer
      setOptimisticUpdate({
        type: "update_tx",
        conversationId: convId,
        transaction: {
          id: `temp-tx-${Date.now()}`,
          status,
          finalPrice: priceNum,
          finalQuantity: qtyNum,
          unit: activeConv.match?.listing?.unit || "kg",
        },
      });

      try {
        const res = await updateTransactionStatusAction({
          conversationId: convId,
          status,
          finalPrice: priceNum,
          finalQuantity: qtyNum,
          unit: activeConv.match?.listing?.unit || "kg",
        });

        if (res.success && res.transaction) {
          const updatedTx = res.transaction;

          setConvList((prev) =>
            prev.map((c) =>
              c.id === convId
                ? {
                    ...c,
                    transactions: [
                      {
                        ...updatedTx,
                        finalPrice: Number(updatedTx.finalPrice),
                        finalQuantity: updatedTx.finalQuantity
                          ? Number(updatedTx.finalQuantity)
                          : qtyNum,
                      },
                    ],
                  }
                : c,
            ),
          );

          if (milestoneText) {
            const msgRes = await sendMessageAction({
              conversationId: convId,
              content: milestoneText,
            });
            if (msgRes.success && msgRes.message) {
              setConvList((prev) =>
                prev.map((c) =>
                  c.id === convId
                    ? { ...c, messages: [...(c.messages || []), msgRes.message as unknown as ChatMessage] }
                    : c,
                ),
              );
            }
          }
        }
      } catch (err) {
        console.error("[ChatClient] updateTransactionStatus error:", err);
      } finally {
        setIsUpdatingTx(false);
      }
    });
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          displayFont.variable,
          bodyFont.variable,
          "max-w-7xl mx-auto p-2 sm:p-4 lg:p-6 h-[calc(100vh-4rem)] max-h-220",
        )}
      >
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/80 shadow-xs flex overflow-hidden h-full">
          {/* Left Column: Conversation List */}
          <div
            className={cn(
              "w-full md:w-80 lg:w-90 h-full flex flex-col shrink-0 transition-all",
              showMobileChat ? "hidden md:flex" : "flex",
            )}
          >
            <ConversationList
              conversations={optimisticConvs}
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
              !showMobileChat ? "hidden md:flex" : "flex",
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
                  onToggleDealBox={() =>
                    setIsDealBoxExpanded(!isDealBoxExpanded)
                  }
                  onBackToConversations={handleBackToConversations}
                />

                {/* 2. Interactive COD Settlement Drawer */}
                <DealDrawer
                  activeConv={activeConv}
                  activeTx={activeTx}
                  isExpanded={isDealBoxExpanded}
                  isSeller={isSeller}
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
