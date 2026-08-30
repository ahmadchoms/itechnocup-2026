"use server";

import { geoService } from "@/services/geo.service";
import {
  geocodeAddressSchema,
  GeocodeAddressInput,
  reverseGeocodeSchema,
  ReverseGeocodeInput,
  distanceMatrixSchema,
  DistanceMatrixInput,
} from "@/validations/geo.schema";

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

export type ReverseGeocodeResult =
  | {
      success: true;
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
      fallback: boolean;
      message?: string;
    }
  | {
      success: false;
      error: string;
    };

export async function reverseGeocodeAction(input: ReverseGeocodeInput): Promise<ReverseGeocodeResult> {
  try {
    const validated = reverseGeocodeSchema.parse(input);
    const result = await geoService.reverseGeocode(validated.lat, validated.lng);
    return {
      success: true,
      lat: result.lat,
      lng: result.lng,
      displayName: result.displayName,
      addressDetails: result.addressDetails,
      fallback: result.fallback,
      message: "message" in result ? result.message : undefined,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengidentifikasi alamat dari GPS";
    return { success: false, error: message };
  }
}

export async function calculateDistanceAction(input: DistanceMatrixInput) {
  try {
    const validated = distanceMatrixSchema.parse(input);
    const result = geoService.calculateDistanceAndEta(
      validated.lat1,
      validated.lng1,
      validated.lat2,
      validated.lng2
    );
    return {
      success: true,
      ...result,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menghitung jarak dan estimasi waktu";
    return { success: false, error: message };
  }
}
