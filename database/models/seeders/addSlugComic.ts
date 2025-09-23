import { slugify } from "@/lib/uitls/utils";
import comicRepository from "@models/repositories/comic-repository";

const addSlugComic = async () => {
  try {
    const comics = await comicRepository.getALL();

    const operations = comics.map((comic) => {
      const baseSlug = slugify(comic.title || "");
      const slug = `${baseSlug}-${comic._id.slice(0, 8)}`;
      return {
        _id: comic._id,
        updateData: { slug },
      };
    });

    if (operations.length > 0) {
      await comicRepository.updateMany(operations);
      console.log("Slugs added with bulkWrite!");
    }
  } catch (error) {
    console.error("Error adding slugs to comics:", error);
  }
};

export default addSlugComic;
