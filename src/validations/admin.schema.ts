import { z } from "zod";

export const adminUpdateUserSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap minimal 2 karakter").optional(),
  email: z.string().email("Format email tidak valid").optional(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  isAdmin: z.boolean().optional(),
  isBuyerApproved: z.boolean().optional(),
  activeRole: z.enum(["seller", "buyer"]).optional(),
});

export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;
