import { prisma } from "@/lib/prisma";

export class HomeRepository {
  async findRecentListings(take = 6) {
    return prisma.listing.findMany({
      where: { status: { not: "dihapus" } },
      take,
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            isAdmin: true,
            latitude: true,
            longitude: true,
            receivedReviews: { select: { rating: true } },
          },
        },
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findRecentRequests(take = 4) {
    return prisma.wasteRequest.findMany({
      where: { status: { not: "dihapus" } },
      take,
      include: {
        buyer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            latitude: true,
            longitude: true,
          },
        },
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const homeRepository = new HomeRepository();
