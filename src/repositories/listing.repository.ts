import { prisma } from "@/lib/prisma";
import { CreateListingInput, UpdateListingInput } from "@/validations/listing.schema";

export class ListingRepository {
  async createListing(sellerId: string, data: CreateListingInput) {
    return prisma.$transaction(async (tx) => {
      const listing = await tx.listing.create({
        data: {
          sellerId,
          categoryId: data.categoryId,
          title: data.title,
          photoUrl: data.photoUrl || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600",
          estimatedWeightKg: data.estimatedWeightKg ?? null,
          quantity: data.quantity ?? null,
          unit: data.unit || "kg",
          condition: data.condition || "Baik",
          description: data.description ?? null,
          estimatedPrice: data.estimatedPrice ?? null,
          address: data.address || "Semarang, Jawa Tengah",
          latitude: data.latitude ?? -7.0505,
          longitude: data.longitude ?? 110.4371,
          status: "aktif",
          cvPredictedCategoryId: data.cvPredictedCategoryId || data.categoryId,
          cvConfidence: data.cvConfidence ?? 90.0,
          isCvCorrected: Boolean(data.isCvCorrected),
        },
        include: {
          category: true,
          seller: true,
        },
      });

      if (data.cvPredictedCategoryId) {
        await tx.cVClassificationLog.create({
          data: {
            listingId: listing.id,
            photoUrl: listing.photoUrl,
            predictedCategoryId: data.cvPredictedCategoryId,
            confidence: data.cvConfidence ?? 90.0,
            modelProvider: "roboflow",
          },
        });
      }

      return listing;
    });
  }

  async findListingById(id: string) {
    return prisma.listing.findUnique({
      where: { id },
      include: {
        category: true,
        seller: true,
      },
    });
  }

  async updateListing(id: string, data: UpdateListingInput) {
    return prisma.listing.update({
      where: { id },
      data: {
        title: data.title,
        categoryId: data.categoryId,
        estimatedWeightKg: data.estimatedWeightKg !== undefined ? data.estimatedWeightKg : undefined,
        quantity: data.quantity !== undefined ? data.quantity : undefined,
        unit: data.unit,
        condition: data.condition,
        description: data.description,
        estimatedPrice: data.estimatedPrice !== undefined ? data.estimatedPrice : undefined,
        address: data.address,
        latitude: data.latitude !== undefined ? data.latitude : undefined,
        longitude: data.longitude !== undefined ? data.longitude : undefined,
        photoUrl: data.photoUrl,
      },
      include: {
        category: true,
        seller: true,
      },
    });
  }

  async softDeleteListing(id: string) {
    return prisma.listing.update({
      where: { id },
      data: { status: "dihapus" },
    });
  }

  async findManyListings(filters?: { categoryId?: string; search?: string }) {
    const whereClause: any = {
      status: { not: "dihapus" },
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

    return prisma.listing.findMany({
      where: whereClause,
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            phone: true,
            receivedReviews: {
              select: { rating: true },
            },
          },
        },
        category: true,
        cvPredictedCategory: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const listingRepository = new ListingRepository();
