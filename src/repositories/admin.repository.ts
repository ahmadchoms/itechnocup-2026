import { prisma } from "@/lib/prisma";
import { UpdateUserDTO } from "@/types";

export class AdminRepository {
  async getDashboardRawData() {
    return Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          isBuyerApproved: true,
          activeRole: true,
        },
      }),
      prisma.listing.findMany({
        include: {
          category: true,
          seller: { select: { fullName: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.wasteRequest.findMany({
        select: {
          id: true,
          status: true,
        },
      }),
      prisma.transaction.findMany({
        include: {
          seller: { select: { fullName: true } },
          buyer: { select: { fullName: true } },
          listing: { select: { title: true } },
          category: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.wasteCategory.findMany({
        include: {
          listings: {
            select: { estimatedWeightKg: true },
          },
          wasteRequests: {
            select: { id: true },
          },
        },
      }),
      prisma.buyerApplication.findMany({
        where: { status: "menunggu" },
        include: {
          user: {
            select: { fullName: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
    ]);
  }

  async findManyListingsWithRelations() {
    return prisma.listing.findMany({
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findManyRequestsWithRelations() {
    return prisma.wasteRequest.findMany({
      include: {
        buyer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findManyUsersWithActivity() {
    return prisma.user.findMany({
      include: {
        _count: {
          select: {
            listings: true,
            wasteRequests: true,
            sellerTransactions: true,
            buyerTransactions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findManyCategories() {
    return prisma.wasteCategory.findMany({
      select: { id: true, name: true, description: true },
      orderBy: { name: "asc" },
    });
  }

  async updateListingStatus(id: string, status: string) {
    return prisma.listing.update({
      where: { id },
      data: { status },
    });
  }

  async updateRequestStatus(id: string, status: string) {
    return prisma.wasteRequest.update({
      where: { id },
      data: { status },
    });
  }

  async updateUser(id: string, data: UpdateUserDTO) {
    return prisma.user.update({
      where: { id },
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone ?? null,
        address: data.address ?? null,
        isAdmin: typeof data.isAdmin === "boolean" ? data.isAdmin : undefined,
        isBuyerApproved: typeof data.isBuyerApproved === "boolean" ? data.isBuyerApproved : undefined,
      },
    });
  }

  async toggleUserAdmin(id: string, isAdmin: boolean) {
    return prisma.user.update({
      where: { id },
      data: { isAdmin },
    });
  }

  async deleteUserCascade(id: string) {
    return prisma.$transaction(async (tx) => {
      await tx.review.deleteMany({
        where: { OR: [{ reviewerId: id }, { revieweeId: id }] },
      });

      await tx.transaction.deleteMany({
        where: { OR: [{ sellerId: id }, { buyerId: id }] },
      });

      await tx.message.deleteMany({
        where: {
          OR: [
            { senderId: id },
            { conversation: { OR: [{ sellerId: id }, { buyerId: id }] } },
          ],
        },
      });

      await tx.conversation.deleteMany({
        where: { OR: [{ sellerId: id }, { buyerId: id }] },
      });

      await tx.match.deleteMany({
        where: {
          OR: [
            { listing: { sellerId: id } },
            { request: { buyerId: id } },
          ],
        },
      });

      await tx.cVClassificationLog.deleteMany({
        where: { listing: { sellerId: id } },
      });

      await tx.listing.deleteMany({
        where: { sellerId: id },
      });

      await tx.wasteRequest.deleteMany({
        where: { buyerId: id },
      });

      await tx.buyerApplication.deleteMany({
        where: { userId: id },
      });

      return tx.user.delete({
        where: { id },
      });
    });
  }
}

export const adminRepository = new AdminRepository();
