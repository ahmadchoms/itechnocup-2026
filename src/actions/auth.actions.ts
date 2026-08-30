"use server";

import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { loginSchema, registerSchema, LoginInput, RegisterInput } from "@/validations/auth.schema";
import { clearSession, getSessionUser } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { ZodError } from "zod";
import { revalidatePath } from "next/cache";

export async function loginAction(data: LoginInput) {
  try {
    const validated = loginSchema.parse(data);

    // Rate limiting: maksimal 5 percobaan login per email dalam 60 detik
    const rateCheck = checkRateLimit(`login:${validated.email.toLowerCase()}`, 5, 60);
    if (!rateCheck.success) {
      return {
        success: false,
        error: `Terlalu banyak percobaan masuk. Silakan coba lagi dalam ${rateCheck.resetInSeconds} detik.`,
      };
    }

    const user = await authService.login(validated);

    return { success: true, user };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return { success: false, error: error.issues[0]?.message || "Input tidak valid" };
    }

    const message = error instanceof Error ? error.message : "Terjadi kesalahan saat masuk";
    return { success: false, error: message };
  }
}

export async function registerAction(data: RegisterInput) {
  try {
    const validated = registerSchema.parse(data);

    // Rate limiting: maksimal 3 registrasi per 60 detik
    const rateCheck = checkRateLimit(`register:${validated.email.toLowerCase()}`, 3, 60);
    if (!rateCheck.success) {
      return {
        success: false,
        error: `Terlalu banyak percobaan pendaftaran. Silakan coba lagi dalam ${rateCheck.resetInSeconds} detik.`,
      };
    }

    const user = await authService.register(validated);

    return { success: true, user };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return { success: false, error: error.issues[0]?.message || "Input tidak valid" };
    }

    const message = error instanceof Error ? error.message : "Terjadi kesalahan saat mendaftar";
    return { success: false, error: message };
  }
}

export async function logoutAction() {
  try {
    await clearSession();
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal keluar sesi";
    return { success: false, error: message };
  }
}

export async function getAuthUserAction() {
  try {
    const user = await getSessionUser();
    return { success: true, user };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengambil sesi user";
    return { success: false, error: message, user: null };
  }
}

export async function switchRoleAction(newRole: "seller" | "buyer") {
  try {
    const user = await getSessionUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const updatedUser = await userService.switchUserRole(user.id, newRole);
    revalidatePath("/profile");
    return { success: true, user: updatedUser };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengganti role";
    return { success: false, error: message };
  }
}
