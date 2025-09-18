import AllComics from "@/components/landing/all-comics";
import BookGrid from "@/components/landing/book-grid";
import ExclusiveComic from "@/components/landing/exclusive-comic";
import LastResort from "@/components/landing/last-resort";
import New from "@/components/landing/new";
import Panel from "@/components/landing/panel";
import UserInfo from "@/components/landing/user-info";
import VietPen from "@/components/landing/viet-pen";
import LayoutMain from "@/components/Layout/layout-main";
import { RocketOutlined } from "@ant-design/icons";

export default async function Home() {
  return (
    <div className="w-full">
      <section className="flex items-center justify-center text-center p-4 h-1/4">
        <New />
        <Panel />
        <UserInfo />
      </section>
      <section className="flex items-stretch justify-center text-center p-4 h-1/4">
        <ExclusiveComic />
        <BookGrid />
        <LastResort
          title="Đồng Lực Cuối Cùng"
          className="bg-white/60 rounded-lg shadow-lg p-4 mr-10"
          icon={<RocketOutlined className="w-3 h-3" />}
        />
      </section>
      <section className="flex justify-center text-center p-4">
        <VietPen />
      </section>
      <section className="flex justify-center text-center p-4">
        <AllComics />
      </section>
    </div>
  );
}
