"use server";

import { getSessionUser } from "@/lib/session";
import { userService } from "@/services/user.service";
import { buyerApplicationService } from "@/services/buyer-application.service";
import {
  updateProfileSchema,
  buyerApplicationSchema,
  UpdateProfileInput,
  BuyerApplicationInput,
} from "@/validations/user.schema";
import { ZodError } from "zod";
import { revalidatePath } from "next/cache";

export async function updateUserProfileAction(data: UpdateProfileInput) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return { success: false, error: "Sesi telah berakhir. Silakan login kembali." };
    }

    const validated = updateProfileSchema.parse(data);
    const updatedUser = await userService.updateProfile(sessionUser.id, validated);

    revalidatePath("/profile");
    return { success: true, user: updatedUser };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return { success: false, error: error.issues[0]?.message || "Input tidak valid" };
    }

    const message = error instanceof Error ? error.message : "Gagal memperbarui profil";
    return { success: false, error: message };
  }
}

export async function submitBuyerApplicationAction(data: BuyerApplicationInput) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return { success: false, error: "Sesi telah berakhir. Silakan login kembali." };
    }

    const validated = buyerApplicationSchema.parse(data);
    const application = await buyerApplicationService.submitApplication(sessionUser.id, validated);

    revalidatePath("/profile");
    return { success: true, application };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return { success: false, error: error.issues[0]?.message || "Input tidak valid" };
    }

    const message = error instanceof Error ? error.message : "Gagal mengajukan permohonan";
    return { success: false, error: message };
  }
}
