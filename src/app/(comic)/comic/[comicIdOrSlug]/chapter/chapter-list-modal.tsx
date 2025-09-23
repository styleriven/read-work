import { Modal, Button, List } from "antd";
import { BookOutlined, CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import "@ant-design/v5-patch-for-react-19";

export default function ChapterListModal({
  visible,
  onClose,
  chapterList = [],
  currentChapter,
}: {
  visible: boolean;
  onClose: () => void;
  chapterList: any[];
  currentChapter: number;
}) {
  const [sortOrder, setSortOrder] = useState("asc");
  const router = useRouter();
  const url = usePathname();
  const sortedChapterList = [...chapterList].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.chapterNumber - b.chapterNumber;
    } else {
      return b.chapterNumber - a.chapterNumber;
    }
  });

  const handleSortToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleChapterClick = (chapter: any) => {
    router.push(`${url.replace(/\/[^\/]+$/, "")}/${chapter?.slug}`);
    onClose();
  };

  return (
    <Modal
      title={
        <h2 className="text-lg font-semibold text-gray-800 mb-0">
          Danh Sách Chương
        </h2>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
      closeIcon={<CloseOutlined style={{ fontSize: "18px", color: "#999" }} />}
      className="chapter-list-modal"
    >
      {/* Sort buttons */}
      <div className="px-6 py-3 flex justify-end border-b border-gray-100">
        <div className="flex gap-2">
          <Button
            size="small"
            type={sortOrder === "asc" ? "primary" : "default"}
            onClick={handleSortToggle}
            className="text-xs"
          >
            Cũ nhất
          </Button>
          <Button
            size="small"
            type={sortOrder === "desc" ? "primary" : "default"}
            onClick={handleSortToggle}
            className="text-xs"
          >
            Mới nhất
          </Button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        <List
          dataSource={sortedChapterList}
          renderItem={(chapter) => (
            <List.Item
              className={`px-6 py-3 border-0 cursor-pointer transition-colors hover:bg-gray-50 ${
                currentChapter === chapter.chapterNumber
                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                  : ""
              }`}
              onClick={() => handleChapterClick(chapter)}
            >
              <div
                className={`w-full ${
                  currentChapter === chapter.chapterNumber ? "ml-2" : ""
                }`}
              >
                <div className="text-sm text-gray-600 mb-1">
                  Chương {chapter.chapterNumber}
                </div>
                <div
                  className={`text-sm ${
                    currentChapter === chapter.chapterNumber
                      ? "text-blue-600 font-medium"
                      : "text-gray-800"
                  }`}
                >
                  {chapter.title}
                </div>
              </div>
            </List.Item>
          )}
          locale={{
            emptyText: (
              <div className="py-8">
                <BookOutlined className="text-4xl text-gray-300 mb-2" />
                <div>không có chapter nào</div>
              </div>
            ),
          }}
        />
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-100 text-right">
        <Button onClick={onClose} className="text-sm">
          Đóng
        </Button>
      </div>
    </Modal>
  );
}
