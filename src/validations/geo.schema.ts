import { z } from "zod";

export const geocodeAddressSchema = z.object({
  address: z.string().min(3, "Alamat minimal 3 karakter"),
});

export type GeocodeAddressInput = z.infer<typeof geocodeAddressSchema>;
