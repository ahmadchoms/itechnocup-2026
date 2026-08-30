import { prisma } from "@/lib/prisma";
import { CreateRequestInput, UpdateRequestInput } from "@/validations/request.schema";

export class RequestRepository {
  async createRequest(buyerId: string, data: CreateRequestInput) {
    return prisma.$transaction(async (tx) => {
      const wasteRequest = await tx.wasteRequest.create({
        data: {
          buyerId,
          categoryId: data.categoryId,
          title: data.title,
          description: data.description ?? null,
          quantityWanted: data.quantityWanted ?? null,
          unit: data.unit || "kg",
          offeredPrice: data.offeredPrice,
          address: data.address || "Semarang, Jawa Tengah",
          latitude: -7.1201,
          longitude: 110.4022,
          status: "aktif",
        },
        include: {
          category: true,
          buyer: true,
        },
      });

      // Automatic proximity match creation
      const matchingListings = await tx.listing.findMany({
        where: {
          categoryId: data.categoryId,
          status: "aktif",
        },
      });

      for (const listing of matchingListings) {
        const distance = Number((Math.random() * 4 + 0.8).toFixed(1));
        await tx.match.create({
          data: {
            listingId: listing.id,
            requestId: wasteRequest.id,
            distanceKm: distance,
            status: "disarankan",
          },
        });
      }

      return wasteRequest;
    });
  }

  async findRequestById(id: string) {
    return prisma.wasteRequest.findUnique({
      where: { id },
      include: {
        category: true,
        buyer: true,
      },
    });
  }

  async updateRequest(id: string, data: UpdateRequestInput) {
    return prisma.wasteRequest.update({
      where: { id },
      data: {
        title: data.title,
        categoryId: data.categoryId,
        description: data.description,
        quantityWanted: data.quantityWanted !== undefined ? data.quantityWanted : undefined,
        unit: data.unit,
        offeredPrice: data.offeredPrice !== undefined ? data.offeredPrice : undefined,
        address: data.address,
      },
      include: {
        category: true,
        buyer: true,
      },
    });
  }

  async softDeleteRequest(id: string) {
    return prisma.wasteRequest.update({
      where: { id },
      data: { status: "dihapus" },
    });
  }

  async findManyRequests(filters?: { categoryId?: string; search?: string }) {
    const whereClause: any = {
      status: "aktif",
    };

    if (filters?.categoryId && filters.categoryId !== "all") {
      whereClause.categoryId = filters.categoryId;
    }

    if (filters?.search) {
      whereClause.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { address: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return prisma.wasteRequest.findMany({
      where: whereClause,
      include: {
        category: true,
        buyer: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            phone: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const requestRepository = new RequestRepository();
