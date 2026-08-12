"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, MessageSquare, ArrowLeft, Star, RefreshCw } from "lucide-react";

interface RequestDetailClientProps {
  request: any;
  currentUserId: string | null;
}

export function RequestDetailClient({ request, currentUserId }: RequestDetailClientProps) {
  const router = useRouter();
  const [isStartingChat, setIsStartingChat] = useState(false);

  const handleStartChat = async () => {
    setIsStartingChat(true);
    try {
      const res = await fetch("/api/matches/start-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: request.buyerId,
          requestId: request.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/chat/${data.conversationId}`);
      } else {
        const errData = await res.json();
        alert(errData.error || "Gagal memulai obrolan");
      }
    } catch {
      alert("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsStartingChat(false);
    }
  };

  const isOwner = currentUserId === request.buyerId;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <div className="flex items-center space-x-3">
        <Link
          href="/requests"
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <span className="text-xs text-slate-500 block">Katalog Permintaan Sampah</span>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{request.title}</h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* Main Price & Quantity Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {request.category?.name}
            </span>
            <span className="text-xs text-slate-500 capitalize font-medium">
              Status: {request.status}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Penawaran Harga Awal Buyer
            </span>
            <span className="text-3xl font-extrabold text-amber-600 block mt-1">
              Rp {request.offeredPrice.toLocaleString("id-ID")} / {request.unit}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs">
            <span className="text-slate-500 block">Jumlah Kebutuhan:</span>
            <span className="font-bold text-slate-900 block mt-0.5 text-sm">
              {request.quantityWanted ? `${request.quantityWanted} ${request.unit}` : "-"}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Spesifikasi Kebutuhan Limbah
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {request.description || "Tidak ada deskripsi spesifikasi tambahan."}
          </p>
        </div>

        {/* Location & Buyer Profile */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Alamat / Lokasi Buyer</span>
              <span className="text-xs font-bold text-slate-900 block mt-0.5">
                {request.address}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={request.buyer.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
                alt={request.buyer.fullName}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">{request.buyer.fullName}</span>
                <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {request.buyer.avgRating} ({request.buyer.reviewCount} ulasan)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button: Tawarkan Limbah (Chat) */}
        {!isOwner && request.status === "aktif" && (
          <button
            onClick={handleStartChat}
            disabled={isStartingChat}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm transition-colors flex items-center justify-center space-x-2 shadow-md cursor-pointer disabled:opacity-60"
          >
            {isStartingChat ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <MessageSquare className="w-4 h-4" />
                <span>Tawarkan Limbah Saya (Mulai Chat)</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
