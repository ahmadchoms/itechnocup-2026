import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Nama lengkap minimal 2 karakter"),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const buyerApplicationSchema = z.object({
  ktpPhotoUrl: z
    .string()
    .min(1, "Foto KTP wajib diunggah"),
  outletPhotoUrl: z
    .string()
    .min(1, "Foto tempat usaha wajib diunggah"),
  npwp: z.string().optional().or(z.literal("")),
  address: z
    .string()
    .min(5, "Alamat operasional minimal 5 karakter"),
});

export type BuyerApplicationInput = z.infer<typeof buyerApplicationSchema>;
