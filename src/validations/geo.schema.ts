import { z } from "zod";

export const geocodeAddressSchema = z.object({
  address: z.string().min(3, "Alamat minimal 3 karakter"),
});

export type GeocodeAddressInput = z.infer<typeof geocodeAddressSchema>;

export const reverseGeocodeSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

export type ReverseGeocodeInput = z.infer<typeof reverseGeocodeSchema>;

export const distanceMatrixSchema = z.object({
  lat1: z.coerce.number().min(-90).max(90),
  lng1: z.coerce.number().min(-180).max(180),
  lat2: z.coerce.number().min(-90).max(90),
  lng2: z.coerce.number().min(-180).max(180),
});

export type DistanceMatrixInput = z.infer<typeof distanceMatrixSchema>;
