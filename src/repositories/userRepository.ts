import { prisma } from "@/lib/prisma";

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findProfileByEmail(email: string) {
    let user = await prisma.user.findFirst({
      where: { email },
      include: {
        listings: {
          include: { category: true },
          orderBy: { createdAt: "desc" },
        },
        sellerTransactions: {
          include: {
            category: true,
            buyer: true,
            listing: true,
          },
          orderBy: { createdAt: "desc" },
        },
        buyerTransactions: {
          include: {
            category: true,
            seller: true,
            listing: true,
          },
          orderBy: { createdAt: "desc" },
        },
        receivedReviews: {
          include: {
            reviewer: true,
          },
          orderBy: { createdAt: "desc" },
        },
        buyerApplication: true,
      },
    });

    if (!user) {
      user = await prisma.user.findFirst({
        include: {
          listings: {
            include: { category: true },
            orderBy: { createdAt: "desc" },
          },
          sellerTransactions: {
            include: {
              category: true,
              buyer: true,
              listing: true,
            },
            orderBy: { createdAt: "desc" },
          },
          buyerTransactions: {
            include: {
              category: true,
              seller: true,
              listing: true,
            },
            orderBy: { createdAt: "desc" },
          },
          receivedReviews: {
            include: {
              reviewer: true,
            },
            orderBy: { createdAt: "desc" },
          },
          buyerApplication: true,
        },
      });
    }

    return user;
  }

  async updateUser(id: string, data: Record<string, any>) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}

export const userRepository = new UserRepository();
