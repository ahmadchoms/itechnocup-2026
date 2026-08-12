"use client";

import Link from "next/link";
import { MapPin, ShoppingBag, Scale, ArrowRight } from "lucide-react";
import { WasteRequest } from "@/types";

interface RequestCardProps {
  requestItem: WasteRequest;
}

export function RequestCard({ requestItem }: RequestCardProps) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(requestItem.offeredPrice));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-emerald-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4">
      <div className="space-y-2.5">
        {/* Category & Buyer Name */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
            {requestItem.category.name}
          </span>
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
            Buyer: {requestItem.buyer.fullName}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-base text-slate-900 leading-snug">
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
          <span className="inline-flex items-center space-x-1 bg-slate-100 px-2.5 py-1 rounded-lg">
            <Scale className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Kebutuhan: {requestItem.quantityWanted || 50} {requestItem.unit || "kg"}
            </span>
          </span>
          {requestItem.address && (
            <span className="inline-flex items-center space-x-1 bg-slate-100 px-2.5 py-1 rounded-lg truncate max-w-xs">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{requestItem.address}</span>
            </span>
          )}
        </div>
      </div>

      {/* Offered Price & Action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block">
            Penawaran Harga Buyer
          </span>
          <span className="text-base font-bold text-emerald-600">
            {formattedPrice}
          </span>
          <span className="text-[11px] text-slate-400">/{requestItem.unit || "kg"}</span>
        </div>

        <Link
          href={`/chat?buyerId=${requestItem.buyer.id}&requestId=${requestItem.id}`}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center space-x-1.5"
        >
          <span>Tawari Sampah Saya</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
