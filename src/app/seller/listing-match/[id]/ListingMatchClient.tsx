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

export default function ListingMatchClient({ listing, wasteRequests, sessionUser }: Props) {
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
        router.push(`/seller/chat/${data.conversationId}`);
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
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/profile" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Link>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">Detail & Pencocokan</h1>
            <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Rekomendasi Pengepul
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-6 mt-2">
        
        {/* Listing Detail Card */}
        <section className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-5 flex gap-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/50">
              <img 
                src={listing.photoUrl} 
                alt={listing.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px] w-fit mb-2">
                <Package className="w-3 h-3" />
                <span>{listing.category.name}</span>
              </div>
              <h2 className="font-bold text-lg text-slate-900 truncate mb-1">{listing.title}</h2>
              {listing.estimatedWeightKg && (
                <p className="text-sm text-slate-500 font-medium mb-1">
                  Est. Berat: {listing.estimatedWeightKg} {listing.unit || "Kg"}
                </p>
              )}
              {listing.estimatedPrice && (
                <p className="text-sm font-bold text-emerald-600">
                  Rp {listing.estimatedPrice.toLocaleString("id-ID")}
                </p>
              )}
            </div>
          </div>
          <div className="bg-emerald-600/5 p-4 border-t border-emerald-600/10 flex items-start gap-3">
             <div className="bg-emerald-100 p-2 rounded-full shrink-0">
               <Sparkles className="w-4 h-4 text-emerald-600" />
             </div>
             <div>
               <h3 className="text-sm font-bold text-emerald-900 mb-0.5">Sistem Pencocokan Aktif</h3>
               <p className="text-xs text-emerald-700/80 leading-relaxed">
                 Kami telah menganalisis sampah Anda dan mencarikan pengepul terdekat yang sedang membutuhkan barang serupa.
               </p>
             </div>
          </div>
        </section>

        {/* Matched Requests Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <h3 className="font-bold text-slate-900 text-lg">Pengepul yang Disarankan ({matchedRequests.length})</h3>
          </div>
          
          {matchedRequests.length === 0 ? (
             <div className="bg-white border border-dashed border-slate-300 rounded-[24px] p-10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Belum ada Pengepul yang cocok</h4>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                  Saat ini belum ada pengepul yang mencari sampah dengan kriteria yang mirip. Anda dapat menunggu atau mengubah deskripsi sampah.
                </p>
             </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {matchedRequests.map((req) => (
                <div key={req.id} className="bg-white rounded-[24px] p-5 border border-slate-200/80 shadow-sm transition-all hover:shadow-md hover:border-emerald-200">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3 items-center">
                         <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                            {req.buyer.avatarUrl ? (
                               <img src={req.buyer.avatarUrl} alt={req.buyer.fullName} className="w-full h-full object-cover" />
                            ) : (
                               <div className="w-full h-full flex items-center justify-center bg-emerald-600 text-white font-bold text-sm">
                                 {req.buyer.fullName.charAt(0).toUpperCase()}
                               </div>
                            )}
                         </div>
                         <div>
                            <span className="font-bold text-sm text-slate-900 block">{req.buyer.fullName}</span>
                            <div className="flex items-center gap-1 mt-0.5">
                               <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                               <span className="text-[11px] font-medium text-slate-600">Terverifikasi</span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide">
                        Cocok: {Math.round(req.score * 100)}%
                      </div>
                   </div>

                   <div className="mb-4">
                     <h4 className="font-semibold text-slate-800 text-sm mb-1">{req.title}</h4>
                     <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                       {req.description || "Tidak ada deskripsi spesifik dari pengepul."}
                     </p>
                   </div>
                   
                   <div className="flex items-center gap-4 mb-5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                     <div>
                       <span className="text-[10px] font-medium text-slate-500 block mb-0.5">Penawaran Harga</span>
                       <span className="text-sm font-bold text-emerald-600">Rp {req.offeredPrice.toLocaleString("id-ID")}</span>
                     </div>
                     <div className="w-px h-8 bg-slate-200"></div>
                     <div>
                       <span className="text-[10px] font-medium text-slate-500 block mb-0.5">Kebutuhan</span>
                       <span className="text-sm font-semibold text-slate-700">{req.quantityWanted ? `${req.quantityWanted} ${req.unit || 'Kg'}` : 'Tidak terbatas'}</span>
                     </div>
                   </div>

                   <div className="flex gap-3">
                     <button 
                       onClick={() => handleStartChat(req.buyerId, req.title)}
                       disabled={startingChat === req.buyerId}
                       className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                     >
                       {startingChat === req.buyerId ? (
                         <Loader2 className="w-4 h-4 animate-spin" />
                       ) : (
                         <MessageCircle className="w-4 h-4" />
                       )}
                       <span>Chat Pengepul</span>
                     </button>
                   </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
