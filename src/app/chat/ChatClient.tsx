"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Coins, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { RatingModal } from "@/components/marketplace/RatingModal";

interface ChatClientProps {
  conversations: any[];
  activeId?: string;
  sellerIdParam?: string;
  listingIdParam?: string;
}

export function ChatClient({ conversations, activeId, sellerIdParam, listingIdParam }: ChatClientProps) {
  const [selectedConvId, setSelectedConvId] = useState<string>(
    activeId || (conversations.length > 0 ? conversations[0].id : "")
  );

  const [messageInput, setMessageInput] = useState("");
  const [convList, setConvList] = useState<any[]>(conversations);
  const [isSending, setIsSending] = useState(false);

  // Floating Deal Widget State
  const activeConv = convList.find((c) => c.id === selectedConvId) || convList[0];
  const activeTx = activeConv?.transactions?.[0] || null;

  const [dealPrice, setDealPrice] = useState<string>(
    activeTx?.finalPrice
      ? String(activeTx.finalPrice)
      : activeConv?.match?.listing?.estimatedPrice
      ? String(activeConv.match.listing.estimatedPrice * (activeConv?.match?.listing?.estimatedWeightKg || 25))
      : "45000"
  );

  const [dealQuantity, setDealQuantity] = useState<string>(
    activeTx?.finalQuantity
      ? String(activeTx.finalQuantity)
      : String(activeConv?.match?.listing?.estimatedWeightKg || 25)
  );

  const [isUpdatingTx, setIsUpdatingTx] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Rating Modal State — muncul setelah transaksi ditandai selesai
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [completedTx, setCompletedTx] = useState<any | null>(null);
  // Demo: gunakan sellerId conversation sebagai current user
  const currentUserId = activeConv?.sellerId ?? "";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages]);

  // Update deal state when active conversation changes
  useEffect(() => {
    if (activeConv) {
      const tx = activeConv.transactions?.[0];
      if (tx) {
        setDealPrice(String(tx.finalPrice));
        setDealQuantity(String(tx.finalQuantity || 25));
      } else if (activeConv.match?.listing) {
        const p = Number(activeConv.match.listing.estimatedPrice) || 1800;
        const q = Number(activeConv.match.listing.estimatedWeightKg) || 25;
        setDealPrice(String(p * q));
        setDealQuantity(String(q));
      }
    }
  }, [selectedConvId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConv) return;

    const currentMsg = messageInput;
    setMessageInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConv.id,
          senderId: activeConv.sellerId, // Current user
          content: currentMsg,
        }),
      });

      if (res.ok) {
        const newMsg = await res.json();
        setConvList((prev) =>
          prev.map((c) =>
            c.id === activeConv.id
              ? { ...c, messages: [...c.messages, newMsg] }
              : c
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleUpdateTransactionStatus = async (status: "menunggu_konfirmasi" | "selesai" | "dibatalkan") => {
    if (!activeConv) return;
    setIsUpdatingTx(true);

    try {
      const res = await fetch("/api/transactions/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConv.id,
          listingId: activeConv.match?.listing?.id,
          sellerId: activeConv.sellerId,
          buyerId: activeConv.buyerId,
          categoryId: activeConv.match?.listing?.categoryId,
          finalPrice: dealPrice,
          finalQuantity: dealQuantity,
          unit: activeConv.match?.listing?.unit || "kg",
          status,
          transactionId: activeTx?.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Setelah transaksi selesai, buka rating modal (PRD RVW-1)
        if (status === "selesai") {
          setCompletedTx(data.transaction);
          setIsRatingOpen(true);
        }
        setConvList((prev) =>
          prev.map((c) =>
            c.id === activeConv.id
              ? {
                  ...c,
                  transactions: [data.transaction],
                  messages: [
                    ...c.messages,
                    {
                      id: `sys-${Date.now()}`,
                      senderId: "system",
                      content:
                        status === "menunggu_konfirmasi"
                          ? `🤝 KESEPAKAN HARGA: Rp ${Number(dealPrice).toLocaleString("id-ID")} (${dealQuantity} ${activeConv.match?.listing?.unit || "kg"}). Status transaksi: Menunggu COD.`
                          : status === "selesai"
                          ? `✅ TRANSAKSI COD SELESAI: Penyerahan barang & pembayaran sebesar Rp ${Number(dealPrice).toLocaleString("id-ID")} telah dikonfirmasi.`
                          : `❌ TRANSAKSI DIBATALKAN oleh pengguna.`,
                      sentAt: new Date().toISOString(),
                    },
                  ],
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui status transaksi");
    } finally {
      setIsUpdatingTx(false);
    }
  };

  return (
    <>
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden h-[calc(100vh-8rem)] flex flex-col md:flex-row">
      {/* LEFT SIDEBAR: CONVERSATION LIST */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-bold text-base text-slate-900">Pesan & Negosiasi</h2>
          <p className="text-xs text-slate-500">Percakapan real-time Seller & Buyer</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {convList.map((conv) => {
            const isSelected = conv.id === selectedConvId;
            const lastMsg = conv.messages[conv.messages.length - 1];
            const partner = conv.buyer; // Demo partner

            return (
              <button
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={cn(
                  "w-full p-4 text-left flex items-start space-x-3 transition-colors cursor-pointer",
                  isSelected
                    ? "bg-emerald-50/80 border-l-4 border-emerald-600"
                    : "hover:bg-slate-100/80"
                )}
              >
                <img
                  src={partner.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
                  alt={partner.fullName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-xs text-slate-900 truncate">
                      {partner.fullName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {lastMsg ? new Date(lastMsg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                    </span>
                  </div>

                  <p className="text-xs text-emerald-700 font-medium truncate mb-1">
                    {conv.match?.listing?.title || "Transaksi Limbah"}
                  </p>

                  <p className="text-xs text-slate-500 truncate">
                    {lastMsg ? lastMsg.content : "Belum ada pesan."}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT MAIN PANEL: INTERCOM CHAT WINDOW & FLOATING DEAL WIDGET */}
      {activeConv ? (
        <div className="flex-1 flex flex-col h-full bg-slate-50/30">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <img
                src={activeConv.buyer.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
                alt={activeConv.buyer.fullName}
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h3 className="font-bold text-sm text-slate-900">{activeConv.buyer.fullName}</h3>
                <span className="text-xs text-emerald-600 font-medium">
                  Negosiasi: {activeConv.match?.listing?.title}
                </span>
              </div>
            </div>

            {/* Status Pill */}
            {activeTx && (
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1.5",
                  activeTx.status === "selesai"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : activeTx.status === "menunggu_konfirmasi"
                    ? "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
                    : "bg-red-100 text-red-800 border border-red-300"
                )}
              >
                {activeTx.status === "selesai" && <CheckCircle className="w-3.5 h-3.5" />}
                {activeTx.status === "menunggu_konfirmasi" && <Clock className="w-3.5 h-3.5" />}
                {activeTx.status === "dibatalkan" && <XCircle className="w-3.5 h-3.5" />}
                <span className="capitalize">{activeTx.status.replace("_", " ")}</span>
              </span>
            )}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {activeConv.messages.map((msg: any) => {
              const isMe = msg.senderId === activeConv.sellerId;
              const isSystem = msg.senderId === "system";

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center py-2">
                    <span className="inline-block px-4 py-2 rounded-xl text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200/80 shadow-xs">
                      {msg.content}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={cn("flex flex-col max-w-[80%]", isMe ? "ml-auto items-end" : "mr-auto items-start")}
                >
                  <div
                    className={cn(
                      "px-4 py-2.5 rounded-2xl text-xs font-normal leading-relaxed shadow-xs",
                      isMe
                        ? "bg-emerald-600 text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                    )}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* FLOATING DEAL BOX (WIDGET TRANSAKSI COD) */}
          <div className="p-4 bg-white border-t border-slate-200 space-y-3">
            <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white tracking-wide">
                    KESEPAKATAN COD &amp; HARGA
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-300 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                  {activeConv.match?.listing?.category?.name || "Limbah"}
                </span>
              </div>

              {/* Practical Guidance Note */}
              {activeTx?.status === "menunggu_konfirmasi" ? (
                <div className="p-3 bg-amber-950/60 border border-amber-700/60 rounded-xl text-amber-200 text-xs space-y-1">
                  <span className="font-bold block">✓ Kesepakatan dibuat!</span>
                  <p className="text-[11px] text-amber-300/90 leading-relaxed">
                    Silakan lakukan COD tatap muka di lokasi penjemputan. Tekan tombol <strong className="text-white">"Tandai COD Selesai"</strong> di bawah setelah pembayaran tunai diterima.
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Ringkasan barang &amp; sepakati harga akhir transaksi sebelum penjemputan COD:
                </p>
              )}

              {/* Deal Price & Quantity Input Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1">
                    Harga Kesepakatan (Rp)
                  </label>
                  <input
                    type="number"
                    value={dealPrice}
                    onChange={(e) => setDealPrice(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 focus:border-amber-400 rounded-xl text-amber-300 font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1">
                    Jumlah ({activeConv.match?.listing?.unit || "kg"})
                  </label>
                  <input
                    type="number"
                    value={dealQuantity}
                    onChange={(e) => setDealQuantity(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 focus:border-emerald-400 rounded-xl text-white font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Transaction Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {activeTx?.status !== "menunggu_konfirmasi" && activeTx?.status !== "selesai" && (
                  <button
                    onClick={() => handleUpdateTransactionStatus("menunggu_konfirmasi")}
                    disabled={isUpdatingTx}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Sepakati Harga &amp; Janji COD</span>
                  </button>
                )}

                <button
                  onClick={() => handleUpdateTransactionStatus("selesai")}
                  disabled={isUpdatingTx}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-60"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Tandai COD Selesai</span>
                </button>

                <button
                  onClick={() => handleUpdateTransactionStatus("dibatalkan")}
                  disabled={isUpdatingTx}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-300 border border-slate-700 transition-colors flex items-center space-x-1 cursor-pointer disabled:opacity-60"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Batalkan</span>
                </button>
              </div>
            </div>

            {/* Input Message Form Row */}
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Ketik pesan negosiasi..."
                className="flex-1 px-4 py-2.5 text-xs bg-slate-100 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={isSending}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1 cursor-pointer shrink-0"
              >
                {isSending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Kirim</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Pilih percakapan untuk melihat negosiasi
        </div>
      )}
    </div>

    {/* Rating Modal — muncul setelah COD selesai */}
    {completedTx && (
      <RatingModal
        isOpen={isRatingOpen}
        onClose={() => setIsRatingOpen(false)}
        transaction={{
          id: completedTx.id,
          sellerId: completedTx.sellerId,
          buyerId: completedTx.buyerId,
          sellerName: activeConv?.seller?.fullName ?? "Seller",
          buyerName: activeConv?.buyer?.fullName ?? "Buyer",
        }}
        currentUserId={currentUserId}
      />
    )}
    </>
  );
}
