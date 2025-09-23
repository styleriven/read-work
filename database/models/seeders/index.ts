import seedUsers from "./user.seeder";
import seedCategory from "./category.seeder";
import addSlugComic from "./addSlugComic";
import addSlugChapter from "./addSlugChapter";

const runSeeders = async () => {
  console.log("Running seeders...");

  // await seedUsers();
  // await seedCategory();
  // await addSlugComic();
  await addSlugChapter();
  console.log("All seeders completed!");
};

export default runSeeders;
