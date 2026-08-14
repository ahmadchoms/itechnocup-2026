"use client";

import Link from "next/link";
import { MapPin, Scale } from "lucide-react";
import { WasteRequest } from "@/types";
import { cn } from "@/lib/utils";

interface RequestCardProps {
  requestItem: WasteRequest;
}

export function RequestCard({ requestItem }: RequestCardProps) {
  const getBadgeStyle = (catName: string) => {
    const name = catName.toLowerCase();
    if (name.includes("organik") && !name.includes("anorganik")) return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
    if (name.includes("anorganik")) return "bg-sky-50 text-sky-700 border-sky-200/60";
    if (name.includes("logam")) return "bg-slate-100 text-slate-700 border-slate-200";
    if (name.includes("kopi")) return "bg-amber-50 text-amber-800 border-amber-200/60";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(requestItem.offeredPrice));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-emerald-300 transition-colors shadow-xs flex flex-col justify-between space-y-4">
      <div className="space-y-2.5">
        {/* Category & Buyer Name */}
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
              getBadgeStyle(requestItem.category.name)
            )}
          >
            {requestItem.category.name}
          </span>
          <span className="text-[11px] text-slate-500 font-medium truncate max-w-[140px]">
            Buyer: {requestItem.buyer.fullName}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
          {requestItem.title}
        </h3>

        {/* Description */}
        {requestItem.description && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {requestItem.description}
          </p>
        )}

        {/* Quantity & Location */}
        <div className="flex flex-wrap gap-2 text-xs text-slate-500 pt-1">
          <span className="inline-flex items-center space-x-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
            <Scale className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Kebutuhan: {requestItem.quantityWanted || 50} {requestItem.unit || "kg"}
            </span>
          </span>
          <span className="inline-flex items-center space-x-1 bg-slate-900/90 text-white px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>0.8 km dari Anda</span>
          </span>
        </div>
      </div>

      {/* Offered Price & Action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">
            Penawaran Buyer
          </span>
          <span className="text-base font-extrabold text-amber-600">
            {formattedPrice}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">/{requestItem.unit || "kg"}</span>
        </div>

        <Link
          href={`/requests/${requestItem.id}`}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white transition-colors"
        >
          Tawarkan Limbah
        </Link>
      </div>
    </div>
  );
}
