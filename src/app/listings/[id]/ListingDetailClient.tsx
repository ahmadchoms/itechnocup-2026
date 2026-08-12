"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Scale, MessageSquare, ArrowLeft, User, Star, ShieldCheck, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListingDetailClientProps {
  listing: any;
  currentUserId: string | null;
}

export function ListingDetailClient({ listing, currentUserId }: ListingDetailClientProps) {
  const router = useRouter();
  const [isStartingChat, setIsStartingChat] = useState(false);

  const handleStartChat = async () => {
    setIsStartingChat(true);
    try {
      const res = await fetch("/api/matches/start-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          sellerId: listing.sellerId,
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

  const isOwner = currentUserId === listing.sellerId;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button & Breadcrumb */}
      <div className="flex items-center space-x-3">
        <Link
          href="/listings"
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <span className="text-xs text-slate-500 block">Katalog Pasar Sampah</span>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{listing.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Image & Badges */}
        <div className="space-y-4">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={listing.photoUrl}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            {listing.status === "terjual" && (
              <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                <span className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-sm uppercase tracking-wider">
                  Terjual / COD Selesai
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {listing.category?.name}
            </span>
            {listing.cvConfidence && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-purple-200 border border-purple-800">
                AI Computer Vision {listing.cvConfidence}%
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 capitalize">
              Status: {listing.status}
            </span>
          </div>
        </div>

        {/* Right Column: Pricing, Specs, Seller Info & Action */}
        <div className="space-y-6">
          {/* Price & Quantity Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Estimasi Harga
              </span>
              <span className="text-3xl font-extrabold text-amber-600 block mt-1">
                {listing.estimatedPrice
                  ? `Rp ${listing.estimatedPrice.toLocaleString("id-ID")}`
                  : "Nego"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-500 block">Berat / Jumlah:</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {listing.estimatedWeightKg ? `${listing.estimatedWeightKg} kg` : "-"} ({listing.quantity} {listing.unit})
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Kondisi:</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {listing.condition || "Baik"}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Deskripsi Limbah
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {listing.description || "Tidak ada deskripsi tambahan."}
            </p>
          </div>

          {/* Location & Seller Profile */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Lokasi Penjemputan</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">
                  {listing.address}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={listing.seller.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                  alt={listing.seller.fullName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{listing.seller.fullName}</span>
                  <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {listing.seller.avgRating} ({listing.seller.reviewCount} ulasan)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button: Chat / Negosiasi */}
          {!isOwner && listing.status === "aktif" && (
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
                  <span>Hubungi Seller (Mulai Negosiasi)</span>
                </>
              )}
            </button>
          )}

          {isOwner && (
            <Link
              href="/profile/my-listings"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors block text-center"
            >
              Kelola Listing Saya
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
