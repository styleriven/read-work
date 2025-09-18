"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination, Select, Space, Typography } from "antd";
import { SearchPageProps } from "@/types/search";

const { Text } = Typography;

interface PaginationInfo {
  currentPage: number;
  limit: number;
  totalCount: number;
}

interface SearchPaginationProps {
  pagination: PaginationInfo;
}

export default function SearchPagination({
  pagination,
}: SearchPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    if (key !== "page") {
      params.set("page", "1");
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <Pagination
        current={pagination.currentPage}
        total={pagination.totalCount}
        pageSize={pagination.limit}
        showSizeChanger={false}
        onChange={(page) => updateParam("page", page.toString())}
      />
    </div>
  );
}
