"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, MapPin, MessageSquare, ArrowRight, RefreshCw } from "lucide-react";
import { MatchItem } from "@/types";
import { cn } from "@/lib/utils";

interface MatchesClientProps {
  matches: MatchItem[];
}

export function MatchesClient({ matches }: MatchesClientProps) {
  const router = useRouter();
  const [loadingMatchId, setLoadingMatchId] = useState<string | null>(null);

  const handleStartChat = async (match: MatchItem) => {
    setLoadingMatchId(match.id);
    try {
      const res = await fetch("/api/matches/start-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: match.id,
          sellerId: match.listing.sellerId,
          buyerId: match.request.buyerId,
        }),
      });
      const data = await res.json();
      if (data.conversationId) {
        router.push(`/chat?id=${data.conversationId}`);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal memulai percakapan");
    } finally {
      setLoadingMatchId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Pencocokan Otomatis Kategori & Proksimitas Jarak</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Rekomendasi Pencocokan Terdekat (Uber Style)
          </h1>
          <p className="text-xs text-slate-500">
            Sistem secara otomatis mencocokkan listing Seller dan kebutuhan Buyer berdasarkan kedekatan lokasi & kategori limbah.
          </p>
        </div>
      </div>

      {/* UBER STYLE PROXIMITY CARDS LIST */}
      <div className="space-y-4">
        {matches.map((match) => {
          const isRecommended = match.status === "disarankan";
          const isLoading = loadingMatchId === match.id;

          return (
            <div
              key={match.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              {/* Distance Badge & Info */}
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex flex-col items-center justify-center text-emerald-700 shrink-0 shadow-xs">
                  <MapPin className="w-5 h-5 text-emerald-600 mb-0.5" />
                  <span className="text-xs font-extrabold">{match.distanceKm} km</span>
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                        isRecommended
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      )}
                    >
                      {isRecommended ? "✨ Disarankan Sangat Cocok" : "Dilihat"}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {match.listing.category.name}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 line-clamp-1">
                    {match.listing.title}
                  </h3>

                  <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>
                      <strong className="text-slate-700">Penjual:</strong> {match.listing.seller.fullName}
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-slate-700">Pembeli:</strong> {match.request.buyer.fullName}
                    </span>
                  </p>
                </div>
              </div>

              {/* Price Specs */}
              <div className="flex items-center space-x-6 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                    Harga Seller / Unit
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    Rp {Number(match.listing.estimatedPrice || 0).toLocaleString("id-ID")}
                  </span>
                  <span className="text-[11px] text-slate-400">/{match.listing.unit || "kg"}</span>
                </div>

                <div className="hidden sm:block">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                    Penawaran Buyer
                  </span>
                  <span className="text-sm font-bold text-amber-600">
                    Rp {Number(match.request.offeredPrice || 0).toLocaleString("id-ID")}
                  </span>
                  <span className="text-[11px] text-slate-400">/{match.request.unit || "kg"}</span>
                </div>
              </div>

              {/* CTA Action */}
              <div className="shrink-0 pt-2 md:pt-0">
                <button
                  onClick={() => handleStartChat(match)}
                  disabled={isLoading}
                  className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Membuka Chat...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      <span>Mulai Chat Negosiasi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
