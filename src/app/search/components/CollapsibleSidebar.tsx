"use client";
import { useState, ReactNode } from "react";

interface CollapsibleSidebarProps {
  children: ReactNode;
  title?: string;
}

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  children,
  title = "Bộ lọc tìm kiếm",
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <aside className="lg:w-1/4" role="complementary">
      <div className="bg-white rounded-lg shadow-md sticky top-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="lg:hidden w-full p-4 flex items-center justify-between text-gray-800 hover:bg-gray-50 rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-expanded={!isCollapsed}
          aria-controls="search-filters"
          type="button"
        >
          <div className="flex items-center gap-2 m-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
              />
            </svg>
            <span className="text-lg font-bold">{title}</span>
          </div>

          {/* Chevron icon */}
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${
              isCollapsed ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Filter Content */}
        <div
          id="search-filters"
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isCollapsed ? "max-h-0 lg:max-h-none" : "max-h-screen"
          }`}
        >
          <div className="p-6 lg:pt-6 pt-0">
            {/* Desktop title - ẩn trên mobile */}
            <h2 className="hidden lg:flex text-xl font-bold text-gray-800 mb-4 items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                />
              </svg>
              {title}
            </h2>

            {/* Render children content */}
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
};
