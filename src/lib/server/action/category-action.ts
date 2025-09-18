import categoryRepository from "@models/repositories/category-repository";

class CategoryAction {
  async GetALL() {
    try {
      const categories = await categoryRepository.GetALL();
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  async GetALLSummary() {
    try {
      const categories = await categoryRepository.GetALLSummary();
      return categories;
    } catch (error) {
      console.error("Error fetching category summaries:", error);
      throw error;
    }
  }
}

export const categoryAction = new CategoryAction();
