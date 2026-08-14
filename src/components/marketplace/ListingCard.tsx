"use client";

import Link from "next/link";
import { MapPin, Star, Scale } from "lucide-react";
import { Listing } from "@/types";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const getBadgeStyle = (catName: string) => {
    const name = catName.toLowerCase();
    if (name.includes("organik") && !name.includes("anorganik")) return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
    if (name.includes("anorganik")) return "bg-sky-50 text-sky-700 border-sky-200/60";
    if (name.includes("logam")) return "bg-slate-100 text-slate-700 border-slate-200";
    if (name.includes("kopi")) return "bg-amber-50 text-amber-800 border-amber-200/60";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const formattedPrice = listing.estimatedPrice
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(Number(listing.estimatedPrice))
    : "Harga Nego";

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 transition-colors overflow-hidden flex flex-col shadow-xs">
      {/* Photo Container 4:3 Ratio */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img
          src={listing.photoUrl}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
        />

        {/* Category Badge - Top Left */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={cn(
              "px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
              getBadgeStyle(listing.category.name)
            )}
          >
            {listing.category.name}
          </span>
        </div>

        {/* AI Confidence Tag */}
        {listing.cvConfidence && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
              AI {Number(listing.cvConfidence)}%
            </span>
          </div>
        )}

        {/* Proximity Distance Tag */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/90 text-white">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>{listing.distanceKm ?? 0.8} km dari Anda</span>
          </span>
        </div>

        {/* Sold Overlay */}
        {listing.status === "terjual" && (
          <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center z-20">
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-600 text-white">
              Terjual / COD Selesai
            </span>
          </div>
        )}
      </div>

      {/* Card Details Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Seller Info */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-2 min-w-0">
              <img
                src={listing.seller?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                alt={listing.seller?.fullName}
                className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-200"
              />
              <span className="text-xs text-slate-500 truncate font-medium">
                {listing.seller?.fullName || "Seller"}
              </span>
            </div>

            <div className="flex items-center space-x-1 text-amber-600 text-xs font-semibold shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.9</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
            {listing.title}
          </h3>

          {/* Weight & Condition */}
          <div className="flex items-center space-x-3 mt-2 text-xs text-slate-500 font-medium">
            <div className="flex items-center space-x-1">
              <Scale className="w-3.5 h-3.5 text-slate-400" />
              <span>{listing.estimatedWeightKg ? `${listing.estimatedWeightKg} kg` : `${listing.quantity} ${listing.unit}`}</span>
            </div>
            <span>•</span>
            <span className="truncate">{listing.condition || "Kondisi Baik"}</span>
          </div>
        </div>

        {/* Footer: Price & Detail Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Estimasi Harga</span>
            <span className="text-base font-extrabold text-amber-600">{formattedPrice}</span>
          </div>

          <Link
            href={`/listings/${listing.id}`}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
