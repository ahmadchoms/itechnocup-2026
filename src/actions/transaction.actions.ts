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
    const transaction = await chatService.updateDealStatus(sessionUser.id, {
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

    revalidatePath(`/chat/${validated.conversationId}`);
    revalidatePath("/chat");
    revalidatePath("/profile");
    return { success: true, transaction };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui status transaksi";
    return { success: false, error: message };
  }
}
