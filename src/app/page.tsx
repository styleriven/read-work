import AllComics from "@/components/landing/all-comics";
import BookGrid from "@/components/landing/book-grid";
import ExclusiveComic from "@/components/landing/exclusive-comic";
import LastResort from "@/components/landing/last-resort";
import New from "@/components/landing/new";
import Panel from "@/components/landing/panel";
import UserInfo from "@/components/landing/user-info";
import VietPen from "@/components/landing/viet-pen";
import { StructuredData } from "@/components/seo/StructuredData";
import { RocketOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import { div, image } from "framer-motion/dist/m";
import { Metadata } from "next";
import { domain } from "zod/v4/core/regexes.cjs";

export const metadata: Metadata = {
  title: "Đọc Truyện Online Miễn Phí - Read World | Kho Truyện Hay Nhất",
  description:
    " Read World cung cấp hàng nghìn bộ truyện tranh, tiểu thuyết, light novel được cập nhật liên tục. Bạn có thể tìm kiếm theo thể loại, tác giả, hoặc xu hướng mới nhất. Giao diện đẹp, đọc mượt mà trên mọi thiết bị.",
};

export default async function Home() {
  return (
    <div className="w-full">
      <h1 className="sr-only">Đọc Truyện Online Miễn Phí - Read World</h1>
      <section className="flex flex-col gap-2 md:flex-row items-center justify-center text-center p-4 h-1/4">
        <New />
        <Panel />
        <UserInfo />
      </section>
      <section className="flex flex-col gap-2 md:flex-row items-stretch justify-center text-center p-4 h-1/4">
        <ExclusiveComic />
        <BookGrid />
        <LastResort
          title="Đồng Lực Cuối Cùng"
          className="bg-white/60 rounded-lg shadow-lg p-4"
          icon={<RocketOutlined className="w-3 h-3" />}
        />
      </section>
      <section className="md:flex hidden justify-center text-center p-4 ">
        <VietPen />
      </section>
      <section className="md:flex hidden justify-center text-center p-4">
        <AllComics />
      </section>
    </div>
  );
}
