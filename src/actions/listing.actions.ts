"use server";

import { listingService } from "@/services/listing.service";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  createListingSchema,
  CreateListingInput,
  updateListingSchema,
  UpdateListingInput,
} from "@/validations/listing.schema";
import { revalidatePath } from "next/cache";

export async function createListingAction(input: CreateListingInput) {
  try {
    const validated = createListingSchema.parse(input);
    const sessionUser = await getSessionUser();

    let sellerId = validated.sellerId;
    if (!sellerId) {
      if (sessionUser) {
        sellerId = sessionUser.id;
      } else {
        const defaultUser = await prisma.user.findFirst();
        if (!defaultUser) {
          return { success: false, error: "User tidak ditemukan" };
        }
        sellerId = defaultUser.id;
      }
    }

    const listing = await listingService.createListing(sellerId, validated);
    revalidatePath("/profile");
    revalidatePath("/listings");
    revalidatePath("/");
    return { success: true, listing };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal membuat listing";
    return { success: false, error: message };
  }
}

export async function updateListingAction(id: string, input: UpdateListingInput) {
  try {
    const validated = updateListingSchema.parse(input);
    const listing = await listingService.updateListing(id, validated);
    revalidatePath("/profile");
    revalidatePath("/listings");
    revalidatePath("/");
    return { success: true, listing };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui listing";
    return { success: false, error: message };
  }
}

export async function deleteListingAction(id: string) {
  try {
    await listingService.deleteListing(id);
    revalidatePath("/profile");
    revalidatePath("/listings");
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menghapus listing";
    return { success: false, error: message };
  }
}

export async function getListingsAction(filters?: { categoryId?: string; search?: string }) {
  try {
    const listings = await listingService.getListings(filters);
    return { success: true, listings };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengambil daftar listing";
    return { success: false, error: message };
  }
}
