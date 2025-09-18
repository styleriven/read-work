import seedUsers from "./user.seeder";
import seedCategory from "./category.seeder";

const runSeeders = async () => {
  console.log("Running seeders...");

  await seedUsers();
  await seedCategory();

  console.log("All seeders completed!");
};

export default runSeeders;
