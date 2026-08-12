import { NextResponse } from "next/server";
import { geocodeAddress, DEFAULT_SEMARANG_COORDS } from "@/lib/geocode";

/**
 * GET /api/geocode?address=Jl+Simpang+Lima+Semarang
 * Menggunakan OpenStreetMap Nominatim (gratis, tanpa API key).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address || address.trim().length < 5) {
    return NextResponse.json(
      { error: "Parameter 'address' wajib diisi minimal 5 karakter" },
      { status: 400 }
    );
  }

  const coords = await geocodeAddress(address.trim());

  if (!coords) {
    // Fallback ke koordinat Semarang jika Nominatim tidak menemukan hasil
    return NextResponse.json({
      ...DEFAULT_SEMARANG_COORDS,
      fallback: true,
      message: "Alamat tidak ditemukan, menggunakan koordinat default Semarang",
    });
  }

  return NextResponse.json({
    lat: coords.lat,
    lng: coords.lng,
    displayName: coords.displayName,
    fallback: false,
  });
}
