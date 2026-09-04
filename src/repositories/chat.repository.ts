import { prisma } from "@/lib/prisma";

export interface CreateMessageData {
  conversationId: string;
  senderId: string;
  content: string;
}

export interface UpsertTransactionData {
  transactionId?: string;
  conversationId: string;
  listingId?: string;
  sellerId?: string;
  buyerId?: string;
  categoryId?: string;
  finalPrice: number;
  finalQuantity: number;
  unit?: string;
  status: string;
}

export class ChatRepository {
  async findUserConversations(userId: string) {
    return prisma.conversation.findMany({
      where: {
        OR: [{ sellerId: userId }, { buyerId: userId }],
      },
      include: {
        seller: true,
        buyer: true,
        match: {
          include: {
            listing: {
              include: { category: true },
            },
            request: {
              include: { category: true },
            },
          },
        },
        messages: {
          orderBy: { sentAt: "asc" },
        },
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            reviews: {
              select: {
                id: true,
                reviewerId: true,
                rating: true,
                comment: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findConversationById(id: string, userId: string) {
    return prisma.conversation.findFirst({
      where: {
        id,
        OR: [{ sellerId: userId }, { buyerId: userId }],
      },
      include: {
        seller: true,
        buyer: true,
        match: {
          include: {
            listing: {
              include: { category: true },
            },
            request: {
              include: { category: true },
            },
          },
        },
        messages: {
          orderBy: { sentAt: "asc" },
        },
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            reviews: {
              select: {
                id: true,
                reviewerId: true,
                rating: true,
                comment: true,
              },
            },
          },
        },
      },
    });
  }

  async findConversationOwnership(conversationId: string) {
    return prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        sellerId: true,
        buyerId: true,
      },
    });
  }

  async createMessage(data: CreateMessageData) {
    return prisma.message.create({
      data: {
        conversationId: data.conversationId,
        senderId: data.senderId,
        content: data.content,
      },
    });
  }

  async findOrCreateConversation(sellerId: string, buyerId: string, matchId?: string | null) {
    let conversation = await prisma.conversation.findFirst({
      where: {
        sellerId,
        buyerId,
        matchId: matchId || null,
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          sellerId,
          buyerId,
          matchId: matchId || null,
        },
      });
    }

    return conversation;
  }

  async upsertTransaction(data: UpsertTransactionData) {
    let transaction;

    if (data.transactionId) {
      transaction = await prisma.transaction.update({
        where: { id: data.transactionId },
        data: {
          status: data.status,
          completedAt: data.status === "selesai" ? new Date() : undefined,
          finalPrice: data.finalPrice,
          finalQuantity: data.finalQuantity,
        },
      });
    } else {
      let sellerId: string | undefined = data.sellerId;
      let buyerId: string | undefined = data.buyerId;
      let listingId: string | null | undefined = data.listingId;
      let categoryId: string | null | undefined = data.categoryId;

      if (!sellerId || !buyerId || !listingId || !categoryId) {
        const conv = await prisma.conversation.findUnique({
          where: { id: data.conversationId },
          include: {
            match: {
              include: {
                listing: true,
                request: true,
              },
            },
          },
        });
        if (conv) {
          sellerId = sellerId || conv.sellerId;
          buyerId = buyerId || conv.buyerId;
          listingId = listingId || conv.match?.listingId || conv.match?.listing?.id || null;
          categoryId = categoryId || conv.match?.listing?.categoryId || conv.match?.request?.categoryId || null;
        }
      }

      transaction = await prisma.transaction.create({
        data: {
          conversationId: data.conversationId,
          listingId: listingId || null,
          sellerId: sellerId!,
          buyerId: buyerId!,
          categoryId: categoryId || null,
          finalPrice: data.finalPrice,
          finalQuantity: data.finalQuantity,
          unit: data.unit || "kg",
          status: data.status,
          completedAt: data.status === "selesai" ? new Date() : null,
        },
      });
    }

    // Synchronize listing and request status/stock reduction upon transaction completion
    if (data.status === "selesai") {
      const soldQty = Number(data.finalQuantity || 0);

      // 1. Reduce seller's listing stock & update status if exhausted
      if (transaction.listingId) {
        const listing = await prisma.listing.findUnique({
          where: { id: transaction.listingId },
        });
        if (listing) {
          const currentWeight = Number(listing.estimatedWeightKg || listing.quantity || 0);
          const remainingWeight = Math.max(0, currentWeight - soldQty);

          await prisma.listing.update({
            where: { id: listing.id },
            data: {
              estimatedWeightKg: remainingWeight,
              quantity: Math.floor(remainingWeight),
              status: remainingWeight <= 0 ? "terjual" : "aktif",
            },
          });
        }
      }

      // 2. Reduce buyer's waste request demand & update status if fulfilled
      if (transaction.conversationId) {
        const conv = await prisma.conversation.findUnique({
          where: { id: transaction.conversationId },
          include: {
            match: {
              include: {
                request: true,
              },
            },
          },
        });

        const request = conv?.match?.request;
        if (request) {
          const currentWanted = Number(request.quantityWanted || 0);
          const remainingWanted = Math.max(0, currentWanted - soldQty);

          await prisma.wasteRequest.update({
            where: { id: request.id },
            data: {
              quantityWanted: Math.floor(remainingWanted),
              status: remainingWanted <= 0 ? "terpenuhi" : "aktif",
            },
          });
        }
      }
    } else if (data.status === "dibatalkan" && transaction.listingId) {
      // Revert listing to active if cancelled
      const listing = await prisma.listing.findUnique({
        where: { id: transaction.listingId },
      });
      if (listing && listing.status === "terjual") {
        await prisma.listing.update({
          where: { id: transaction.listingId },
          data: { status: "aktif" },
        });
      }
    }

    return transaction;
  }
}

export const chatRepository = new ChatRepository();
