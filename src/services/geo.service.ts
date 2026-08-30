import { geocodeAddress, DEFAULT_SEMARANG_COORDS } from "@/lib/geocode";

export class GeoService {
  async geocode(address: string) {
    if (!address || address.trim().length < 3) {
      throw new Error("Parameter 'address' wajib diisi minimal 3 karakter");
    }

    const coords = await geocodeAddress(address.trim());

    if (!coords) {
      return {
        ...DEFAULT_SEMARANG_COORDS,
        fallback: true,
        message: "Alamat tidak ditemukan, menggunakan koordinat default Semarang",
      };
    }

    return {
      lat: coords.lat,
      lng: coords.lng,
      displayName: coords.displayName,
      fallback: false,
    };
  }
}

export const geoService = new GeoService();
