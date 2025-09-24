import AllComics from "@/components/landing/all-comics";
import BookGrid from "@/components/landing/book-grid";
import ExclusiveComic from "@/components/landing/exclusive-comic";
import LastResort from "@/components/landing/last-resort";
import New from "@/components/landing/new";
import Panel from "@/components/landing/panel";
import UserInfo from "@/components/landing/user-info";
import VietPen from "@/components/landing/viet-pen";
import { RocketOutlined } from "@ant-design/icons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đọc Truyện Online Miễn Phí - Read World | Kho Truyện Hay Nhất",
  description:
    "Đọc truyện online miễn phí tại Read World: truyện tranh, tiểu thuyết, light novel cập nhật mỗi ngày. Giao diện đẹp, đọc mượt mà.",
  openGraph: {
    title: "Đọc Truyện Online Miễn Phí - Read World",
    description:
      "Khám phá kho tàng truyện online miễn phí với hàng nghìn đầu truyện hay nhất",
  },
};

export default async function Home() {
  return (
    <div className="w-full">
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
