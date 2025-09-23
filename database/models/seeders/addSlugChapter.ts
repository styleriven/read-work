import { slugify } from "@/lib/uitls/utils";
import chapterRepository from "@models/repositories/chapter-repository";

const addSlugChapter = async () => {
  try {
    const chapters = await chapterRepository.getALL();

    const operations = chapters.map((chapter) => {
      const baseSlug = slugify(chapter.title || "");
      const slug = `${baseSlug}-${chapter._id.slice(0, 8)}`;
      return {
        _id: chapter._id,
        updateData: { slug },
      };
    });

    if (operations.length > 0) {
      await chapterRepository.updateMany(operations);
      console.log("Slugs added with bulkWrite!");
    }
  } catch (error) {
    console.error("Error adding slugs to chapters:", error);
  }
};

export default addSlugChapter;
