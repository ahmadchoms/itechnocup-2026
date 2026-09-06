import { z } from "zod";

export const classifyWasteSchema = z.object({
  photoUrl: z.string().min(1, "URL foto wajib diisi"),
});

export type ClassifyWasteInput = z.infer<typeof classifyWasteSchema>;
