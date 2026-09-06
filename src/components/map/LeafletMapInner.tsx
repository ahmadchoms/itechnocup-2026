"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
  userLocation?: { lat: number; lng: number };
  defaultCenter?: { lat: number; lng: number };
  onSelectPin: (pin: MapMarkerItem) => void;
}

function createCustomIcon(type: "seller" | "buyer") {
  const isSeller = type === "seller";
  const pinColor = isSeller
    ? "bg-emerald-600 border-emerald-300"
    : "bg-amber-500 border-amber-200";
  const svgIcon = isSeller
    ? `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"></path></svg>`
    : `<svg class="w-4 h-4 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>`;

  return L.divIcon({
    className: "custom-map-pin",
    html: `<div class="w-8 h-8 rounded-full ${pinColor} border-2 shadow-lg flex items-center justify-center transform transition-transform hover:scale-125 cursor-pointer">${svgIcon}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function createUserLocationIcon() {
  return L.divIcon({
    className: "custom-user-pin",
    html: `
      <div style="position:relative; width:32px; height:32px; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; width:28px; height:28px; border-radius:50%; background-color:rgba(16,185,129,0.35); animation:pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
        <div style="width:16px; height:16px; border-radius:50%; background-color:#10b981; border:3px solid #ffffff; box-shadow:0 0 12px rgba(16,185,129,0.8); z-index:10;"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

export default function LeafletMapInner({
  markers,
  userLocation,
  defaultCenter,
  onSelectPin,
}: LeafletMapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const activeCenter = userLocation ||
    defaultCenter || { lat: -7.0051, lng: 110.4381 };

  // 1. Inisialisasi Map Instance (Sekali saja)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [activeCenter.lat, activeCenter.lng],
      zoom: 13,
      zoomControl: false,
    });

    // Tile Layer OpenStreetMap Standard
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      subdomains: ["a", "b", "c"],
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.control.zoom({ position: "topright" }).addTo(map);

    // Layer Group untuk marker limbah & pengepul
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    // Marker Lokasi Anda
    const userMarker = L.marker([userLocation?.lat || 0, userLocation?.lng || 0], {
      icon: createUserLocationIcon(),
      zIndexOffset: 1000,
    })
      .addTo(map)
      .bindTooltip("📍 Lokasi Anda Saat Ini", {
        direction: "top",
        permanent: false,
        className: "leaflet-tooltip-custom",
      });

    userMarkerRef.current = userMarker;
    mapInstanceRef.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
      userMarkerRef.current = null;
    };
  }, []); // Run once on mount

  // 2. Update Marker Lokasi User saat userLocation berubah (misal setelah GPS terdeteksi)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation?.lat || 0, userLocation?.lng || 0]);
    } else {
      userMarkerRef.current = L.marker([userLocation?.lat || 0, userLocation?.lng || 0], {
        icon: createUserLocationIcon(),
        zIndexOffset: 1000,
      })
        .addTo(mapInstanceRef.current)
        .bindTooltip("📍 Lokasi Anda Saat Ini", { direction: "top" });
    }

    // Pan dengan halus ke lokasi baru user
    mapInstanceRef.current.panTo([userLocation?.lat || 0, userLocation?.lng || 0], {
      animate: true,
      duration: 1,
    });
  }, [userLocation?.lat, userLocation?.lng]);

  // 3. Update Markers Limbah (Seller & Buyer)
  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;

    markersLayerRef.current.clearLayers();

    markers.forEach((m) => {
      const marker = L.marker([m.lat, m.lng], {
        icon: createCustomIcon(m.type),
      });

      marker.bindTooltip(
        `<strong>${m.title}</strong><br/><span style="font-size:11px;color:#10b981;">${m.distance}</span>`,
        { direction: "top", opacity: 0.95 },
      );

      marker.on("click", () => {
        onSelectPin(m);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo([m.lat, m.lng], { animate: true });
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [markers, onSelectPin]);

  return <div ref={mapContainerRef} className="w-full h-full z-0 min-h-80" />;
}
