"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { MapPin, X, RefreshCw, Crosshair, Navigation, Sparkles } from "lucide-react";
import { Listing, WasteRequest } from "@/types";
import { MapMarkerItem } from "./LeafletMapInner";
import { cn } from "@/lib/utils";
import { calculateDistanceKm, DEFAULT_SEMARANG_COORDS } from "@/lib/geocode";

const LeafletMapInner = dynamic(() => import("./LeafletMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400 space-y-2 min-h-[340px]">
      <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
      <span className="text-xs font-medium">Memuat Peta Interaktif DaurNusa...</span>
    </div>
  ),
});

interface ProximityMapProps {
  listings: Listing[];
  requests: WasteRequest[];
  initialUserLocation?: { lat: number; lng: number } | null;
}

export function ProximityMap({
  listings,
  requests,
  initialUserLocation,
}: ProximityMapProps) {
  const [selectedPin, setSelectedPin] = useState<MapMarkerItem | null>(null);

  // State lokasi pengguna (default fallback ke Semarang jika belum ada izin GPS)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>(() => {
    if (
      initialUserLocation &&
      typeof initialUserLocation.lat === "number" &&
      typeof initialUserLocation.lng === "number"
    ) {
      return initialUserLocation;
    }
    return { lat: DEFAULT_SEMARANG_COORDS.lat, lng: DEFAULT_SEMARANG_COORDS.lng };
  });

  const [locationStatus, setLocationStatus] = useState<
    "idle" | "detecting" | "success" | "denied" | "unavailable"
  >("idle");

  // Deteksi lokasi presisi pengguna menggunakan Browser Geolocation API
  const handleDetectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable");
      return;
    }

    setLocationStatus("detecting");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);
        setLocationStatus("success");
      },
      (error) => {
        console.warn("[Geolocation] Could not retrieve user location:", error.message);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus("denied");
        } else {
          setLocationStatus("unavailable");
        }

        // Jika gagal, gunakan koordinat akun session user jika ada
        if (
          initialUserLocation &&
          typeof initialUserLocation.lat === "number" &&
          typeof initialUserLocation.lng === "number"
        ) {
          setUserLocation(initialUserLocation);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [initialUserLocation]);

  // Otomatis meminta/mendeteksi lokasi saat komponen pertama kali mount di browser
  useEffect(() => {
    handleDetectLocation();
  }, [handleDetectLocation]);

  // Format markers dengan perhitungan jarak real-time terhadap koordinat user saat ini
  const markers: MapMarkerItem[] = useMemo(() => {
    const listMarkers: MapMarkerItem[] = listings.map((l, i) => {
      const lat =
        Number(l.latitude) ||
        userLocation.lat + (i % 2 === 0 ? 0.006 + i * 0.003 : -(0.005 + i * 0.003));
      const lng =
        Number(l.longitude) ||
        userLocation.lng + (i % 2 === 0 ? 0.007 + i * 0.002 : -(0.006 + i * 0.002));

      const computedDistance = calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        lat,
        lng
      );

      return {
        id: `listing-${l.id}`,
        type: "seller" as const,
        title: l.title,
        category: l.category?.name || "Limbah",
        price: l.estimatedPrice
          ? `Rp ${Number(l.estimatedPrice).toLocaleString("id-ID")}/${l.unit || "kg"}`
          : "Harga Nego",
        distance: `${computedDistance > 0 ? computedDistance : (0.8 + i * 0.5).toFixed(1)} km`,
        address: l.address || "Semarang, Jawa Tengah",
        lat,
        lng,
      };
    });

    const reqMarkers: MapMarkerItem[] = requests.map((r, i) => {
      const lat =
        Number(r.latitude) ||
        userLocation.lat + (i % 2 === 0 ? -(0.008 + i * 0.002) : 0.007 + i * 0.002);
      const lng =
        Number(r.longitude) ||
        userLocation.lng + (i % 2 === 0 ? 0.005 + i * 0.002 : -(0.007 + i * 0.003));

      const computedDistance = calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        lat,
        lng
      );

      return {
        id: `request-${r.id}`,
        type: "buyer" as const,
        title: r.title,
        category: r.category?.name || "Limbah",
        price: `Tawaran: Rp ${Number(r.offeredPrice).toLocaleString("id-ID")}/${r.unit || "kg"}`,
        distance: `${computedDistance > 0 ? computedDistance : (1.2 + i * 0.7).toFixed(1)} km`,
        address: r.address || "Semarang, Jawa Tengah",
        lat,
        lng,
      };
    });

    return [...listMarkers, ...reqMarkers];
  }, [listings, requests, userLocation]);

  return (
    <div className="relative z-10 isolate bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl overflow-hidden space-y-4">
      {/* Header Info & Lokasi GPS Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Peta Sampah Terdekat
            </h2>
            {locationStatus === "success" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                GPS Akurat
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Klik pin pada peta untuk melihat Penjual &amp; Pengepul limbah di sekitar koordinat Anda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Tombol Refresh / Deteksi Ulang Lokasi User */}
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={locationStatus === "detecting"}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer",
              locationStatus === "detecting"
                ? "bg-slate-800 border-slate-700 text-slate-400"
                : locationStatus === "success"
                ? "bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-emerald-300"
                : "bg-emerald-900/60 hover:bg-emerald-900 border-emerald-700 text-emerald-200"
            )}
            title="Deteksi ulang lokasi GPS saya"
          >
            {locationStatus === "detecting" ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Mendeteksi Lokasi...</span>
              </>
            ) : (
              <>
                <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pusatkan Lokasi Saya</span>
              </>
            )}
          </button>

          {/* Legend Penanda */}
          <div className="flex items-center space-x-3 text-xs font-medium bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Penjual
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Pengepul
            </span>
          </div>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner">
        <LeafletMapInner
          markers={markers}
          userLocation={userLocation}
          onSelectPin={setSelectedPin}
        />

        {/* Selected Pin Overlay Card */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-slate-950/95 border border-slate-800 backdrop-blur-md rounded-2xl p-4 shadow-2xl z-20 space-y-2.5 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  selectedPin.type === "seller"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-700/50"
                    : "bg-amber-950 text-amber-300 border border-amber-700/50"
                )}
              >
                {selectedPin.type === "seller" ? "Penjual Sampah" : "Kebutuhan Pengepul"} • {selectedPin.category}
              </span>

              <button
                type="button"
                onClick={() => setSelectedPin(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                aria-label="Tutup detail pin"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-white line-clamp-1">{selectedPin.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{selectedPin.address}</p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Estimasi Nego</span>
                <span className="text-xs font-extrabold text-emerald-400">{selectedPin.price}</span>
              </div>

              <span className="text-xs font-bold text-amber-400 flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                <Navigation className="w-3 h-3 text-emerald-400" />
                {selectedPin.distance}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}