"use client";

import { RightOutlined, StarOutlined, TrophyOutlined } from "@ant-design/icons";
import LastResort from "./last-resort";
import { useEffect, useState } from "react";
import { IComic } from "@models/interfaces/i-comic";
import { ComicQuery } from "@/lib/server/queries/comic-query";
import { timeAgo } from "@/lib/uitls/utils";
import Loading from "../ui/loading";

export default function VietPen() {
  const [comics, setComics] = useState<any[]>();
  const [isLoading, setIsLoading] = useState(true);

  async function fetchComics() {
    try {
      setIsLoading(true);
      const data = await ComicQuery.getRandomComics(10);
      setComics(data);
    } catch (error) {
      console.error("Error fetching comics:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchComics();
  }, []);

  return (
    <div className="w-full">
      <p className="flex p-4 ml-10">Hồn Bút Việt</p>
      <div className="flex justify-center border p-4 rounded-lg bg-gradient-to-b shadow-lg mx-10 bg-gray-100/60">
        <LastResort
          title="Tinh Tú Xuất Thế"
          icon={<StarOutlined className="w-3 h-3" />}
        />
        <div className="w-1/2 mx-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-gray-600"></div>
            <h2 className="text-lg font-semibold text-gray-800">Chương mới</h2>
          </div>
          <ul>
            {isLoading ? (
              <Loading styleIcon={{ fontSize: "5rem" }} />
            ) : (
              comics?.map((comic) => (
                <li
                  key={comic.id}
                  className="border-b border-dashed border-gray-200"
                >
                  <a
                    href={`/comic/${comic.id}`}
                    className="flex items-center justify-between gap-4 px-2 py-3 group hover:bg-gray-50 rounded-md"
                  >
                    <div className="flex-1 flex gap-2 min-w-0">
                      <RightOutlined className="text-xs text-gray-400 group-hover:text-blue-500" />
                      <span className="font-medium text-gray-800 truncate group-hover:text-blue-500">
                        {comic.title}
                      </span>
                    </div>
                    <div
                      className="flex truncate w-40 text-sm text-gray-500 flex-shrink-0 "
                      title={comic?.categories
                        ?.map((x: any) => x.name)
                        ?.join(", ")}
                    >
                      {comic?.categories?.map((x: any) => x.name)?.join(", ")}
                    </div>

                    <div className="w-28 text-sm text-right text-gray-400 flex-shrink-0">
                      {timeAgo(comic.updatedAt)}
                    </div>
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>
        <LastResort
          title="Kim Thánh Bảng"
          icon={<TrophyOutlined className="w-3 h-3" />}
        />
      </div>
    </div>
  );
}
