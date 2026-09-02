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
import { CreateReviewDialog } from "./CreateReviewDialog";
import { sendMessageAction, getUserConversationsAction } from "@/actions/chat.actions";
import { updateTransactionStatusAction } from "@/actions/transaction.actions";
import type { ChatClientProps, ChatConversation, ChatMessage } from "@/types";

import { supabase } from "@/lib/supabase";

function mergeUniqueMessages(existingList: ChatMessage[] = [], newMsg: ChatMessage): ChatMessage[] {
  const existingIdIndex = existingList.findIndex((m) => m.id === newMsg.id);
  if (existingIdIndex !== -1) {
    const next = [...existingList];
    next[existingIdIndex] = newMsg;
    return next;
  }

  const tempIndex = existingList.findIndex(
    (m) => String(m.id).startsWith("temp-") && m.content === newMsg.content && m.senderId === newMsg.senderId
  );
  if (tempIndex !== -1) {
    const next = [...existingList];
    next[tempIndex] = newMsg;
    return next;
  }

  return [...existingList, newMsg];
}

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
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewedTxIds, setReviewedTxIds] = useState<string[]>([]);

  // Pure Supabase Realtime WebSocket Connection (0 spam polling)
  useEffect(() => {
    // Sync on tab re-focus only
    const syncConversations = async () => {
      try {
        const res = await getUserConversationsAction();
        if (res.success && res.conversations && res.conversations.length > 0) {
          setConvList(res.conversations);
        }
      } catch (err) {
        console.error("[ChatClient] Sync error:", err);
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        syncConversations();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 2. Supabase Realtime Channel
    const channel = supabase
      .channel("realtime-daurnusa-chat")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMsg = payload.new as any;
          if (!newMsg || !newMsg.conversation_id) return;

          const formattedMessage: ChatMessage = {
            id: newMsg.id,
            conversationId: newMsg.conversation_id,
            senderId: newMsg.sender_id,
            content: newMsg.content,
            sentAt: newMsg.sent_at ? new Date(newMsg.sent_at) : new Date(),
          };

          setConvList((prev) =>
            prev.map((conv) => {
              if (conv.id === newMsg.conversation_id) {
                return {
                  ...conv,
                  messages: mergeUniqueMessages(conv.messages || [], formattedMessage),
                };
              }
              return conv;
            })
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
        },
        (payload) => {
          console.log("[Supabase Realtime] Transaction Event:", payload);
          const updatedTx = payload.new as any;
          if (!updatedTx || !updatedTx.conversation_id) return;

          setConvList((prev) =>
            prev.map((conv) => {
              if (conv.id === updatedTx.conversation_id) {
                return {
                  ...conv,
                  transactions: [
                    {
                      ...updatedTx,
                      finalPrice: Number(updatedTx.final_price || updatedTx.finalPrice || 0),
                      finalQuantity: Number(updatedTx.final_quantity || updatedTx.finalQuantity || 0),
                      unit: updatedTx.unit || "kg",
                    },
                  ],
                };
              }
              return conv;
            })
          );
        }
      )
      .subscribe((status) => {
        console.log("[Supabase Realtime Channel Status]:", status);
      });

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      supabase.removeChannel(channel);
    };
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

  const currentUserAddress = isSeller
    ? activeConv?.seller?.address
    : activeConv?.buyer?.address;

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

    const pricePerUnit =
      Number(activeConv.match?.request?.offeredPrice) ||
      Number(activeConv.match?.listing?.estimatedPrice) ||
      0;
    const qty =
      Number(activeConv.match?.listing?.quantity) ||
      Number(activeConv.match?.listing?.estimatedWeightKg) ||
      Number(activeConv.match?.request?.quantityWanted) ||
      1;

    const totalPrice = pricePerUnit > 0 ? pricePerUnit * qty : 50000;

    return {
      price: String(totalPrice),
      quantity: String(qty),
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
      const title =
        conv.match?.listing?.title || conv.match?.request?.title || "";
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
                ? {
                    ...c,
                    messages: mergeUniqueMessages(
                      c.messages || [],
                      res.message as unknown as ChatMessage
                    ),
                  }
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
    const unit =
      activeConv.match?.listing?.unit ||
      activeConv.match?.request?.unit ||
      "kg";

    // Clean & concise milestone status text
    let milestoneText = "";
    if (status === "menunggu_persetujuan") {
      milestoneText = `[TAWARAN DIAJUKAN] Tawaran harga ${formatRupiah(priceNum)} (${qtyNum} ${unit}) diajukan.`;
    } else if (status === "menunggu_konfirmasi") {
      milestoneText = `[TAWARAN DISETUJUI] Kesepakatan harga ${formatRupiah(priceNum)} (${qtyNum} ${unit}) disetujui. Silakan koordinasikan jadwal penjemputan COD.`;
    } else if (status === "selesai") {
      milestoneText = `[TRANSAKSI SELESAI] Penjemputan limbah dan pembayaran tunai senilai ${formatRupiah(priceNum)} telah berhasil diselesaikan.`;
    } else if (status === "dibatalkan") {
      milestoneText = `[TRANSAKSI DIBATALKAN] Kesepakatan transaksi telah dibatalkan.`;
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
          unit,
        },
      });

      try {
        const txIdToSend =
          activeTx?.status === "selesai" || activeTx?.status === "dibatalkan"
            ? undefined
            : activeTx?.id;

        const res = await updateTransactionStatusAction({
          transactionId: txIdToSend,
          conversationId: convId,
          sellerId: activeConv.sellerId,
          buyerId: activeConv.buyerId,
          listingId: activeConv.match?.listing?.id,
          categoryId:
            activeConv.match?.listing?.categoryId ||
            activeConv.match?.request?.categoryId,
          status,
          finalPrice: priceNum,
          finalQuantity: qtyNum,
          unit,
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
                    ? {
                        ...c,
                        messages: mergeUniqueMessages(
                          c.messages || [],
                          msgRes.message as unknown as ChatMessage
                        ),
                      }
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
                  hasReviewed={Boolean(
                    activeTx &&
                      (reviewedTxIds.includes(activeTx.id) ||
                        (activeTx.reviews || []).some(
                          (r) => r.reviewerId === effectiveUserId
                        ))
                  )}
                  onPriceChange={handlePriceChange}
                  onQuantityChange={handleQuantityChange}
                  onUpdateStatus={handleUpdateTransactionStatus}
                  onOpenReviewDialog={() => setShowReviewDialog(true)}
                />

                {/* 3. Message Stream Bubbles with System Milestone Cards */}
                <MessageStream
                  messages={activeConv.messages || []}
                  effectiveUserId={effectiveUserId}
                />

                {/* 4. Chat Input & Adaptive Quick Suggestion Bar */}
                <ChatInputBar
                  messageInput={messageInput}
                  isSending={isSending}
                  isSeller={isSeller}
                  userAddress={currentUserAddress}
                  onInputChange={setMessageInput}
                  onSendMessage={handleSendMessage}
                  onQuickMessage={handleQuickMessage}
                />

                {/* 5. In-Chat Review Rating Dialog */}
                {activeTx && partnerUser && (
                  <CreateReviewDialog
                    open={showReviewDialog}
                    onOpenChange={setShowReviewDialog}
                    transactionId={activeTx.id}
                    reviewerId={effectiveUserId}
                    revieweeId={partnerUser.id}
                    partnerName={partnerUser.fullName || "Mitra DaurNusa"}
                    onSuccess={() => {
                      if (activeTx) {
                        setReviewedTxIds((prev) => [...prev, activeTx.id]);
                      }
                    }}
                  />
                )}
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
