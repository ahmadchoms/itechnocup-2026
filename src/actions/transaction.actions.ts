"use server";

import { chatService } from "@/services/chat.service";
import { getSessionUser } from "@/lib/session";
import {
  updateTransactionStatusSchema,
  UpdateTransactionStatusInput,
} from "@/validations/transaction.schema";
import { revalidatePath } from "next/cache";

export async function updateTransactionStatusAction(input: UpdateTransactionStatusInput) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = updateTransactionStatusSchema.parse(input);
    const rawTx = await chatService.updateDealStatus(sessionUser.id, {
      transactionId: validated.transactionId || undefined,
      conversationId: validated.conversationId,
      listingId: validated.listingId || undefined,
      sellerId: validated.sellerId || undefined,
      buyerId: validated.buyerId || undefined,
      categoryId: validated.categoryId || undefined,
      finalPrice: validated.finalPrice,
      finalQuantity: validated.finalQuantity,
      unit: validated.unit,
      status: validated.status,
    });

    // Serialize Prisma Decimal and Date objects into plain JSON primitives
    const transaction = {
      id: rawTx.id,
      conversationId: rawTx.conversationId,
      listingId: rawTx.listingId,
      sellerId: rawTx.sellerId,
      buyerId: rawTx.buyerId,
      categoryId: rawTx.categoryId,
      finalPrice: Number(rawTx.finalPrice),
      finalQuantity: Number(rawTx.finalQuantity || 0),
      unit: rawTx.unit,
      status: rawTx.status,
      createdAt: rawTx.createdAt ? rawTx.createdAt.toISOString() : null,
      completedAt: rawTx.completedAt ? rawTx.completedAt.toISOString() : null,
      listing: 'listing' in rawTx && rawTx.listing ? {
        ...rawTx.listing,
        estimatedPrice: rawTx.listing.estimatedPrice ? Number(rawTx.listing.estimatedPrice) : null,
        estimatedWeightKg: rawTx.listing.estimatedWeightKg ? Number(rawTx.listing.estimatedWeightKg) : null,
        quantity: rawTx.listing.quantity ? Number(rawTx.listing.quantity) : null,
        longitude: rawTx.listing.longitude ? Number(rawTx.listing.longitude) : null,
        latitude: rawTx.listing.latitude ? Number(rawTx.listing.latitude) : null,
        cvConfidence: rawTx.listing.cvConfidence ? Number(rawTx.listing.cvConfidence) : null,
        createdAt: rawTx.listing.createdAt ? rawTx.listing.createdAt.toISOString() : null,
        updatedAt: rawTx.listing.updatedAt ? rawTx.listing.updatedAt.toISOString() : null,
      } : null,
    };

    revalidatePath(`/chat/${validated.conversationId}`);
    revalidatePath("/chat");
    revalidatePath("/profile");
    revalidatePath("/profile/transactions");
    revalidatePath("/requests");
    revalidatePath("/listings");
    revalidatePath("/");
    return { success: true, transaction };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui status transaksi";
    return { success: false, error: message };
  }
}
