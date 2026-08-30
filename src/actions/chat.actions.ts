"use server";

import { chatService } from "@/services/chat.service";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { sendMessageSchema, SendMessageInput, startChatSchema, StartChatInput } from "@/validations/chat.schema";
import { revalidatePath } from "next/cache";

export async function sendMessageAction(input: SendMessageInput) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = sendMessageSchema.parse(input);
    const message = await chatService.sendMessage(
      sessionUser.id,
      validated.conversationId,
      validated.content
    );

    revalidatePath(`/chat/${validated.conversationId}`);
    revalidatePath("/chat");
    return { success: true, message };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengirim pesan";
    return { success: false, error: message };
  }
}

export async function startChatAction(input: StartChatInput) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = startChatSchema.parse(input);

    let sellerId = validated.sellerId;
    let buyerId = validated.buyerId;
    let itemTitle = "Sampah/Limbah";

    if (validated.listingId) {
      const l = await prisma.listing.findUnique({ where: { id: validated.listingId } });
      if (l) {
        sellerId = l.sellerId;
        itemTitle = l.title;
      }
    }

    if (validated.requestId) {
      const r = await prisma.wasteRequest.findUnique({ where: { id: validated.requestId } });
      if (r) {
        buyerId = r.buyerId;
        itemTitle = r.title;
      }
    }

    if (!buyerId) {
      buyerId = sessionUser.id;
    }
    if (!sellerId) {
      sellerId = sessionUser.id;
    }

    if (!sellerId) {
      const defaultSeller = await prisma.user.findFirst({ where: { email: "ahmad@daurnusa.id" } });
      sellerId = defaultSeller?.id || (await prisma.user.findFirst())?.id;
    }
    if (!buyerId) {
      const defaultBuyer = await prisma.user.findFirst({ where: { email: "paktani.ungaran@gmail.com" } });
      buyerId = defaultBuyer?.id || (await prisma.user.findFirst())?.id;
    }

    if (!sellerId || !buyerId) {
      return { success: false, error: "Data penjual atau pembeli tidak ditemukan" };
    }

    const defaultMsg = `Halo, saya berminat dengan item ${itemTitle}. Mari kita diskusikan kesepakatan harga dan penjemputan.`;
    const messageToSend = validated.initialMessage || defaultMsg;

    const conversation = await chatService.startConversation(
      sessionUser.id,
      sellerId,
      buyerId,
      messageToSend,
      validated.matchId
    );

    revalidatePath(`/chat/${conversation.id}`);
    revalidatePath("/chat");
    return { success: true, conversationId: conversation.id };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memulai percakapan";
    return { success: false, error: message };
  }
}
