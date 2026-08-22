"use client";

import { RefreshCw, Sparkles } from "lucide-react";
import type { SellerListing } from "@/types/waste-request";

interface MatchingListingsCardProps {
    listings: SellerListing[];
    buyerName: string;
    isStartingChat: boolean;
    onOffer: (message: string) => void;
}

export function MatchingListingsCard({
    listings,
    buyerName,
    isStartingChat,
    onOffer,
}: MatchingListingsCardProps) {
    if (listings.length === 0) return null;

    return (
        <div className="rounded-[28px] bg-[#171717] p-6 text-white">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#C98A0B]" aria-hidden="true" />
                    <h3 className="text-[14px] font-bold tracking-tight">
                        Lapak Sampah Anda yang Cocok
                    </h3>
                </div>
                <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase text-white/80">
                    {listings.length} Cocok
                </span>
            </div>

            <p className="mt-2 text-[12.5px] text-white/60">
                Barang Anda cocok dengan kebutuhan pengepul ini. Tawarkan langsung:
            </p>

            <div className="mt-4 space-y-2">
                {listings.map((listing) => (
                    <div
                        key={listing.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                    >
                        <div className="min-w-0">
                            <h4 className="truncate text-[12.5px] font-bold text-white">{listing.title}</h4>
                            <p className="text-[11px] text-white/50">
                                {(listing.estimatedWeightKg || 0)} kg &middot; Rp{" "}
                                {(listing.estimatedPrice || 0).toLocaleString("id-ID")}/{(listing.unit || "kg")}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                onOffer(
                                    `Halo ${buyerName}, saya punya barang "${listing.title}" sebanyak ${listing.estimatedWeightKg} kg yang cocok dengan kebutuhan Anda.`
                                )
                            }
                            disabled={isStartingChat}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#7A8F5C] px-3 py-1.5 text-[11.5px] font-semibold text-white transition-colors hover:bg-[#6B7B4F] disabled:opacity-60"
                        >
                            {isStartingChat ? (
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                            ) : (
                                "Tawarkan"
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}