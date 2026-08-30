"use server";

import { requestService } from "@/services/request.service";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  createRequestSchema,
  CreateRequestInput,
  updateRequestSchema,
  UpdateRequestInput,
} from "@/validations/request.schema";
import { revalidatePath } from "next/cache";

export async function createRequestAction(input: CreateRequestInput) {
  try {
    const validated = createRequestSchema.parse(input);
    const sessionUser = await getSessionUser();

    let buyerId = validated.buyerId;
    if (!buyerId) {
      if (sessionUser) {
        buyerId = sessionUser.id;
      } else {
        const defaultBuyer = await prisma.user.findFirst({
          where: { fullName: { contains: "Pak Tani" } },
        });
        buyerId = defaultBuyer ? defaultBuyer.id : (await prisma.user.findFirst())?.id;
      }
    }

    if (!buyerId) {
      return { success: false, error: "User pengepul tidak ditemukan" };
    }

    const wasteRequest = await requestService.createRequest(buyerId, validated);
    revalidatePath("/requests");
    revalidatePath("/profile");
    revalidatePath("/");
    return { success: true, wasteRequest };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal membuat permintaan";
    return { success: false, error: message };
  }
}

export async function updateRequestAction(id: string, input: UpdateRequestInput) {
  try {
    const validated = updateRequestSchema.parse(input);
    const wasteRequest = await requestService.updateRequest(id, validated);
    revalidatePath("/requests");
    revalidatePath(`/requests/${id}`);
    revalidatePath("/profile");
    return { success: true, wasteRequest };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui permintaan";
    return { success: false, error: message };
  }
}

export async function deleteRequestAction(id: string) {
  try {
    await requestService.deleteRequest(id);
    revalidatePath("/requests");
    revalidatePath("/profile");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menghapus permintaan";
    return { success: false, error: message };
  }
}

export async function getRequestsAction(filters?: { categoryId?: string; search?: string }) {
  try {
    const requests = await requestService.getRequests(filters);
    return { success: true, requests };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengambil daftar permintaan";
    return { success: false, error: message };
  }
}
