import { chatRepository, ChatRepository, UpsertTransactionData } from "@/repositories/chat.repository";
import type { ChatConversation } from "@/types";

type RawConversation = NonNullable<Awaited<ReturnType<typeof chatRepository.findConversationById>>>;

function serializeConversation(conv: RawConversation): ChatConversation {
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
    listing: (conv as any).listing
      ? {
          ...(conv as any).listing,
          estimatedPrice: (conv as any).listing.estimatedPrice
            ? Number((conv as any).listing.estimatedPrice)
            : null,
          estimatedWeightKg: (conv as any).listing.estimatedWeightKg
            ? Number((conv as any).listing.estimatedWeightKg)
            : null,
          cvConfidence: (conv as any).listing.cvConfidence
            ? Number((conv as any).listing.cvConfidence)
            : null,
          latitude: (conv as any).listing.latitude ? Number((conv as any).listing.latitude) : null,
          longitude: (conv as any).listing.longitude ? Number((conv as any).listing.longitude) : null,
        }
      : null,
    request: (conv as any).request
      ? {
          ...(conv as any).request,
          offeredPrice: Number((conv as any).request.offeredPrice),
          latitude: (conv as any).request.latitude ? Number((conv as any).request.latitude) : null,
          longitude: (conv as any).request.longitude ? Number((conv as any).request.longitude) : null,
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
      finalQuantity: Number(t.finalQuantity || 0),
      reviews: (t.reviews || []).map((r: any) => ({
        id: r.id,
        reviewerId: r.reviewerId,
        rating: r.rating,
        comment: r.comment,
      })),
      listing: t.listing
        ? {
            ...t.listing,
            estimatedPrice: t.listing.estimatedPrice ? Number(t.listing.estimatedPrice) : null,
            estimatedWeightKg: t.listing.estimatedWeightKg ? Number(t.listing.estimatedWeightKg) : null,
            cvConfidence: t.listing.cvConfidence ? Number(t.listing.cvConfidence) : null,
            latitude: t.listing.latitude ? Number(t.listing.latitude) : null,
            longitude: t.listing.longitude ? Number(t.listing.longitude) : null,
          }
        : null,
    })),
  };
}

export class ChatService {
  constructor(private repo: ChatRepository = chatRepository) {}

  async getUserConversations(userId: string): Promise<ChatConversation[]> {
    const rawList = await this.repo.findUserConversations(userId);
    const serialized = rawList.map(serializeConversation);

    // Urutkan berdasarkan aktivitas terbaru (pesan terbaru, transaksi terbaru, atau waktu dibuat)
    serialized.sort((a, b) => {
      const aLastMessage = a.messages && a.messages.length > 0 ? a.messages[a.messages.length - 1].sentAt : null;
      const aLastTx = a.transactions && a.transactions.length > 0 ? a.transactions[0].createdAt : null; // transactions are already sorted desc from DB
      const aTime = Math.max(
        aLastMessage ? new Date(aLastMessage).getTime() : 0,
        aLastTx ? new Date(aLastTx).getTime() : 0,
        new Date(a.createdAt).getTime()
      );

      const bLastMessage = b.messages && b.messages.length > 0 ? b.messages[b.messages.length - 1].sentAt : null;
      const bLastTx = b.transactions && b.transactions.length > 0 ? b.transactions[0].createdAt : null;
      const bTime = Math.max(
        bLastMessage ? new Date(bLastMessage).getTime() : 0,
        bLastTx ? new Date(bLastTx).getTime() : 0,
        new Date(b.createdAt).getTime()
      );

      return bTime - aTime;
    });

    return serialized;
  }

  async getConversationDetail(id: string, userId: string): Promise<ChatConversation | null> {
    const raw = await this.repo.findConversationById(id, userId);
    if (!raw) return null;
    return serializeConversation(raw);
  }

  async sendMessage(userId: string, conversationId: string, content: string) {
    if (!conversationId || !content?.trim()) {
      throw new Error("Conversation ID dan isi pesan wajib diisi.");
    }

    const conv = await this.repo.findConversationOwnership(conversationId);
    if (!conv) {
      throw new Error("Percakapan tidak ditemukan.");
    }

    if (conv.sellerId !== userId && conv.buyerId !== userId) {
      throw new Error("Akses ditolak: Anda bukan bagian dari percakapan ini.");
    }

    return this.repo.createMessage({
      conversationId,
      senderId: userId,
      content: content.trim(),
    });
  }

  async startConversation(
    userId: string,
    sellerId: string,
    buyerId: string,
    initialMessage?: string | null,
    matchId?: string | null,
    listingId?: string | null,
    requestId?: string | null
  ) {
    if (!sellerId || !buyerId) {
      throw new Error("ID Penjual dan ID Pembeli wajib disertakan.");
    }

    if (userId !== sellerId && userId !== buyerId) {
      throw new Error("Akses ditolak: Anda tidak dapat memulai obrolan untuk pengguna lain.");
    }

    const conversation = await this.repo.findOrCreateConversation(sellerId, buyerId, matchId, listingId, requestId);

    if (initialMessage && initialMessage.trim()) {
      await this.repo.createMessage({
        conversationId: conversation.id,
        senderId: userId,
        content: initialMessage.trim(),
      });
    }

    return conversation;
  }

  async updateDealStatus(userId: string, data: UpsertTransactionData) {
    const conv = await this.repo.findConversationOwnership(data.conversationId);
    if (!conv || (conv.sellerId !== userId && conv.buyerId !== userId)) {
      throw new Error("Akses ditolak: Anda bukan bagian dari percakapan ini.");
    }

    return this.repo.upsertTransaction(data);
  }
}

export const chatService = new ChatService();
