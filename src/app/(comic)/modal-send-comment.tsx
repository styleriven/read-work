"use client";
import { Mentions, Modal } from "antd";
import { useEffect, useRef, useState } from "react";

export default function ModalSendComment({
  id,
  name,
  isOpen,
  onOk,
  onCancel,
}: {
  isOpen: boolean;
  id?: string;
  name?: string;
  onOk: (content: string, id?: string, name?: string) => void;
  onCancel: () => void;
}) {
  const options = [
    {
      value: "afc1634",
      label: "afc1634",
    },
    {
      value: "zombieJ",
      label: "zombieJ",
    },
    {
      value: "yesmeck",
      label: "yesmeck",
    },
  ];

  const [content, setContent] = useState("");
  const mentionsRef = useRef<any>(null);
  const [userMentions, setUserMentions] = useState<string[]>([]);
  function handleOk() {
    if (content === null || content === "") {
      return;
    }
    onOk(content, id, name);
    handleCancel();
  }
  function handleCancel() {
    setContent("");
    setUserMentions([]);
    onCancel();
  }

  function HandleChangeComment(value: string) {
    if (value !== content) {
      setUserMentions((prev) => prev.filter((m) => value.includes(`@${m}`)));
    }
    setContent(value);
  }

  return (
    <Modal
      title="Gửi Bình Luận"
      open={isOpen}
      onOk={handleOk}
      okText="Gửi"
      cancelText="Hủy"
      onCancel={handleCancel}
      afterOpenChange={(open) => {
        if (open && mentionsRef.current) {
          mentionsRef.current.focus();
        }
      }}
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-600">
          {id && name ? (
            <>
              Trả lời <span className="font-semibold">{name}</span>
            </>
          ) : (
            "Bình luận về truyện"
          )}
        </p>
        <Mentions
          ref={mentionsRef}
          options={options}
          className="w-full text-base"
          autoSize={{ minRows: 1, maxRows: 6 }}
          placeholder="Nhập bình luận của bạn"
          value={content}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleOk();
            }
          }}
          onChange={(value) => {
            HandleChangeComment(value);
          }}
          onSelect={(option, position) => {
            if (!option.value) return;
            if (!userMentions.includes(option.value)) {
              setUserMentions([...userMentions, option.value]);
            }
          }}
        />
      </div>
    </Modal>
  );
}
