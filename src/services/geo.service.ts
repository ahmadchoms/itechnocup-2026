import {
  geocodeAddress,
  reverseGeocode,
  calculateDistanceKm,
  calculateEtaMinutes,
  getGoogleMapsDirectionsUrl,
  DEFAULT_SEMARANG_COORDS,
} from "@/lib/geocode";

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
      addressDetails: coords.addressDetails,
      fallback: false,
    };
  }

  async reverseGeocode(lat: number, lng: number) {
    const coords = await reverseGeocode(lat, lng);

    if (!coords) {
      return {
        ...DEFAULT_SEMARANG_COORDS,
        lat,
        lng,
        fallback: true,
        message: "Alamat tidak dapat diidentifikasi dari koordinat ini",
      };
    }

    return {
      lat: coords.lat,
      lng: coords.lng,
      displayName: coords.displayName,
      addressDetails: coords.addressDetails,
      fallback: false,
    };
  }

  calculateDistanceAndEta(lat1: number, lon1: number, lat2: number, lon2: number) {
    const distanceKm = calculateDistanceKm(lat1, lon1, lat2, lon2);
    const etaMinutes = calculateEtaMinutes(distanceKm);
    const directionsUrl = getGoogleMapsDirectionsUrl(lat2, lon2, lat1, lon1);

    return {
      distanceKm,
      etaMinutes,
      directionsUrl,
    };
  }
}

export const geoService = new GeoService();
