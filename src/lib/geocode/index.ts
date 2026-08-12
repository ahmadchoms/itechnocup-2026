/**
 * Geocode helper — memanggil OpenStreetMap Nominatim API secara real.
 * Tidak memerlukan API key.
 * 
 * Penggunaan:
 *   const coords = await geocodeAddress("Jl. Simpang Lima, Semarang");
 *   // { lat: -6.9932, lng: 110.4203 }
 */
export interface GeoCoords {
  lat: number;
  lng: number;
  displayName?: string;
}

export async function geocodeAddress(address: string): Promise<GeoCoords | null> {
  try {
    const encoded = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1&countrycodes=id`;

    const res = await fetch(url, {
      headers: {
        // Nominatim mewajibkan User-Agent yang valid
        "User-Agent": "DaurNusa/1.0 (itechnocup2026@gmail.com)",
        "Accept-Language": "id",
      },
      next: { revalidate: 3600 }, // Cache 1 jam
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const result = data[0];
    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      displayName: result.display_name,
    };
  } catch (err) {
    console.error("[geocode] Error:", err);
    return null;
  }
}

/** Fallback ke koordinat default Semarang jika geocoding gagal */
export const DEFAULT_SEMARANG_COORDS: GeoCoords = {
  lat: -7.0051,
  lng: 110.4381,
  displayName: "Semarang, Jawa Tengah",
};
