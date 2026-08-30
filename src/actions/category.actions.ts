"use server";

import { categoryService } from "@/services/category.service";

export async function getCategoriesAction() {
  try {
    const categories = await categoryService.getAllCategories();
    return { success: true, categories };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengambil kategori";
    return { success: false, error: message };
  }
}
