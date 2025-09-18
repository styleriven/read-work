import Avatar from "@/components/ui/avater";
import { comment } from "postcss";
import { useState } from "react";

export default function CommentCard({
  id,
  imageUrl,
  name,
  time,
  content,
  replies,
  depth = 0,
  maxDepth = 3,
  onReplyClick,
}: {
  id: string;
  imageUrl?: string;
  name: string;
  time: string;
  replies?: any[];
  content: string;
  depth?: number;
  maxDepth?: number;
  onReplyClick: (id: string, name: string) => void;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(depth < 2);
  const hasReplies = replies && replies.length > 0;

  const handleReplySubmit = (id: string, name: string) => {
    onReplyClick(id, name);
  };

  return (
    <div className={depth > 0 ? "ml-6 border-l-2 border-gray-100 pl-4" : ""}>
      <div className="flex gap-3 py-3">
        {/* Avatar */}
        <Avatar imageUrl={imageUrl} width={24} height={24} />

        <div className="flex-1 bg-gray-50 p-3 rounded-xl">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-baseline gap-2">
              <h4 className="font-semibold text-gray-800">{name}</h4>
              <p className="text-gray-500 text-xs">{time}</p>
            </div>
            <button
              onClick={() => handleReplySubmit(id, name)}
              className="text-gray-500 hover:text-blue-600 text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Trả Lời
            </button>
          </div>
          <p className="text-gray-800 text-sm">{content}</p>
        </div>
      </div>

      {hasReplies && (
        <div className="ml-9 mt-2">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            {showReplies ? "▲ Ẩn" : "▼ Xem"} {replies?.length} phản hồi
          </button>
        </div>
      )}

      {showReplies && hasReplies && (
        <div className="mt-3">
          {replies?.map((reply) => (
            <CommentCard
              id={reply.id}
              key={reply.id}
              imageUrl={reply.imageUrl}
              name={reply.name}
              time={reply.time}
              content={reply.content}
              replies={reply.replies}
              depth={depth + 1}
              onReplyClick={onReplyClick}
              maxDepth={maxDepth}
            />
          ))}
        </div>
      )}

      {hasReplies && depth >= maxDepth && (
        <div className="ml-9 mt-2">
          <button className="text-xs text-blue-600 hover:underline">
            Xem thêm {replies?.length} phản hồi →
          </button>
        </div>
      )}
    </div>
  );
}
