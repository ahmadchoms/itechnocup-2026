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
  sellerId: string;
  buyerId: string;
  categoryId?: string;
  finalPrice: number;
  finalQuantity: number;
  unit?: string;
  status: string;
}

export const chatRepository = {
  async findUserConversations(userId: string, role: "seller" | "buyer" = "seller") {
    const whereClause = role === "seller" ? { sellerId: userId } : { buyerId: userId };

    return prisma.conversation.findMany({
      where: whereClause,
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
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

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
        },
      },
    });
  },

  async findConversationOwnership(conversationId: string) {
    return prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        sellerId: true,
        buyerId: true,
      },
    });
  },

  async createMessage(data: CreateMessageData) {
    return prisma.message.create({
      data: {
        conversationId: data.conversationId,
        senderId: data.senderId,
        content: data.content,
      },
    });
  },

  async findOrCreateConversation(sellerId: string, buyerId: string) {
    let conversation = await prisma.conversation.findFirst({
      where: {
        sellerId,
        buyerId,
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          sellerId,
          buyerId,
        },
      });
    }

    return conversation;
  },

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
      transaction = await prisma.transaction.create({
        data: {
          conversationId: data.conversationId,
          listingId: data.listingId,
          sellerId: data.sellerId,
          buyerId: data.buyerId,
          categoryId: data.categoryId,
          finalPrice: data.finalPrice,
          finalQuantity: data.finalQuantity,
          unit: data.unit || "kg",
          status: data.status,
          completedAt: data.status === "selesai" ? new Date() : null,
        },
      });
    }

    // Synchronize listing status if applicable
    if (transaction.listingId) {
      if (data.status === "selesai") {
        await prisma.listing.update({
          where: { id: transaction.listingId },
          data: { status: "terjual" },
        });
      } else if (data.status === "dibatalkan") {
        await prisma.listing.update({
          where: { id: transaction.listingId },
          data: { status: "aktif" },
        });
      }
    }

    return transaction;
  },
};
