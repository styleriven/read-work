import { CategoryModel } from "@models/schemas";
import { v4 } from "uuid";

const seedCategory = async () => {
  try {
    const categories = [
      {
        _id: v4(),
        name: "Action",
        slug: "action",
        description: "Truyện thể loại hành động",
        color: "#ff4d4f",
      },
      {
        _id: v4(),
        name: "Romance",
        slug: "romance",
        description: "Truyện tình cảm lãng mạn",
        color: "#eb2f96",
      },
      {
        _id: v4(),
        name: "Comedy",
        slug: "comedy",
        description: "Truyện hài hước, giải trí",
        color: "#faad14",
      },
      {
        _id: v4(),
        name: "Horror",
        slug: "horror",
        description: "Truyện kinh dị, rùng rợn",
        color: "#722ed1",
      },
      {
        _id: v4(),
        name: "Fantasy",
        slug: "fantasy",
        description: "Truyện viễn tưởng, ma thuật",
        color: "#1890ff",
      },
      {
        _id: v4(),
        name: "Adventure",
        slug: "adventure",
        description: "Truyện phiêu lưu mạo hiểm",
        color: "#13c2c2",
      },
      {
        _id: v4(),
        name: "Drama",
        slug: "drama",
        description: "Truyện tâm lý, kịch tính",
        color: "#a0d911",
      },
      {
        _id: v4(),
        name: "Mystery",
        slug: "mystery",
        description: "Truyện bí ẩn, trinh thám",
        color: "#2f54eb",
      },
      {
        _id: v4(),
        name: "Slice of Life",
        slug: "slice-of-life",
        description: "Truyện đời thường, nhẹ nhàng",
        color: "#fa8c16",
      },
      {
        _id: v4(),
        name: "Sci-Fi",
        slug: "sci-fi",
        description: "Truyện khoa học viễn tưởng",
        color: "#52c41a",
      },
    ];
    await CategoryModel.insertMany(categories);

    console.log("✅ Seed 10 categories thành công!");
  } catch (error) {}
};

export default seedCategory;
