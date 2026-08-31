import { prisma } from "@/lib/prisma";

export class CategoryRepository {
  async findAll() {
    return prisma.wasteCategory.findMany({
      orderBy: { name: "asc" },
    });
  }

  async findAllWithAveragePrice() {
    const categories = await prisma.wasteCategory.findMany({
      orderBy: { name: "asc" },
      include: {
        wasteRequests: {
          select: { offeredPrice: true },
          where: { status: "aktif" }, // Optional: only active requests
        },
      },
    });

    return categories.map((cat) => {
      const validRequests = cat.wasteRequests.filter(r => r.offeredPrice != null);
      const total = validRequests.reduce((sum, r) => sum + Number(r.offeredPrice || 0), 0);
      const averagePrice = validRequests.length > 0 ? Math.round(total / validRequests.length) : 0;
      
      return {
        id: cat.id,
        name: cat.name,
        description: cat.description,
                averagePrice
      };
    });
  }
}

export const categoryRepository = new CategoryRepository();
