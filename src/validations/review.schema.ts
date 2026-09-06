import { z } from "zod";

export const createReviewSchema = z.object({
  transactionId: z.string().min(1, "ID transaksi wajib diisi"),
  reviewerId: z.string().min(1, "ID reviewer wajib diisi"),
  revieweeId: z.string().min(1, "ID penerima ulasan wajib diisi"),
  rating: z.coerce.number().min(1, "Rating minimal 1").max(5, "Rating maksimal 5"),
  comment: z.string().optional().nullable(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
