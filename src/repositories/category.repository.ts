import { prisma } from "@/lib/prisma";

export class CategoryRepository {
  async findAll() {
    return prisma.wasteCategory.findMany({
      orderBy: { name: "asc" },
    });
  }
}

export const categoryRepository = new CategoryRepository();
