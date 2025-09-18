import dotenv from "dotenv";
dotenv.config();
console.log("MONGODB_URI:", process.env.MONGODB_URI);

import runSeeders from "@models/seeders";
import connectDB from "@/lib/mongodb";

(async () => {
  try {
    console.log("Starting seed script...");
    console.log("Connecting to database...");
    await connectDB();

    await runSeeders();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
})();
