"use server";

import { geoService } from "@/services/geo.service";
import { geocodeAddressSchema, GeocodeAddressInput } from "@/validations/geo.schema";

export type GeocodeAddressResult =
  | {
      success: true;
      lat: number;
      lng: number;
      displayName?: string;
      fallback: boolean;
      message?: string;
    }
  | {
      success: false;
      error: string;
    };

export async function geocodeAddressAction(input: GeocodeAddressInput): Promise<GeocodeAddressResult> {
  try {
    const validated = geocodeAddressSchema.parse(input);
    const result = await geoService.geocode(validated.address);
    return {
      success: true,
      lat: result.lat,
      lng: result.lng,
      displayName: result.displayName,
      fallback: result.fallback,
      message: "message" in result ? result.message : undefined,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal melakukan geocoding alamat";
    return { success: false, error: message };
  }
}
