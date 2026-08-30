"use client";

import { useState, useMemo } from "react";
import {
  ArrowLeft,
  MessageCircle,
  MapPin,
  Sparkles,
  AlertCircle,
  Navigation,
  Clock,
  ExternalLink,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { startChatAction } from "@/actions/chat.actions";
import {
  calculateDistanceKm,
  calculateEtaMinutes,
  getGoogleMapsDirectionsUrl,
} from "@/lib/geocode";

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

function calculateSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;

  const words1 = str1.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((w) => w.length > 2);
  const words2 = str2.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((w) => w.length > 2);

  if (words1.length === 0 || words2.length === 0) return 0;

  let matches = 0;
  for (const w1 of words1) {
    if (words2.includes(w1)) matches++;
  }

  return matches / Math.max(words1.length, words2.length);
}

export function ListingMatchClient({ listing, wasteRequests, sessionUser }: Props) {
  const router = useRouter();
  const [startingChat, setStartingChat] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"smart" | "distance" | "price">("smart");

  const listingLat = listing.latitude || -7.0051;
  const listingLng = listing.longitude || 110.4381;

  // Process and compute Geolocation distance & Smart Match Scoring
  const matchedRequests = useMemo(() => {
    return wasteRequests
      .map((req) => {
        const reqLat = req.latitude || -7.049;
        const reqLng = req.longitude || 110.435;

        // 1. Haversine Distance Calculation (Km)
        const distanceKm = calculateDistanceKm(listingLat, listingLng, reqLat, reqLng);
        const etaMinutes = calculateEtaMinutes(distanceKm);
        const directionsUrl = getGoogleMapsDirectionsUrl(reqLat, reqLng, listingLat, listingLng);

        // 2. Keyword Similarity
        const textSim = calculateSimilarity(listing.title, req.title);
        const isSameCategory = req.categoryId === listing.categoryId;

        // 3. Proximity score (Max 0.3 bonus if distance <= 5km)
        let proximityScore = 0;
        if (distanceKm <= 3) proximityScore = 0.3;
        else if (distanceKm <= 7) proximityScore = 0.2;
        else if (distanceKm <= 15) proximityScore = 0.1;

        // 4. Composite AI Match Score (0.0 to 1.0)
        let totalScore = (isSameCategory ? 0.5 : 0) + textSim * 0.2 + proximityScore;

        return {
          ...req,
          distanceKm,
          etaMinutes,
          directionsUrl,
          score: totalScore,
        };
      })
      .filter((req) => req.score > 0.1 || req.distanceKm <= 20)
      .sort((a, b) => {
        if (sortBy === "distance") return a.distanceKm - b.distanceKm;
        if (sortBy === "price") return b.offeredPrice - a.offeredPrice;
        return b.score - a.score;
      });
  }, [wasteRequests, listing, listingLat, listingLng, sortBy]);

  const handleStartChat = async (buyerId: string, reqTitle: string) => {
    setStartingChat(buyerId);
    try {
      const res = await startChatAction({
        sellerId: sessionUser.id,
        buyerId: buyerId,
        listingId: listing.id,
        initialMessage: `Halo, saya memiliki ${listing.title} yang lokasinya cocok dengan kebutuhan Anda ("${reqTitle}"). Mari koordinasikan penjemputan.`,
      });

      if (res.success && res.conversationId) {
        router.push(`/chat/${res.conversationId}`);
      } else {
        alert("Gagal memulai chat: " + (res.error || "Unknown error"));
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
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Pencocokan &amp; Geolocation
              </h1>
              <p className="text-xs text-slate-500">
                Pengepul terdekat yang cocok dengan material listing Anda
              </p>
            </div>
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
                {listing.estimatedWeightKg
                  ? `${listing.estimatedWeightKg} ${listing.unit || "kg"}`
                  : "-"}
              </span>
            </div>

            <h2 className="text-base font-bold text-slate-900 truncate">{listing.title}</h2>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{listing.address || "Semarang, Jawa Tengah"}</span>
            </div>
          </div>
        </div>

        {/* Matches Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Rekomendasi Pengepul Terdekat ({matchedRequests.length})
              </h3>
            </div>

            {/* Sorting Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 border border-slate-200 rounded-xl text-xs">
              <button
                onClick={() => setSortBy("smart")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  sortBy === "smart"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Kecocokan AI
              </button>
              <button
                onClick={() => setSortBy("distance")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  sortBy === "distance"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Jarak Terdekat 📍
              </button>
              <button
                onClick={() => setSortBy("price")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  sortBy === "price"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Harga Tertinggi 💰
              </button>
            </div>
          </div>

          {matchedRequests.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700">Belum Ada Permintaan yang Cocok</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Saat ini belum ada pembeli yang mencari limbah jenis ini di sekitar lokasi Anda. Listing Anda tetap dapat dilihat oleh pembeli lain di halaman marketplace.
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
                  className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-emerald-300 transition-all space-y-4"
                >
                  {/* Buyer Profile + Geolocation distance badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={req.buyer.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                        alt={req.buyer.fullName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-100 shrink-0"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{req.buyer.fullName}</p>
                        <p className="text-[10px] text-slate-500">Pengepul Terverifikasi</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {/* Distance Badge */}
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-100">
                        <Navigation className="w-3 h-3 text-emerald-600" />
                        <span>{req.distanceKm} km</span>
                      </span>

                      {/* ETA Badge */}
                      <span className="hidden sm:inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg text-xs font-medium border border-amber-200/60">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>~{req.etaMinutes} mnt</span>
                      </span>
                    </div>
                  </div>

                  {/* Request Detail */}
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">{req.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {req.description || "Tidak ada deskripsi tambahan."}
                    </p>
                  </div>

                  {/* Price & Quantity & Location */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Harga Penawaran</span>
                      <span className="font-bold text-emerald-600">
                        Rp {req.offeredPrice.toLocaleString("id-ID")}/{req.unit || "kg"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Jumlah Dicari</span>
                      <span className="font-semibold text-slate-700">
                        {req.quantityWanted ? `${req.quantityWanted} ${req.unit || "kg"}` : "Bebas"}
                      </span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 block">Gudang / Drop Point</span>
                      <span className="text-slate-600 truncate block font-medium">
                        {req.address || "Semarang"}
                      </span>
                    </div>
                  </div>

                  {/* Actions (Chat & Google Maps Routing) */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <button
                      onClick={() => handleStartChat(req.buyerId, req.title)}
                      disabled={startingChat === req.buyerId}
                      className="flex-1 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{startingChat === req.buyerId ? "Menghubungkan..." : "Hubungi Pengepul Ini"}</span>
                    </button>

                    <a
                      href={req.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      title="Buka Navigasi Rute di Google Maps"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span>Rute Maps</span>
                    </a>
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
