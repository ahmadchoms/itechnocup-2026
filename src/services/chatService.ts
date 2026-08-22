import { chatRepository, UpsertTransactionData } from "@/repositories/chatRepository";
import type { ChatConversation } from "@/components/features/chat/types";

function serializeConversation(conv: any): ChatConversation {
  return {
    ...conv,
    seller: conv.seller
      ? {
          ...conv.seller,
          latitude: conv.seller.latitude ? Number(conv.seller.latitude) : null,
          longitude: conv.seller.longitude ? Number(conv.seller.longitude) : null,
        }
      : null,
    buyer: conv.buyer
      ? {
          ...conv.buyer,
          latitude: conv.buyer.latitude ? Number(conv.buyer.latitude) : null,
          longitude: conv.buyer.longitude ? Number(conv.buyer.longitude) : null,
        }
      : null,
    match: conv.match
      ? {
          ...conv.match,
          distanceKm: conv.match.distanceKm ? Number(conv.match.distanceKm) : 0.8,
          listing: conv.match.listing
            ? {
                ...conv.match.listing,
                estimatedPrice: conv.match.listing.estimatedPrice
                  ? Number(conv.match.listing.estimatedPrice)
                  : null,
                estimatedWeightKg: conv.match.listing.estimatedWeightKg
                  ? Number(conv.match.listing.estimatedWeightKg)
                  : null,
                cvConfidence: conv.match.listing.cvConfidence
                  ? Number(conv.match.listing.cvConfidence)
                  : null,
                latitude: conv.match.listing.latitude ? Number(conv.match.listing.latitude) : null,
                longitude: conv.match.listing.longitude ? Number(conv.match.listing.longitude) : null,
              }
            : null,
          request: conv.match.request
            ? {
                ...conv.match.request,
                offeredPrice: Number(conv.match.request.offeredPrice),
                latitude: conv.match.request.latitude ? Number(conv.match.request.latitude) : null,
                longitude: conv.match.request.longitude ? Number(conv.match.request.longitude) : null,
              }
            : null,
        }
      : null,
    transactions: (conv.transactions || []).map((t: any) => ({
      ...t,
      finalPrice: Number(t.finalPrice),
    })),
  };
}

export const chatService = {
  async getUserConversations(userId: string, role: "seller" | "buyer" = "seller"): Promise<ChatConversation[]> {
    const rawList = await chatRepository.findUserConversations(userId, role);
    return rawList.map(serializeConversation);
  },

  async getConversationDetail(id: string, userId: string): Promise<ChatConversation | null> {
    const raw = await chatRepository.findConversationById(id, userId);
    if (!raw) return null;
    return serializeConversation(raw);
  },

  async sendMessage(userId: string, conversationId: string, content: string) {
    if (!conversationId || !content?.trim()) {
      throw new Error("Conversation ID dan isi pesan wajib diisi.");
    }

    const conv = await chatRepository.findConversationOwnership(conversationId);
    if (!conv) {
      throw new Error("Percakapan tidak ditemukan.");
    }

    if (conv.sellerId !== userId && conv.buyerId !== userId) {
      throw new Error("Akses ditolak: Anda bukan bagian dari percakapan ini.");
    }

    return chatRepository.createMessage({
      conversationId,
      senderId: userId,
      content: content.trim(),
    });
  },

  async startConversation(
    userId: string,
    sellerId: string,
    buyerId: string,
    initialMessage?: string
  ) {
    if (!sellerId || !buyerId) {
      throw new Error("ID Penjual dan ID Pembeli wajib disertakan.");
    }

    if (userId !== sellerId && userId !== buyerId) {
      throw new Error("Akses ditolak: Anda tidak dapat memulai obrolan untuk pengguna lain.");
    }

    const conversation = await chatRepository.findOrCreateConversation(sellerId, buyerId);

    if (initialMessage && initialMessage.trim()) {
      await chatRepository.createMessage({
        conversationId: conversation.id,
        senderId: userId,
        content: initialMessage.trim(),
      });
    }

    return conversation;
  },

  async updateDealStatus(userId: string, data: UpsertTransactionData) {
    const conv = await chatRepository.findConversationOwnership(data.conversationId);
    if (!conv || (conv.sellerId !== userId && conv.buyerId !== userId)) {
      throw new Error("Akses ditolak: Anda bukan bagian dari percakapan ini.");
    }

    return chatRepository.upsertTransaction(data);
  },
};
