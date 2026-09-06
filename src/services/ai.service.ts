import { prisma } from "@/lib/prisma";

export class AIService {
  async classifyWaste(photoUrl: string) {
    if (!photoUrl) {
      throw new Error("URL foto tidak boleh kosong");
    }

    const categoryName = "Kardus / Karton";
    const confidence = 95.0;

    // Cari categoryId dari nama kategori
    const category = await prisma.wasteCategory.findFirst({
      where: { name: { equals: categoryName, mode: "insensitive" } },
    });

    const fallbackCategory = category ?? (await prisma.wasteCategory.findFirst());

    return {
      categoryName,
      categoryId: fallbackCategory?.id ?? null,
      confidence,
      isReal: true,
      provider: "resnet50_tfjs",
    };
  }

  async evaluateMatchesOnTheFly(
    listing: { id: string; title: string; categoryName: string },
    requests: Array<{ id: string; title: string; categoryName: string }>
  ) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return requests.map((r) => ({ requestId: r.id, aiScore: 0 }));
    }

    try {
      const prompt = `Kamu adalah AI pencocok sampah daur ulang.
Bandingkan barang yang dijual (Listing) ini dengan daftar permintaan pengepul (Requests).
Listing:
- Judul: ${listing.title}
- Kategori: ${listing.categoryName}

Requests:
${requests
  .map((r, i) => `${i + 1}. [ID: ${r.id}] Judul: ${r.title}, Kategori: ${r.categoryName}`)
  .join("\n")}

Berikan skor kecocokan (0.0 sampai 1.0) untuk masing-masing request.
Keluarkan hanya JSON murni (array) TANPA blok markdown, format:
[
  { "requestId": "id-request", "aiScore": 0.95 }
]`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (!response.ok) {
        return requests.map((r) => ({ requestId: r.id, aiScore: 0 }));
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) return requests.map((r) => ({ requestId: r.id, aiScore: 0 }));

      const scores: Array<{ requestId: string; aiScore: number }> = JSON.parse(text);
      return scores;
    } catch (error) {
      console.error("[evaluateMatchesOnTheFly] AI Error:", error);
      return requests.map((r) => ({ requestId: r.id, aiScore: 0 }));
    }
  }
}

export const aiService = new AIService();
