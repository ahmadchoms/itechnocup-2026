import { prisma } from "@/lib/prisma";

export class MatchRepository {
  async findAllMatches() {
    return prisma.match.findMany({
      include: {
        listing: {
          include: {
            seller: true,
            category: true,
          },
        },
        request: {
          include: {
            buyer: true,
            category: true,
          },
        },
        conversations: true,
      },
      orderBy: { distanceKm: "asc" },
    });
  }

  async findMatchById(id: string) {
    return prisma.match.findUnique({
      where: { id },
      include: {
        listing: {
          include: {
            seller: true,
            category: true,
          },
        },
        request: {
          include: {
            buyer: true,
            category: true,
          },
        },
        conversations: true,
      },
    });
  }
}

export const matchRepository = new MatchRepository();
