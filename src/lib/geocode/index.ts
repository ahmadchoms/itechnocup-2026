/**
 * Geolocation & Geocoding Helper
 * - Geocoding & Reverse Geocoding via OpenStreetMap Nominatim API (Real-time, zero-key)
 * - Haversine Distance Calculation (Km)
 * - Pickup ETA Estimation
 * - Google Maps Routing & Directions Helper
 */

export interface GeoCoords {
  lat: number;
  lng: number;
  displayName?: string;
  addressDetails?: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
  };
}

/** Fallback ke koordinat default Semarang jika geocoding gagal */
export const DEFAULT_SEMARANG_COORDS: GeoCoords = {
  lat: -7.0051,
  lng: 110.4381,
  displayName: "Semarang, Jawa Tengah",
};

/**
 * Geocode: Mengubah string alamat menjadi koordinat Latitude & Longitude
 */
export async function geocodeAddress(address: string): Promise<GeoCoords | null> {
  try {
    const encoded = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1&countrycodes=id&addressdetails=1`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "DaurNusa/1.0 (itechnocup2026@gmail.com)",
        "Accept-Language": "id",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const result = data[0];
    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      displayName: result.display_name,
      addressDetails: result.address
        ? {
            road: result.address.road || result.address.pedestrian,
            suburb: result.address.suburb || result.address.village,
            city: result.address.city || result.address.town || result.address.county,
            state: result.address.state,
            postcode: result.address.postcode,
          }
        : undefined,
    };
  } catch (err) {
    console.error("[geocodeAddress] Error:", err);
    return null;
  }
}

/**
 * Reverse Geocode: Mengubah koordinat GPS (lat, lng) menjadi nama alamat jalan
 */
export async function reverseGeocode(lat: number, lng: number): Promise<GeoCoords | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "DaurNusa/1.0 (itechnocup2026@gmail.com)",
        "Accept-Language": "id",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data || data.error) return null;

    return {
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lon),
      displayName: data.display_name,
      addressDetails: data.address
        ? {
            road: data.address.road || data.address.pedestrian,
            suburb: data.address.suburb || data.address.village,
            city: data.address.city || data.address.town || data.address.county,
            state: data.address.state,
            postcode: data.address.postcode,
          }
        : undefined,
    };
  } catch (err) {
    console.error("[reverseGeocode] Error:", err);
    return null;
  }
}

/**
 * Haversine Formula: Menghitung jarak presisi garis lurus antara dua koordinat GPS (km)
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius bumi dalam km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // 1 desimal presisi
}

/**
 * Estimasi Waktu Tempuh Penjemputan (Menit) berdasarkan rata-rata kecepatan kendaraan urban (30 km/h) + waktu handling
 */
export function calculateEtaMinutes(distanceKm: number): number {
  const averageSpeedKmH = 28; // Kecepatan rata-rata motor/pickup sampah di area perkotaan
  const travelMinutes = (distanceKm / averageSpeedKmH) * 60;
  const handlingBufferMinutes = 5; // Buffer waktu persiapan dan bongkar muat
  return Math.max(5, Math.round(travelMinutes + handlingBufferMinutes));
}

/**
 * Membuat link navigasi Google Maps
 */
export function getGoogleMapsDirectionsUrl(destLat: number, destLng: number, originLat?: number, originLng?: number): string {
  if (originLat !== undefined && originLng !== undefined) {
    return `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}`;
}
