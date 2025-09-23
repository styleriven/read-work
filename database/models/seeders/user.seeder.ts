import UserRoles from "@/enums/Role";
import { hashPassword } from "@/lib/uitls/hash";
import UserDetailModel from "@models/schemas/user-detail-schema";
import UserModel from "@models/schemas/user-schema";
import { v4 } from "uuid";

const seedUsers = async () => {
  const emailAdmin = process.env.EMAIL_ADMIN;
  const user = await UserModel.findOne({ email: emailAdmin, isVerified: true });
  if (user) {
    if (user.role !== UserRoles.Admin) {
      await UserModel.updateOne(
        { email: emailAdmin },
        { role: UserRoles.Admin }
      );
    }
  } else {
    const fiftyDaysAgo = new Date();
    fiftyDaysAgo.setDate(fiftyDaysAgo.getDate() - 50);
    const adminUser = new UserModel({
      _id: v4(),
      userName: "Admin User",
      email: emailAdmin,
      password: await hashPassword("admin123"),
      role: UserRoles.Admin,
      isVerified: true,
      createdAt: fiftyDaysAgo,
    });
    const adminUserDetail = new UserDetailModel({
      _id: v4(),
      userId: adminUser._id,
      referral: 1000,
      metallic: 500,
      ruby: 100,
      tickets: 50,
      svipPoints: 200,
    });
    await adminUser.save();
    await adminUserDetail.save();
  }

  //   const users = [
  //     {
  //       userName: "Admin User",
  //       email: emailAdmin,
  //       password: await hashPassword("admin123"),
  //       role: UserRoles.Admin,
  //     },
  //   ];

  //   await UserModel.insertMany(users);
  console.log("Users seeded successfully!");
};

export default seedUsers;
