import categoryRepository from "@models/repositories/category-repository";

class CategoryAction {
  async getALL() {
    try {
      const categories = await categoryRepository.getALL();
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  async getALLSummary() {
    try {
      const categories = await categoryRepository.getALLSummary();
      return categories;
    } catch (error) {
      console.error("Error fetching category summaries:", error);
      throw error;
    }
  }

  async getCategoryBySlug(
    categorySlug: string,
    query: { q?: string; page?: string; limit?: string }
  ) {
    try {
      const page = query.page ? parseInt(query.page, 10) : 1;
      const limit = query.limit ? parseInt(query.limit, 10) : 10;
      const q = query.q || undefined;

      const filter: any = { slug: categorySlug, deletedAt: null };
      const categories = await categoryRepository.getCategoryBySlug(filter, q, {
        page,
        limit,
      });
      return categories;
    } catch (error) {
      console.error("Error fetching category by slug:", error);
      throw error;
    }
  }
}

export const categoryAction = new CategoryAction();
