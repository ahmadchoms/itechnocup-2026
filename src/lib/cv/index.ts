/**
 * Computer Vision helper — proxy ke CV provider (Roboflow / Teachable Machine).
 * 
 * Saat ini menggunakan logika mock berbasis keyword URL untuk keperluan demo.
 * Untuk menggantinya dengan provider nyata:
 * 
 * ROBOFLOW:
 *   const roboflowRes = await fetch(
 *     `https://detect.roboflow.com/${process.env.CV_PROVIDER_MODEL_ENDPOINT}`,
 *     { method: "POST", body: formData, headers: { Authorization: `Bearer ${process.env.CV_PROVIDER_API_KEY}` } }
 *   );
 * 
 * GOOGLE TEACHABLE MACHINE:
 *   Kirim foto ke endpoint model yang diekspor ke TFJS/REST
 */

export interface CVResult {
  categoryName: string;
  confidence: number;
  isReal: boolean; // false = mock, true = dari provider nyata
}

// Mapping keyword URL foto ke kategori
const PHOTO_KEYWORD_MAP: Record<string, { categoryName: string; confidence: number }> = {
  kopi:       { categoryName: "Ampas Kopi", confidence: 94.5 },
  coffee:     { categoryName: "Ampas Kopi", confidence: 92.0 },
  kardus:     { categoryName: "Anorganik",  confidence: 91.2 },
  cardboard:  { categoryName: "Anorganik",  confidence: 89.8 },
  "589939705": { categoryName: "Anorganik", confidence: 91.2 }, // URL unsplash kardus
  plastik:    { categoryName: "Anorganik",  confidence: 98.0 },
  plastic:    { categoryName: "Anorganik",  confidence: 96.5 },
  "605600659": { categoryName: "Anorganik", confidence: 98.0 }, // URL unsplash botol plastik
  kaleng:     { categoryName: "Logam",      confidence: 96.1 },
  aluminium:  { categoryName: "Logam",      confidence: 95.0 },
  "558618666": { categoryName: "Logam",     confidence: 96.1 }, // URL unsplash kaleng
  logam:      { categoryName: "Logam",      confidence: 93.0 },
  metal:      { categoryName: "Logam",      confidence: 91.0 },
  "514432324": { categoryName: "Ampas Kopi", confidence: 94.5 }, // URL unsplash ampas kopi
};

/**
 * Klasifikasikan foto berdasarkan URL.
 * Untuk CV provider nyata, ganti implementasi di sini.
 */
export async function classifyPhoto(photoUrl: string): Promise<CVResult> {
  // === GANTI DI SINI UNTUK ROBOFLOW / TEACHABLE MACHINE ===
  // Uncomment kode berikut dan isi env variable:
  //
  // if (process.env.CV_PROVIDER_API_KEY && process.env.CV_PROVIDER_MODEL_ENDPOINT) {
  //   const res = await fetch(`https://detect.roboflow.com/${process.env.CV_PROVIDER_MODEL_ENDPOINT}`, {
  //     method: "POST",
  //     headers: { Authorization: `Bearer ${process.env.CV_PROVIDER_API_KEY}` },
  //     body: JSON.stringify({ image: photoUrl, confidence: 40 }),
  //   });
  //   const data = await res.json();
  //   return { categoryName: data.predictions[0]?.class || "Anorganik", confidence: data.predictions[0]?.confidence * 100 || 80, isReal: true };
  // }
  // =========================================================

  // MOCK LOGIC: analisis URL foto untuk demo
  const urlLower = photoUrl.toLowerCase();
  
  for (const [keyword, result] of Object.entries(PHOTO_KEYWORD_MAP)) {
    if (urlLower.includes(keyword)) {
      return { ...result, isReal: false };
    }
  }

  // Default fallback
  return { categoryName: "Anorganik", confidence: 85.0, isReal: false };
}
