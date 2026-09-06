import { z } from "zod";

export const sendMessageSchema = z.object({
  conversationId: z.string().min(1, "ID percakapan wajib diisi"),
  content: z.string().min(1, "Isi pesan tidak boleh kosong"),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;

export const startChatSchema = z.object({
  sellerId: z.string().optional().nullable(),
  buyerId: z.string().optional().nullable(),
  listingId: z.string().optional().nullable(),
  requestId: z.string().optional().nullable(),
  matchId: z.string().optional().nullable(),
  initialMessage: z.string().optional().nullable(),
});

export type StartChatInput = z.infer<typeof startChatSchema>;
