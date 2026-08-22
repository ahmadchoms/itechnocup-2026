import { ShieldCheck, Star } from "lucide-react";
import type { BuyerProfile } from "@/types/waste-request";

interface BuyerProfileCardProps {
    buyer: BuyerProfile;
}

export function BuyerProfileCard({ buyer }: BuyerProfileCardProps) {
    return (
        <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_2px_16px_-4px_rgba(23,23,23,0.06)]">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.06em] text-[#171717]">
                Profil Pengepul Terverifikasi
            </h3>

            <div className="mt-4 flex items-center gap-3.5">
                <img
                    src={
                        buyer.avatarUrl ||
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                    }
                    alt={buyer.fullName}
                    className="h-12 w-12 shrink-0 rounded-full border-2 border-[#7A8F5C] object-cover"
                />
                <div>
                    <div className="flex items-center gap-1.5">
                        <h4 className="text-[13.5px] font-bold text-[#171717]">{buyer.fullName}</h4>
                        <ShieldCheck className="h-4 w-4 shrink-0 text-[#7A8F5C]" aria-hidden="true" />
                    </div>
                    <span className="mt-0.5 inline-block rounded-full bg-[#E8EEDD] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#6B7B4F]">
                        Pengepul Resmi DaurNusa
                    </span>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-black/5 pt-4 text-center">
                <div className="rounded-2xl bg-[#F7F4EE] p-2.5">
                    <span className="block text-[10px] text-[#78766B]">Rating Ulasan</span>
                    <span className="mt-0.5 flex items-center justify-center gap-1 text-[13px] font-extrabold text-[#171717]">
                        <Star className="h-3.5 w-3.5 fill-[#C98A0B] text-[#C98A0B]" aria-hidden="true" />
                        {buyer.avgRating} ({buyer.reviewCount})
                    </span>
                </div>
                <div className="rounded-2xl bg-[#F7F4EE] p-2.5">
                    <span className="block text-[10px] text-[#78766B]">Transaksi Selesai</span>
                    <span className="mt-0.5 block text-[13px] font-extrabold text-[#171717]">
                        {buyer.completedTxCount} Penyerahan
                    </span>
                </div>
            </div>
        </div>
    );
}