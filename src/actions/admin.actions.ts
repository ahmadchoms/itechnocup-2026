"use server";

import { adminService } from "@/services/admin.service";
import { buyerApplicationService } from "@/services/buyer-application.service";
import { getSessionUser } from "@/lib/session";
import { UpdateUserDTO } from "@/types";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.isAdmin) {
    throw new Error("Akses ditolak. Anda bukan administrator.");
  }
  return sessionUser;
}

export async function toggleUserAdminAction(userId: string, isAdmin: boolean) {
  try {
    await requireAdmin();
    const updatedUser = await adminService.toggleUserAdmin(userId, isAdmin);
    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { success: true, user: updatedUser };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengubah role admin";
    return { success: false, error: message };
  }
}

export async function updateAdminUserAction(userId: string, data: UpdateUserDTO) {
  try {
    await requireAdmin();
    const updatedUser = await adminService.updateUser(userId, data);
    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { success: true, user: updatedUser };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui pengguna";
    return { success: false, error: message };
  }
}

export async function deleteAdminUserAction(userId: string) {
  try {
    await requireAdmin();
    await adminService.deleteUser(userId);
    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menghapus pengguna";
    return { success: false, error: message };
  }
}

export async function moderateListingAction(listingId: string, status: "aktif" | "dihapus") {
  try {
    await requireAdmin();
    await adminService.moderateListing(listingId, status);
    revalidatePath("/admin/listings");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memoderasi listing";
    return { success: false, error: message };
  }
}

export async function moderateRequestAction(requestId: string, status: "aktif" | "dibatalkan") {
  try {
    await requireAdmin();
    await adminService.moderateRequest(requestId, status);
    revalidatePath("/admin/requests");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memoderasi permintaan";
    return { success: false, error: message };
  }
}

export async function approveBuyerAppAction(applicationId: string) {
  try {
    await requireAdmin();
    const application = await buyerApplicationService.approveApplication(applicationId);
    revalidatePath("/admin/buyer-applications");
    revalidatePath("/admin");
    return { success: true, application };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menyetujui pengajuan";
    return { success: false, error: message };
  }
}

export async function rejectBuyerAppAction(applicationId: string) {
  try {
    await requireAdmin();
    const application = await buyerApplicationService.rejectApplication(applicationId);
    revalidatePath("/admin/buyer-applications");
    revalidatePath("/admin");
    return { success: true, application };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menolak pengajuan";
    return { success: false, error: message };
  }
}
