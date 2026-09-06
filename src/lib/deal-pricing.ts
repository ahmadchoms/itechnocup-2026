import type { ChatConversation } from "@/types";

/**
 * Menghitung jarak antara lokasi penjual (listing) dan pembeli (request)
 * menggunakan formula Haversine. Mengembalikan string 1 desimal (km) atau
 * null jika koordinat tidak lengkap.
 */
export function getDistance(conv: ChatConversation): string | null {
  if (conv.match?.distanceKm) return conv.match.distanceKm.toFixed(1);

  const lat1 = Number(
    conv.listing?.latitude ||
      conv.match?.listing?.latitude ||
      conv.seller?.latitude,
  );
  const lon1 = Number(
    conv.listing?.longitude ||
      conv.match?.listing?.longitude ||
      conv.seller?.longitude,
  );
  const lat2 = Number(
    conv.request?.latitude ||
      conv.match?.request?.latitude ||
      conv.buyer?.latitude,
  );
  const lon2 = Number(
    conv.request?.longitude ||
      conv.match?.request?.longitude ||
      conv.buyer?.longitude,
  );

  if (lat1 && lon1 && lat2 && lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  }
  return null;
}

/**
 * Menentukan harga dasar per unit untuk sebuah percakapan/deal.
 *
 * CATATAN TEKNIS: fallback 1500/2500 di bawah adalah placeholder sementara
 * untuk kasus ketika listing & request sama-sama tidak punya harga
 * (data tidak lengkap). Idealnya nilai ini diganti dengan tabel harga
 * dasar per kategori dari database (mis. `category.basePrice`), bukan
 * hardcode berbasis nama item. Ditandai di sini agar mudah ditemukan
 * saat pricing table per kategori sudah tersedia di database.
 */
export function getBasePrice(
  conv: ChatConversation,
  defaultItemName: string = "",
): number {
  return (
    Number(conv.request?.offeredPrice) ||
    Number(conv.match?.request?.offeredPrice) ||
    Number(conv.listing?.estimatedPrice) ||
    Number(conv.match?.listing?.estimatedPrice) ||
    (defaultItemName.toLowerCase().includes("kardus") ? 1500 : 2500)
  );
}
