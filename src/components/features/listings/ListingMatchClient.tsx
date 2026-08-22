"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, MessageCircle, MapPin, Package, Star, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Listing {
  id: string;
  sellerId: string;
  categoryId: string;
  title: string;
  photoUrl: string;
  estimatedWeightKg: number | null;
  quantity: number | null;
  unit: string | null;
  condition: string | null;
  description: string | null;
  estimatedPrice: number | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  category: { id: string; name: string };
  createdAt: string;
}

interface WasteRequest {
  id: string;
  buyerId: string;
  categoryId: string;
  title: string;
  description: string | null;
  quantityWanted: number | null;
  unit: string | null;
  offeredPrice: number;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  buyer: { id: string; fullName: string; avatarUrl: string | null };
  category: { id: string; name: string };
  createdAt: string;
}

interface Props {
  listing: Listing;
  wasteRequests: WasteRequest[];
  sessionUser: { id: string; fullName: string; activeRole: string };
}

// Function to calculate string similarity based on matching words
function calculateSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;
  
  const words1 = str1.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
  const words2 = str2.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
  
  if (words1.length === 0 || words2.length === 0) return 0;
  
  let matches = 0;
  for (const w1 of words1) {
    if (words2.includes(w1)) matches++;
  }
  
  // Calculate a score between 0 and 1
  return matches / Math.max(words1.length, words2.length);
}

export function ListingMatchClient({ listing, wasteRequests, sessionUser }: Props) {
  const router = useRouter();
  const [startingChat, setStartingChat] = useState<string | null>(null);

  // Match the requests with the listing based on string similarity (Title)
  const matchedRequests = useMemo(() => {
    return wasteRequests
      .map(req => {
        // Boost similarity if it's in the same category
        let score = calculateSimilarity(listing.title, req.title);
        if (req.categoryId === listing.categoryId) {
          score += 0.5; 
        }
        return { ...req, score };
      })
      .filter(req => req.score > 0) // Only show items that have some overlap or same category
      .sort((a, b) => b.score - a.score);
  }, [wasteRequests, listing]);

  const handleStartChat = async (buyerId: string, reqTitle: string) => {
    setStartingChat(buyerId);
    try {
      const res = await fetch("/api/chat/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: sessionUser.id,
          buyerId: buyerId,
          listingId: listing.id,
          initialMessage: `Halo, saya memiliki ${listing.title} yang mungkin sesuai dengan permintaan Anda ("${reqTitle}"). Mari diskusikan!`,
        }),
      });
      
      const data = await res.json();
      if (res.ok && data.conversationId) {
        router.push(`/chat/${data.conversationId}`);
      } else {
        alert("Gagal memulai chat: " + (data.error || "Unknown error"));
        setStartingChat(null);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
      setStartingChat(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/profile" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">Pencocokan Otomatis</h1>
            <p className="text-xs text-slate-500">Permintaan pembeli yang cocok dengan listing Anda</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Listing Overview Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-4 items-start">
          <img 
            src={listing.photoUrl || "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400"} 
            alt={listing.title} 
            className="w-full sm:w-28 h-28 object-cover rounded-xl border border-slate-100 shrink-0"
          />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                {listing.category?.name || "Kategori"}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">
                {listing.estimatedWeightKg ? `${listing.estimatedWeightKg} ${listing.unit || 'kg'}` : '-'}
              </span>
            </div>
            
            <h2 className="text-base font-bold text-slate-900 truncate">{listing.title}</h2>
            
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{listing.address || "Lokasi tidak ditentukan"}</span>
            </div>
          </div>
        </div>

        {/* AI Matches Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Rekomendasi Pembeli ({matchedRequests.length})
              </h3>
            </div>
            <span className="text-xs text-slate-500">Berdasarkan kategori & kata kunci</span>
          </div>

          {matchedRequests.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700">Belum Ada Permintaan yang Cocok</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Saat ini belum ada pembeli yang mencari limbah jenis ini. Anda tetap bisa menunggu pembeli melihat listing Anda di Marketplace.
                </p>
              </div>
              <div className="pt-2">
                <Link 
                  href="/profile" 
                  className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  Kembali ke Profil
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {matchedRequests.map((req) => (
                <div 
                  key={req.id} 
                  className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-emerald-200 transition-all space-y-4"
                >
                  {/* Buyer Profile + Match score */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={req.buyer.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} 
                        alt={req.buyer.fullName} 
                        className="w-8 h-8 rounded-full object-cover border border-slate-100"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{req.buyer.fullName}</p>
                        <p className="text-[10px] text-slate-400">Pengepul Terverifikasi</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>{req.score > 0.8 ? "Sangat Cocok" : "Cocok"}</span>
                    </div>
                  </div>

                  {/* Request Detail */}
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">{req.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{req.description || "Tidak ada deskripsi tambahan."}</p>
                  </div>

                  {/* Price & Quantity & Location */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-50 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Harga Ditawarkan</span>
                      <span className="font-bold text-emerald-600">Rp {req.offeredPrice.toLocaleString("id-ID")}/{req.unit || 'kg'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Jumlah Dicari</span>
                      <span className="font-semibold text-slate-700">{req.quantityWanted ? `${req.quantityWanted} ${req.unit || 'kg'}` : 'Bebas'}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 block">Lokasi Pengepul</span>
                      <span className="text-slate-600 truncate block">{req.address || "Semarang"}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleStartChat(req.buyerId, req.title)}
                      disabled={startingChat === req.buyerId}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {startingChat === req.buyerId ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Menghubungkan...</span>
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Hubungi Pembeli Ini</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
