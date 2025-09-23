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
}

export const categoryAction = new CategoryAction();
