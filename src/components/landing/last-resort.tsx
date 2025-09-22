"use client";

import { ArrowUpOutlined, EyeOutlined } from "@ant-design/icons";
import { useEffect, useState, ReactNode } from "react";
import Loading from "../ui/loading";
import { IComic } from "@models/interfaces/i-comic";
import { timeAgo } from "@/lib/uitls/utils";
import { ComicQuery } from "@/lib/server/queries/comic-query";

export default function LastResort({
  title,
  icon,
  className,
  initialComics = [],
  ...props
}: {
  className?: string;
  title?: string;
  icon?: ReactNode;
  initialComics?: IComic[];
}) {
  const [comics, setComics] = useState<IComic[]>(initialComics);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchComics() {
    if (initialComics && initialComics.length > 0) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const data = await ComicQuery.getRandomComics(9);
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

  if (isLoading) {
    return (
      <div className={`w-1/4 ${className}`} {...props}>
        <Loading styleIcon={{ fontSize: "5rem" }} />
      </div>
    );
  }

  if (!comics || comics.length === 0) {
    return (
      <div className={`md:w-1/4 w-full ${className}`}>Không có dữ liệu</div>
    );
  }

  return (
    <div className={`md:w-1/4 w-full  ${className}`} {...props}>
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
        <div className="text-gray-600">{icon}</div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-1">
          <h3 className="text-sm text-left font-medium text-gray-800 mb-1 line-clamp-1">
            {comics[0]?.title}
          </h3>
          <div className="flex gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <ArrowUpOutlined className="w-3 h-3" />
              <span>{timeAgo(comics[0].updatedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <EyeOutlined className="w-3 h-3" />
              <span>{comics[0]?.stats?.viewsCount ?? 0}</span>
            </div>
          </div>
        </div>

        <div className="w-[60px] h-[80px] bg-gradient-to-br from-pink-100 to-red-100 rounded-md flex items-center justify-center overflow-hidden">
          <img
            src={comics[0]?.coverImage ?? "/default-cover.png"}
            alt={comics[0]?.title ?? "Book cover"}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      </div>

      {/* Comic List */}
      <div className="space-y-1">
        {comics.slice(1)?.map((comic) => (
          <div
            key={comic._id}
            className="flex items-center justify-between group hover:bg-gray-50 -mx-2 px-2 py-2 rounded transition-colors cursor-pointer border-t border-gray-100"
            title={comic.title}
          >
            <div className="flex-1 pr-3 w-[60%]">
              <h4 className="truncate w-full text-sm text-left text-gray-700 group-hover:text-gray-900 line-clamp-1">
                {comic.title}
              </h4>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <EyeOutlined />
              <span className="font-medium">
                {comic.stats?.viewsCount ?? 0}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
