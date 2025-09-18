"use client";

import { useState, useEffect, use } from "react";
import { Table, Pagination, Select, Input } from "antd";
import Loading from "@/components/ui/loading";
import { IComic } from "@models/interfaces/i-comic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { param } from "framer-motion/dist/m";

const { Search } = Input;

interface MyComicClientProps {
  initialComics: IComic[];
  initialTotal: number;
  initialPage: number;
  initialPageSize: number;
  initialKeyword: string;
  initialSort: string;
}

export default function MyComicClient({
  initialComics,
  initialTotal,
  initialPage,
  initialPageSize,
  initialKeyword,
  initialSort,
}: MyComicClientProps) {
  const [comics, setComics] = useState<IComic[]>(initialComics);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage || 1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [sortOption, setSortOption] = useState(initialSort);
  const [limit, setLimit] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const optionSelect = [
    { value: "truyen-moi", label: "Truyện Mới" },
    { value: "moi-cap-nhat", label: "Mới Cập Nhật" },
  ];

  useEffect(() => {
    setComics(initialComics);
    setTotal(initialTotal);
    setPage(initialPage);
    setPageSize(initialPageSize);
    setKeyword(initialKeyword);
    setSortOption(initialSort);
  }, [initialComics]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (keyword) params.set("keyword", keyword);
      if (sortOption) params.set("sort", sortOption);
      params.set("page", page ? page.toString() : "1");
      params.set("limit", limit ? limit.toString() : "10");

      router.push(`/dashboard/my-comic?${params.toString()}`);
    }, 500);
    return () => clearTimeout(timer);
  }, [page, keyword, sortOption]);

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPage(1);
  };

  return (
    <div className="p-6 flex-grow min-h-screen">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h2 className="text-lg font-bold">Danh Sách Truyện ({total})</h2>

        <div className="flex items-center gap-2">
          <Select
            value={sortOption}
            options={optionSelect}
            onChange={(val) => setSortOption(val)}
            className="min-w-max"
            popupMatchSelectWidth={false}
          />

          <Search
            placeholder="Nhập Tên Truyện..."
            onChange={(e) => handleSearch(e.target.value)}
            enterButton="Tìm kiếm"
            allowClear
            defaultValue={keyword}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loading styleIcon={{ fontSize: "5rem" }} />
        </div>
      ) : (
        <>
          <Table
            dataSource={comics}
            rowKey="id"
            pagination={false}
            bordered
            columns={[
              {
                title: "Tên Truyện",
                dataIndex: "title",
                render: (_, record) => (
                  <Link href={`/comic/${record.id}`}>{record.title}</Link>
                ),
              },
              { title: "Tác Giả", dataIndex: "authorName" },
              { title: "Trạng Thái", dataIndex: "status" },
            ]}
          />

          <div className="flex justify-center mt-4">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={(p, ps) => {
                setPage(p);
                setPageSize(ps);
              }}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
}
