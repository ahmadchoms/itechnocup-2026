"use server";

import { aiService } from "@/services/ai.service";
import { classifyWasteSchema, ClassifyWasteInput } from "@/validations/ai.schema";

export type ClassifyWasteResult =
  | {
      success: true;
      categoryName: string;
      categoryId: string | null;
      confidence: number;
      isReal: boolean;
      provider: string;
    }
  | {
      success: false;
      error: string;
    };

export async function classifyWasteAction(input: ClassifyWasteInput): Promise<ClassifyWasteResult> {
  try {
    const validated = classifyWasteSchema.parse(input);
    const result = await aiService.classifyWaste(validated.photoUrl);
    return {
      success: true,
      categoryName: result.categoryName,
      categoryId: result.categoryId,
      confidence: result.confidence,
      isReal: result.isReal,
      provider: result.provider,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengklasifikasi foto sampah";
    return { success: false, error: message };
  }
}
