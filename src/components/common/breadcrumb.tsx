import { Breadcrumb as AntBreadcrumb } from "antd";
import Link from "next/link";
import { BreadcrumbItem } from "@/types/breadcrumb-item";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumb({
  items,
  className = "",
  showHome = false,
}: BreadcrumbProps) {
  const breadcrumbItems = items.map((item, index) => ({
    title:
      item.url && index < items.length - 1 ? (
        <Link
          href={item.url}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          {item.name}
        </Link>
      ) : (
        <span
          className={
            index === items.length - 1
              ? "text-gray-900 font-medium"
              : "text-gray-600"
          }
        >
          {item.name}
        </span>
      ),
  }));

  return (
    <div className={className}>
      <AntBreadcrumb
        items={breadcrumbItems}
        separator=">"
        className="text-sm"
      />
    </div>
  );
}
