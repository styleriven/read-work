// app/search/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";
import SearchResults from "./components/SearchResults";
import SearchFilters from "./components/SearchFilters";
import SearchPagination from "./components/SearchPagination";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { ComicQuery } from "@/lib/server/queries/comic-query";
import { SearchFilterOptions, SearchPageProps } from "@/types/search";

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || "";
  const page = parseInt(params.page || "1");
  const categories = params.categories || "";
  const status = params.status || "";

  // Clean query string cho canonical URL
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== ""
    )
  );
  const queryString = new URLSearchParams(
    cleanParams as Record<string, string>
  ).toString();

  // Dynamic title & description
  let title = "Tìm kiếm truyện tranh - Manga, Manhwa, Manhua";
  let description =
    "Tìm kiếm và khám phá hàng nghìn bộ truyện tranh manga, manhwa, manhua chất lượng cao. Đọc truyện online miễn phí, cập nhật liên tục.";

  if (query) {
    title = `Tìm kiếm "${query}" - Trang ${page} | Truyện tranh online`;
    description = `Kết quả tìm kiếm cho "${query}" trang ${page}. Khám phá các bộ truyện tranh manga, manhwa, manhua phù hợp với từ khóa của bạn.`;
  }
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const currentUrl = `${baseUrl}/search${queryString ? `?${queryString}` : ""}`;

  // Previous/Next pages for pagination
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < 100 ? page + 1 : null; // Giả sử max 100 trang

  const prevUrl = prevPage
    ? `${baseUrl}/search?${new URLSearchParams({
        ...cleanParams,
        page: prevPage.toString(),
      })}`
    : null;

  const nextUrl = nextPage
    ? `${baseUrl}/search?${new URLSearchParams({
        ...cleanParams,
        page: nextPage.toString(),
      })}`
    : null;

  // JSON-LD Schema
  const searchActionSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tìm kiếm",
        item: `${baseUrl}/search`,
      },
      ...(query
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: `"${query}"`,
              item: currentUrl,
            },
          ]
        : []),
    ],
  };

  const searchResultsSchema = query
    ? {
        "@context": "https://schema.org",
        "@type": "SearchResultsPage",
        url: currentUrl,
        name: title,
        description: description,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: "{{SEARCH_COUNT}}", // Sẽ được replace runtime
        },
      }
    : null;

  return {
    title,
    description,
    keywords: [
      "truyện tranh",
      "manga",
      "manhwa",
      "manhua",
      "đọc truyện online",
      "truyện tranh online",
      query && `truyện ${query}`,
      "truyện tranh miễn phí",
    ]
      .filter(Boolean)
      .join(", "),

    authors: [{ name: "Tên Website" }],
    creator: "Trung Huy",
    publisher: "Tên Website",

    openGraph: {
      title,
      description,
      type: "website",
      url: currentUrl,
      siteName: "Tên Website - Đọc truyện tranh online",
      images: [
        {
          url: `${baseUrl}/og-search.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "vi_VN",
    },

    twitter: {
      card: "summary_large_image",
      site: "@yoursite",
      creator: "@yoursite",
      title,
      description,
      images: [`${baseUrl}/og-search.jpg`],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    alternates: {
      canonical: currentUrl,
      languages: {
        "vi-VN": currentUrl,
        "x-default": currentUrl,
      },
    },

    other: {
      // JSON-LD Schemas
      "script:ld+json:search": JSON.stringify(searchActionSchema),
      "script:ld+json:breadcrumb": JSON.stringify(breadcrumbSchema),
      ...(searchResultsSchema && {
        "script:ld+json:results": JSON.stringify(searchResultsSchema),
      }),

      // Pagination
      ...(prevUrl && { "link:prev": prevUrl }),
      ...(nextUrl && { "link:next": nextUrl }),

      // Additional meta tags
      "theme-color": "#3b82f6",
      "color-scheme": "light",
      "format-detection": "telephone=no",
    },

    // Verification tags (thay bằng ID thực tế)
    verification: {
      google: "your-google-site-verification",
      yandex: "your-yandex-verification",
      other: {
        "msvalidate.01": "your-bing-verification",
      },
    },
  };
}

async function getSearchData(
  searchParams: Awaited<SearchPageProps["searchParams"]>
) {
  try {
    const cleanParams = Object.fromEntries(
      Object.entries(searchParams).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );

    const queryString = new URLSearchParams(
      cleanParams as Record<string, string>
    ).toString();

    const [searchData, filtersData] = await Promise.all([
      ComicQuery.searchComics(queryString),
      ComicQuery.getFilterOptions(),
    ]);

    if (!searchData) {
      throw new Error("Failed to fetch search results");
    }
    return {
      searchData,
      filtersData: filtersData?.filterOptions as SearchFilterOptions,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching search data:", error);
    return {
      searchData: null,
      filtersData: null,
      error: "Không thể tải dữ liệu tìm kiếm. Vui lòng thử lại sau.",
    };
  }
}

// Component để inject JSON-LD runtime
function SearchSchemas({
  searchData,
  query,
  currentUrl,
}: {
  searchData: any;
  query: string;
  currentUrl: string;
}) {
  if (!query || !searchData) return null;

  const searchResultsSchema = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    url: currentUrl,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: searchData?.totalCount || 0,
      itemListElement:
        searchData?.data?.slice(0, 5).map((comic: any, index: number) => ({
          "@type": "Book",
          position: index + 1,
          name: comic.title,
          description: comic.description,
          image: comic.thumbnail,
          url: `${process.env.NEXT_PUBLIC_APP_URL}/comic/${comic.slug}`,
          genre: comic.categories?.map((cat: any) => cat.name),
        })) || [],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(searchResultsSchema),
      }}
    />
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const { searchData, filtersData, error } = await getSearchData(params);
  const currentPage = parseInt(params.page || "1");
  const hasQuery = Boolean(params.q?.trim());
  const currentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/search${
    Object.keys(params).length > 0
      ? "?" + new URLSearchParams(params as Record<string, string>)
      : ""
  }`;

  return (
    <>
      {/* Runtime JSON-LD injection */}
      <SearchSchemas
        searchData={searchData}
        query={params.q || ""}
        currentUrl={currentUrl}
      />

      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-1/4" role="complementary">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
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
                Bộ lọc tìm kiếm
              </h2>

              {error ? (
                <div className="text-red-500 text-sm" role="alert">
                  Không thể tải bộ lọc
                </div>
              ) : (
                <Suspense
                  fallback={
                    <div className="space-y-4" aria-label="Đang tải bộ lọc">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-8 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  }
                >
                  <SearchFilters
                    filterOptions={filtersData}
                    currentFilters={params}
                  />
                </Suspense>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4" role="main">
            {/* Search Header */}
            <header className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {hasQuery ? `Tìm kiếm: "${params.q}"` : "Tìm kiếm truyện tranh"}
              </h1>

              {searchData && (
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1" role="status">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Tìm thấy{" "}
                    <strong>
                      {searchData?.totalCount || searchData?.data?.length || 0}
                    </strong>{" "}
                    kết quả
                  </span>

                  {searchData?.totalCount > 0 && (
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h3a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z"
                        />
                      </svg>
                      Trang <strong>{currentPage}</strong>
                    </span>
                  )}
                </div>
              )}
            </header>

            {/* Error State */}
            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3"
                role="alert"
                aria-live="assertive"
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-medium">Có lỗi xảy ra</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Search Results */}
            <section aria-label="Kết quả tìm kiếm">
              <Suspense fallback={<LoadingSkeleton />}>
                {searchData ? (
                  <>
                    <SearchResults
                      comics={searchData.data}
                      currentFilters={params}
                    />

                    {searchData?.totalCount > searchData?.limit && (
                      <nav
                        className="mt-8"
                        aria-label="Phân trang kết quả tìm kiếm"
                      >
                        <SearchPagination
                          pagination={{
                            limit: searchData.limit,
                            totalCount: searchData.totalCount,
                            currentPage: currentPage,
                          }}
                        />
                      </nav>
                    )}
                  </>
                ) : (
                  !error && (
                    <div className="text-center py-16">
                      <svg
                        className="w-24 h-24 mx-auto text-gray-300 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <h3 className="text-xl font-medium text-gray-400 mb-2">
                        Không tìm thấy kết quả nào
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {hasQuery
                          ? `Không có truyện nào phù hợp với từ khóa "${params.q}"`
                          : "Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc"}
                      </p>
                      {hasQuery && (
                        <button
                          onClick={() => window.history.back()}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          aria-label="Quay lại trang trước"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                          </svg>
                          Quay lại
                        </button>
                      )}
                    </div>
                  )
                )}
              </Suspense>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
