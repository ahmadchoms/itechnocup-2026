"use server";

import { chatService } from "@/services/chat.service";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { sendMessageSchema, SendMessageInput, startChatSchema, StartChatInput } from "@/validations/chat.schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";

export async function sendMessageAction(input: SendMessageInput) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return { success: false, error: "Unauthorized" };
    }

    // Rate limiting: maksimal 10 pesan per 10 detik per user
    const rateCheck = checkRateLimit(`chat:${sessionUser.id}`, 10, 10);
    if (!rateCheck.success) {
      return {
        success: false,
        error: `Anda mengirim pesan terlalu cepat. Tunggu ${rateCheck.resetInSeconds} detik.`,
      };
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

    // Tentukan sellerId & buyerId berdasarkan konteks listing/request dan session
    if (!sellerId && sessionUser.id !== buyerId) {
      sellerId = sessionUser.id;
    }
    if (!buyerId && sessionUser.id !== sellerId) {
      buyerId = sessionUser.id;
    }

    if (!sellerId || !buyerId) {
      return {
        success: false,
        error: "Data penjual atau pembeli tidak valid untuk memulai percakapan.",
      };
    }

    if (sellerId === buyerId) {
      return {
        success: false,
        error: "Anda tidak dapat memulai transaksi atau percakapan dengan akun Anda sendiri.",
      };
    }

    const defaultMsg = `Halo, saya berminat dengan item ${itemTitle}. Mari kita diskusikan kesepakatan harga dan penjemputan.`;
    const messageToSend = validated.initialMessage || defaultMsg;

    const conversation = await chatService.startConversation(
      sessionUser.id,
      sellerId,
      buyerId,
      messageToSend,
      validated.matchId,
      validated.listingId,
      validated.requestId
    );

    if (validated.listingId) {
      const activeTx = await prisma.transaction.findFirst({
        where: {
          conversationId: conversation.id,
          status: { notIn: ["selesai", "dibatalkan"] }
        }
      });
      
      if (!activeTx) {
        const l = await prisma.listing.findUnique({ where: { id: validated.listingId } });
        if (l) {
          const qty = Number(l.quantity) || Number(l.estimatedWeightKg) || 1;
          let finalPrice = Number(l.estimatedPrice || 0) * qty;
          if (validated.requestId) {
            const r = await prisma.wasteRequest.findUnique({ where: { id: validated.requestId } });
            if (r && r.offeredPrice) finalPrice = Number(r.offeredPrice) * qty;
          }
          await prisma.transaction.create({
            data: {
              conversationId: conversation.id,
              listingId: l.id,
              sellerId: sellerId,
              buyerId: buyerId,
              categoryId: l.categoryId,
              finalPrice: finalPrice,
              finalQuantity: Number(l.quantity) || Number(l.estimatedWeightKg) || 1,
              unit: l.unit || "kg",
              status: sessionUser.id === sellerId ? "menunggu_persetujuan_pembeli" : "menunggu_persetujuan_penjual"
            }
          });
        }
      }
    }

    revalidatePath(`/chat/${conversation.id}`);
    revalidatePath("/chat");
    return { success: true, conversationId: conversation.id };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memulai percakapan";
    return { success: false, error: message };
  }
}

export async function getUserConversationsAction() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return { success: false, error: "Unauthorized", conversations: [] };
    }

    const conversations = await chatService.getUserConversations(sessionUser.id);
    return { success: true, conversations };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengambil percakapan";
    return { success: false, error: message, conversations: [] };
  }
}

export async function getConversationDetailAction(conversationId: string) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return { success: false, error: "Unauthorized", conversation: null };
    }

    const conversation = await chatService.getConversationDetail(conversationId, sessionUser.id);
    return { success: true, conversation };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengambil detail percakapan";
    return { success: false, error: message, conversation: null };
  }
}
