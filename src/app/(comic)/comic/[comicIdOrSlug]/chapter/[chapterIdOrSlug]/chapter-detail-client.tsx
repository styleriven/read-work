"use client";
import { UserOutlined, SettingOutlined, BookOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import ChapterNavigation from "../chapter-navigation";
import Loading from "@/components/ui/loading";
import { Button } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { generateComicUrl } from "@/lib/uitls/seo";
import { StructuredData } from "@/components/seo/StructuredData";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { div } from "framer-motion/dist/m";

interface ChapterDetailClientProps {
  initialChapter: {
    chapter: any;
    comic?: {
      id?: string;
      slug?: string;
      title?: string;
      coverImage?: string;
      authorName?: string;
    };
    prevChapter?: { id: string; name?: string };
    nextChapter?: { id: string; name?: string };
  };
}

export default function ChapterDetailClient({
  initialChapter,
}: ChapterDetailClientProps) {
  const [chapter, setChapter] = useState<any>(initialChapter.chapter);
  const [prevChapter, setPrevChapter] = useState<
    { id: string; name?: string; slug?: string } | undefined
  >(initialChapter.prevChapter);
  const [nextChapter, setNextChapter] = useState<
    { id: string; name?: string; slug?: string } | undefined
  >(initialChapter.nextChapter);
  const [comic, setComic] = useState<any>(initialChapter.comic);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([
    { name: "Trang chủ", url: "/" },
    { name: comic?.title, url: generateComicUrl(comic?.slug || "") },
    { name: `Chương ${chapter?.chapterNumber}` },
  ]);

  const router = useRouter();
  const url = usePathname();
  const fetchData = async () => {
    setIsLoading(true);
    setChapter(initialChapter.chapter);
    setPrevChapter(initialChapter.prevChapter);
    setNextChapter(initialChapter.nextChapter);
    setComic(initialChapter.comic);
    setBreadcrumbs([
      { name: "Trang chủ", url: "/" },
      {
        name: initialChapter?.comic?.title,
        url: generateComicUrl(initialChapter?.comic?.slug || ""),
      },
      { name: `Chương ${initialChapter?.chapter?.chapterNumber}` },
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [initialChapter]);

  const handlePrevious = () => {
    if (isLoading === true) return;
    setIsLoading(true);

    router.push(`${url.replace(/\/[^\/]+$/, "")}/${prevChapter?.slug}`);
  };

  const handleNext = () => {
    if (isLoading === true) return;
    setIsLoading(true);
    router.push(`${url.replace(/\/[^\/]+$/, "")}/${nextChapter?.slug}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <Loading styleIcon={{ fontSize: "5rem" }} />
        <span className="mt-4 text-lg">Đang tải thông tin truyện...</span>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="text-center">
          <BookOutlined className="text-6xl text-gray-400 mb-4" />
          <p className="text-gray-600">Chương này không tồn tại</p>
          <span className="text-gray-500">
            Chương này có thể đã bị xóa hoặc bạn không có quyền truy cập.
          </span>
          <div className="mt-6 gap-4 flex justify-center">
            <Button onClick={() => router.back()}>Quay lại</Button>
            <Button type="primary" onClick={() => router.push("/")}>
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <StructuredData
        comic={comic}
        chapter={chapter}
        type="chapter"
        breadcrumbs={breadcrumbs}
      />
      <div className="flex-grow bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Breadcrumb items={breadcrumbs} className="mb-6" />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Chương {chapter.chapterNumber}
              </h1>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <UserOutlined />
                  {comic?.authorName || chapter?.author?.userName}
                </div>
                <div className="flex items-center gap-1">
                  <SettingOutlined />
                  Cài Đặt
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Navigation */}
          <ChapterNavigation
            comicId={chapter?.comicId}
            chapterNumber={chapter?.chapterNumber}
            onPrevious={prevChapter ? handlePrevious : undefined}
            onNext={nextChapter ? handleNext : undefined}
            isLoading={isLoading}
          />

          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-xl text-black font-bold mb-6 text-center">
                {chapter?.title}
              </h2>
              {chapter?.content && (
                <div className="text-gray-800 leading-relaxed">
                  {chapter?.content
                    .split("\n\n")
                    .map((paragraph: any, index: number) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="text-center text-sm text-gray-500 mt-4">
            Sử dụng mũi tên trái (←) hoặc phải (→) để chuyển chương
          </div>

          <ChapterNavigation
            comicId={chapter?.comicId}
            chapterNumber={chapter?.chapterNumber}
            onPrevious={prevChapter ? handlePrevious : undefined}
            onNext={nextChapter ? handleNext : undefined}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}
