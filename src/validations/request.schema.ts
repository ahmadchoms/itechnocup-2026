import { z } from "zod";

export const createRequestSchema = z.object({
  title: z.string().min(3, "Judul permintaan minimal 3 karakter"),
  categoryId: z.string().min(1, "Kategori sampah wajib dipilih"),
  quantityWanted: z.coerce.number().optional().nullable(),
  unit: z.string().default("kg"),
  offeredPrice: z.coerce.number().min(0, "Harga penawaran minimal Rp 0"),
  address: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  buyerId: z.string().optional().nullable(),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;

export const updateRequestSchema = z.object({
  title: z.string().min(3, "Judul permintaan minimal 3 karakter").optional(),
  categoryId: z.string().min(1, "Kategori sampah wajib dipilih").optional(),
  quantityWanted: z.coerce.number().optional().nullable(),
  unit: z.string().optional(),
  offeredPrice: z.coerce.number().min(0).optional(),
  address: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export type UpdateRequestInput = z.infer<typeof updateRequestSchema>;
