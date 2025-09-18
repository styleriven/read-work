"use client";
import { SearchPageProps } from "@/types/search";
import Image from "next/image";
import Link from "next/link";

interface SearchResultsProps {
  comics: any[];
  currentFilters: SearchPageProps["searchParams"];
}

export default function SearchResults({
  comics,
  currentFilters,
}: SearchResultsProps) {
  if (comics?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">
          Không tìm thấy truyện nào
        </div>
        <p className="text-gray-500">
          Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {comics?.map((comic) => (
        <article
          key={comic._id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 hover:shadow-lg transition-shadow"
        >
          <Link href={`/comic/${comic.slug || comic._id}`}>
            <div className="aspect-[3/4] relative">
              <Image
                src={comic.coverImage || "/default-cover.png"}
                alt={comic.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute top-2 right-2">
                <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {comic.comicType.toUpperCase()}
                </span>
              </div>
              {/* <div className="absolute bottom-2 left-2">
                <span
                  className={`text-xs px-2 py-1 rounded text-white ${
                    comic.status === "completed"
                      ? "bg-green-600"
                      : comic.status === "ongoing"
                      ? "bg-blue-600"
                      : comic.status === "hiatus"
                      ? "bg-yellow-600"
                      : comic.status === "cancelled"
                      ? "bg-red-600"
                      : "bg-gray-600"
                  }`}
                >
                  {comic.status === "ongoing" && "Đang ra"}
                  {comic.status === "completed" && "Hoàn thành"}
                  {comic.status === "hiatus" && "Tạm nghỉ"}
                  {comic.status === "cancelled" && "Đã hủy"}
                  {comic.status === "draft" && "Bản nháp"}
                </span>
              </div> */}
            </div>
          </Link>

          <div className="p-4">
            <Link href={`/comic/${comic.slug || comic._id}`}>
              <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                {comic.title}
              </h3>
            </Link>

            <p className="text-sm text-gray-600 mb-2">
              Tác giả: {comic.authorName}
              {comic.artist && comic.artist !== comic.authorName && (
                <span> • Họa sĩ: {comic.artist}</span>
              )}
            </p>

            {comic?.categories.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {comic?.categories.slice(0, 3).map((category: any) => (
                    <Link
                      key={category.id}
                      href={`/search?category=${category.id}`}
                      className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {category.name}
                    </Link>
                  ))}
                  {comic.categories.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{comic.categories.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between text-xs text-gray-500">
              <span>{comic.stats.viewsCount.toLocaleString()} lượt xem</span>
            </div>

            {comic.stats.avgRating > 0 && (
              <div className="mt-2 flex items-center">
                <div className="flex text-yellow-400">
                  {"★".repeat(Math.floor(comic.stats.avgRating))}
                  {"☆".repeat(5 - Math.floor(comic.stats.avgRating))}
                </div>
                <span className="ml-1 text-xs text-gray-500">
                  {comic.stats.avgRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
