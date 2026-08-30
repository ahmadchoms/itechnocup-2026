import { z } from "zod";

export const updateTransactionStatusSchema = z.object({
  transactionId: z.string().optional().nullable(),
  conversationId: z.string().min(1, "ID percakapan wajib diisi"),
  listingId: z.string().optional().nullable(),
  sellerId: z.string().optional().nullable(),
  buyerId: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  finalPrice: z.coerce.number().min(0, "Harga minimal Rp 0"),
  finalQuantity: z.coerce.number().min(0, "Jumlah minimal 0"),
  unit: z.string().optional().default("kg"),
  status: z.enum(["menunggu_konfirmasi", "selesai", "dibatalkan"]),
});

export type UpdateTransactionStatusInput = z.infer<typeof updateTransactionStatusSchema>;
