"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Impor CSS resmi Leaflet agar posisi tiles presisi

export interface MapMarkerItem {
  id: string;
  type: "seller" | "buyer";
  title: string;
  category: string;
  price: string;
  distance: string;
  address: string;
  lat: number;
  lng: number;
}

interface LeafletMapInnerProps {
  markers: MapMarkerItem[];
  defaultCenter: { lat: number; lng: number };
  onSelectPin: (pin: MapMarkerItem) => void;
}

function createCustomIcon(type: "seller" | "buyer") {
  const isSeller = type === "seller";
  const pinColor = isSeller ? "bg-emerald-600 border-emerald-300" : "bg-amber-500 border-amber-200";
  const svgIcon = isSeller
    ? `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"></path></svg>`
    : `<svg class="w-4 h-4 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>`;

  return L.divIcon({
    className: "custom-map-pin",
    html: `<div class="w-8 h-8 rounded-full ${pinColor} border-2 shadow-md flex items-center justify-center transform transition-transform hover:scale-125">${svgIcon}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

export default function LeafletMapInner({ markers, defaultCenter, onSelectPin }: LeafletMapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // 1. Inisialisasi Peta
    const map = L.map(mapContainerRef.current, {
      center: [defaultCenter.lat, defaultCenter.lng],
      zoom: 13,
      zoomControl: false,
    });

    // 2. Tile Layer CartoDB Dark
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(map);

    L.control.zoom({ position: "topright" }).addTo(map);

    // 3. Marker User
    const userIcon = L.divIcon({
      className: "custom-user-pin",
      html: `<div class="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center"><div class="w-2 h-2 rounded-full bg-white"></div></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    L.marker([defaultCenter.lat, defaultCenter.lng], { icon: userIcon })
      .addTo(map)
      .bindTooltip("Lokasi Anda", { direction: "top" });

    // 4. Marker Seller & Buyer
    markers.forEach((m) => {
      const marker = L.marker([m.lat, m.lng], { icon: createCustomIcon(m.type) }).addTo(map);
      marker.on("click", () => {
        onSelectPin(m);
        map.panTo([m.lat, m.lng], { animate: true });
      });
    });

    mapInstanceRef.current = map;

    // 💡 KUNCI PERBAIKAN: Recalculate ukuran peta setelah DOM render selesai
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [defaultCenter, markers, onSelectPin]);

  return <div ref={mapContainerRef} className="w-full h-full z-0 min-h-[320px]" />;
}