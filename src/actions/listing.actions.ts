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
import { checkRateLimit } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";

export async function createListingAction(input: CreateListingInput) {
  try {
    const validated = createListingSchema.parse(input);
    const sessionUser = await getSessionUser();

    // Rate limiting: maksimal 10 posting listing per 60 detik
    const userIdForRate = sessionUser?.id || validated.sellerId || "anonymous";
    const rateCheck = checkRateLimit(`listing:${userIdForRate}`, 10, 60);
    if (!rateCheck.success) {
      return {
        success: false,
        error: `Terlalu banyak membuat listing. Tunggu ${rateCheck.resetInSeconds} detik.`,
      };
    }

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

export async function toggleListingStatusAction(id: string, newStatus: "aktif" | "terjual") {
  try {
    const listing = await prisma.listing.update({
      where: { id },
      data: { status: newStatus },
      include: { category: true, seller: true },
    });
    revalidatePath("/profile");
    revalidatePath("/listings");
    revalidatePath("/");
    return { success: true, listing };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengubah status listing";
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

export async function getActiveListingsAction() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return { success: false, error: "Unauthorized", listings: [] };
    }
    
    const listings = await prisma.listing.findMany({
      where: {
        sellerId: sessionUser.id,
        status: "aktif",
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const mappedListings = listings.map(l => ({
      ...l,
      estimatedPrice: l.estimatedPrice ? Number(l.estimatedPrice) : null,
      estimatedWeightKg: l.estimatedWeightKg ? Number(l.estimatedWeightKg) : null,
      latitude: l.latitude ? Number(l.latitude) : null,
      longitude: l.longitude ? Number(l.longitude) : null,
      cvConfidence: l.cvConfidence ? Number(l.cvConfidence) : null,
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
      category: l.category ? {
        ...l.category,
        createdAt: l.category.createdAt.toISOString(),
        updatedAt: (l.category as any).updatedAt ? (l.category as any).updatedAt.toISOString() : undefined,
      } : null
    }));

    return { success: true, listings: mappedListings };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengambil daftar listing aktif";
    return { success: false, error: message, listings: [] };
  }
}
