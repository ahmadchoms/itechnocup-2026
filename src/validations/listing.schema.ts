import { z } from "zod";

export const createListingSchema = z.object({
  title: z.string().min(3, "Judul listing minimal 3 karakter"),
  categoryId: z.string().min(1, "Kategori sampah wajib dipilih"),
  estimatedWeightKg: z.coerce.number().min(0.1, "Estimasi berat minimal 0.1 kg").optional().nullable(),
  quantity: z.coerce.number().optional().nullable(),
  unit: z.string().optional().default("kg"),
  condition: z.string().optional().default("Baik"),
  description: z.string().optional().nullable(),
  estimatedPrice: z.coerce.number().min(0, "Harga minimal Rp 0").optional().nullable(),
  address: z.string().optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  photoUrl: z.string().min(1, "Foto sampah wajib diunggah"),
  cvPredictedCategoryId: z.string().optional().nullable(),
  cvConfidence: z.coerce.number().optional().nullable(),
  isCvCorrected: z.boolean().optional().default(false),
  sellerId: z.string().optional().nullable(),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;

export const updateListingSchema = z.object({
  title: z.string().min(3, "Judul listing minimal 3 karakter").optional(),
  categoryId: z.string().min(1, "Kategori sampah wajib dipilih").optional(),
  estimatedWeightKg: z.coerce.number().min(0.1).optional().nullable(),
  quantity: z.coerce.number().optional().nullable(),
  unit: z.string().optional(),
  condition: z.string().optional(),
  description: z.string().optional().nullable(),
  estimatedPrice: z.coerce.number().min(0).optional().nullable(),
  address: z.string().optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  photoUrl: z.string().optional(),
});

export type UpdateListingInput = z.infer<typeof updateListingSchema>;
