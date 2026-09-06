"use client";

import dynamic from "next/dynamic";
import { ExternalLink, MapPin } from "lucide-react";

const LeafletMapInner = dynamic(() => import("@/components/map/LeafletMapInner"), {
    ssr: false,
    loading: () => (
        <div className="flex h-52 w-full items-center justify-center rounded-2xl bg-[#171717] text-[12px] text-white/60">
            Memuat peta lokasi...
        </div>
    ),
});

interface MapMarker {
    id: string;
    type: "buyer";
    title: string;
    category: string;
    price: string;
    distance: string;
    address?: string;
    lat: number;
    lng: number;
}

interface LocationMapCardProps {
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    markers: MapMarker[];
    center: { lat: number; lng: number };
}

export function LocationMapCard({
    address,
    latitude,
    longitude,
    markers,
    center,
}: LocationMapCardProps) {
    return (
        <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_2px_16px_-4px_rgba(23,23,23,0.06)]">
            <div className="flex items-center justify-between gap-3 border-b border-black/5 pb-3">
                <h3 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.06em] text-[#171717]">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#E8EEDD] text-[#6B7B4F]">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    Lokasi &amp; Peta Penjemputan
                </h3>

                {latitude && longitude && (
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center gap-1 rounded-full border border-black/5 bg-[#F7F4EE] px-3 py-1.5 text-[11.5px] font-semibold text-[#171717] transition-colors hover:border-black/15"
                    >
                        Buka Rute
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                )}
            </div>

            <div className="mt-4 space-y-1">
                <span className="text-[11px] font-semibold text-[#78766B]">Alamat Lengkap</span>
                <p className="text-[13.5px] font-semibold text-[#171717]">{address}</p>
            </div>

            <div className="relative mt-4 h-52 w-full overflow-hidden rounded-2xl border border-black/5">
                <LeafletMapInner
                    markers={markers.map((m) => ({ ...m, address: m.address || "" }))}
                    defaultCenter={center}
                    onSelectPin={() => { }}
                />
            </div>
        </div>
    );
}