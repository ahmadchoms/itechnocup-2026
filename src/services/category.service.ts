import { categoryRepository, CategoryRepository } from "@/repositories/category.repository";

export class CategoryService {
  constructor(private repo: CategoryRepository = categoryRepository) {}

  async getAllCategories() {
    return this.repo.findAll();
  }
}

export const categoryService = new CategoryService();
