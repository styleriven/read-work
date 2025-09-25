"use client";
import { useEffect, useState } from "react";
import {
  LeftOutlined,
  OrderedListOutlined,
  RightOutlined,
} from "@ant-design/icons";
import ChapterListModal from "./chapter-list-modal";
import { ChapterQuery } from "@/lib/server/queries/chapter-query";
import { Button } from "antd";

export default function ChapterNavigation({
  comicId,
  chapterNumber,
  onPrevious,
  onNext,
  isLoading,
}: {
  comicId: string;
  chapterNumber: number;
  onPrevious?: () => void;
  onNext?: () => void;
  isLoading: boolean;
}) {
  const [showModal, setShowModal] = useState(false);
  const [chapterList, setChapterList] = useState<any[]>([]);
  const [loadingChapterList, setLoadingChapterList] = useState(false);

  const handleShowChapterList = async () => {
    if (!chapterList || chapterList.length === 0) {
      setLoadingChapterList(true);
      try {
        const data = await ChapterQuery.getChapterSummaryByComicId(
          comicId,
          undefined,
          undefined,
          undefined,
          true
        );
        setChapterList(data.data);
      } catch (error) {
        console.error("Error fetching chapter list:", error);
      } finally {
        setLoadingChapterList(false);
      }
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="w-full flex items-center justify-between mb-6">
        <Button
          onClick={onPrevious}
          disabled={isLoading}
          className={`bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white  py-3 rounded-lg 
            font-semibold transition-colors disabled:cursor-not-allowed flex items-center gap-2 justify-center truncate
            ${onPrevious ? "opacity-100" : "opacity-0 cursor-default"}`}
        >
          <LeftOutlined className="w-5 h-5" />
          Chương Trước
        </Button>

        <Button
          onClick={handleShowChapterList}
          loading={loadingChapterList}
          className="bg-gray-500 hover:bg-gray-600 text-white  rounded-lg transition-colors gap-2 pb-2"
        >
          <OrderedListOutlined className="pt-2" />
        </Button>

        <Button
          onClick={onNext}
          disabled={isLoading}
          className={`bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 rounded-lg
            font-semibold transition-colors disabled:cursor-not-allowed flex items-center gap-2 truncate
            ${onNext ? "opacity-100" : "opacity-0 cursor-default"}`}
        >
          Chương Tiếp
          <RightOutlined className="w-5 h-5" />
        </Button>
      </div>

      <ChapterListModal
        visible={showModal}
        onClose={handleCloseModal}
        chapterList={chapterList}
        currentChapter={chapterNumber}
      />
    </>
  );
}
