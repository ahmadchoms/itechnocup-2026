import { classifyPhoto } from "@/lib/cv";
import { prisma } from "@/lib/prisma";

export class AIService {
  async classifyWaste(photoUrl: string) {
    if (!photoUrl) {
      throw new Error("URL foto tidak boleh kosong");
    }

    const result = await classifyPhoto(photoUrl);

    // Cari categoryId dari nama kategori
    const category = await prisma.wasteCategory.findFirst({
      where: { name: { equals: result.categoryName, mode: "insensitive" } },
    });

    // Fallback: ambil kategori pertama jika tidak ditemukan
    const fallbackCategory = category ?? (await prisma.wasteCategory.findFirst());

    return {
      categoryName: result.categoryName,
      categoryId: fallbackCategory?.id ?? null,
      confidence: result.confidence,
      isReal: result.isReal,
      provider: result.isReal ? "roboflow" : "mock",
    };
  }
}

export const aiService = new AIService();
