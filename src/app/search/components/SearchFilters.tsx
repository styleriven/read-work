"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  Card,
  Row,
  Col,
  Typography,
} from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { SearchFilterOptions, SearchPageProps } from "@/types/search";

// const { Title } = Typography;
const { Option } = Select;

interface SearchFiltersProps {
  filterOptions: SearchFilterOptions | null;
  currentFilters: SearchPageProps["searchParams"];
}

export default function SearchFilters({
  filterOptions,
  currentFilters,
}: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState(currentFilters.q || "");
  const [categories, setCategories] = useState<string[]>(
    currentFilters.categories ? currentFilters.categories.split(",") : []
  );
  useEffect(() => {
    form.setFieldsValue({
      q: currentFilters.q || "",
      sortBy: currentFilters.sortBy || "createdAt",
      sortOrder: currentFilters.sortOrder || "desc",
      categories: currentFilters.categories || undefined,
      status: currentFilters.status || undefined,
      type: currentFilters.type || undefined,
      ageRating: currentFilters.ageRating || undefined,
    });
    setSearchQuery(currentFilters.q || "");
  }, [currentFilters, form]);

  const updateFilter = (
    key: string,
    value: string | string[] | null | undefined
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (Array.isArray(value) && value.length > 0) {
      params.set(key, value.join(","));
    } else if (typeof value === "string" && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key !== "page") {
      params.set("page", "1");
    }
    router.push(`/search?${params.toString()}`);
  };

  const handleSearch = () => {
    updateFilter("q", searchQuery);
  };

  const handleFilterChange = (key: string, value: any) => {
    if (key === "categories") {
      setCategories(value);
    }
    updateFilter(key, value);
  };

  const clearAllFilters = () => {
    form.resetFields();
    setSearchQuery("");
    setCategories([]);
    router.push("/search");
  };

  if (!filterOptions) {
    return <Card loading>Đang tải bộ lọc...</Card>;
  }

  return (
    <Card className="w-full m-1">
      <Form form={form} layout="vertical" className="space-y-4">
        <Form.Item label="Tìm kiếm" className="mb-4">
          <Input.Search
            placeholder="Nhập tên truyện, tác giả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
            enterButton={
              <Button type="primary" icon={<SearchOutlined />}>
                Tìm
              </Button>
            }
            size="middle"
          />
        </Form.Item>

        {/* Sort */}
        <Form.Item label="Sắp xếp theo" className="mb-4">
          <Row gutter={8}>
            <Col span={14}>
              <Select
                value={currentFilters.sortBy}
                placeholder="Chọn tiêu chí sắp xếp"
                onChange={(value) => handleFilterChange("sortBy", value)}
                className="w-full"
                size="middle"
              >
                {filterOptions?.sortOptions?.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={10}>
              <Select
                value={currentFilters.sortOrder || "desc"}
                onChange={(value) => handleFilterChange("sortOrder", value)}
                className="w-full"
                size="middle"
              >
                <Option value="desc">Giảm dần</Option>
                <Option value="asc">Tăng dần</Option>
              </Select>
            </Col>
          </Row>
        </Form.Item>

        {/* Category Filter */}
        <Form.Item label="Thể loại" className="mb-4">
          <Select
            mode="multiple"
            value={categories || []}
            onChange={(values) => handleFilterChange("categories", values)}
            placeholder="Tất cả thể loại"
            allowClear
            className="w-full"
            size="middle"
          >
            {filterOptions.categories?.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Comic Type Filter */}
        <Form.Item label="Loại truyện" className="mb-4">
          <Select
            value={currentFilters.type || undefined}
            onChange={(value) => handleFilterChange("type", value)}
            placeholder="Tất cả loại"
            allowClear
            className="w-full"
            size="middle"
          >
            {filterOptions.types?.map((type) => (
              <Option key={type.value} value={type.value}>
                {type.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Clear Filters */}
        <Form.Item className="mb-0">
          <Button
            onClick={clearAllFilters}
            icon={<ClearOutlined />}
            block
            size="middle"
          >
            Xóa tất cả bộ lọc
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
