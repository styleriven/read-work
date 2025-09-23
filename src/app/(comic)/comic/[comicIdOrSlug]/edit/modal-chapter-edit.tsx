import { useEffect, useState } from "react";
import { BookOutlined, SaveOutlined } from "@ant-design/icons";
import { IChapter } from "@models/interfaces/i-chapter";
import {
  Modal,
  Form,
  InputNumber,
  Input,
  Space,
  Button,
  Checkbox,
  DatePicker,
} from "antd";
import dayjs from "dayjs";

export default function ModalChapterEdit({
  editingChapter,
  isChapterModalOpen,
  handleChapterSubmit,
  onCancel,
}: {
  editingChapter: IChapter | null;
  isChapterModalOpen: boolean;
  handleChapterSubmit: (values: Partial<IChapter>) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [chapterForm] = Form.useForm<IChapter>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isChapterModalOpen) {
      if (editingChapter) {
        const { chapterNumber, title, content, publishedAt, isPremium } =
          editingChapter;
        const formattedDate = publishedAt ? dayjs(publishedAt) : undefined;
        chapterForm.setFieldsValue({
          chapterNumber,
          title,
          content,
          isPremium,
          publishedAt: formattedDate,
        });
      } else {
        chapterForm.resetFields();
      }
    }
  }, [editingChapter, chapterForm, isChapterModalOpen]);

  const onFinish = async (values: IChapter & { publishedAt?: any }) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        publishedAt: values.publishedAt
          ? dayjs(values.publishedAt).toDate()
          : undefined,
      };

      await handleChapterSubmit(payload);
      handleCancel();
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel();
    chapterForm.resetFields();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <BookOutlined className="text-blue-500" />
          <span>
            {editingChapter ? "Chỉnh sửa Chapter" : "Thêm Chapter mới"}
          </span>
        </div>
      }
      open={isChapterModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnHidden
    >
      <Form
        form={chapterForm}
        layout="vertical"
        onFinish={onFinish}
        size="large"
      >
        <Form.Item
          label="Số thứ tự Chapter"
          name="chapterNumber"
          rules={[
            { required: true, message: "Vui lòng nhập số chapter" },
            { type: "number", min: 1, message: "Số chapter phải lớn hơn 0" },
          ]}
        >
          <InputNumber
            className="w-full"
            placeholder="Nhập số thứ tự chapter..."
            min={1}
          />
        </Form.Item>

        <Form.Item
          label="Tiêu đề Chapter"
          name="title"
          rules={[
            { required: true, message: "Vui lòng nhập tiêu đề chapter" },
            { min: 3, message: "Tiêu đề phải có ít nhất 3 ký tự" },
            { max: 200, message: "Tiêu đề không quá 200 ký tự" },
          ]}
        >
          <Input
            placeholder="Nhập tiêu đề chapter..."
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Form.Item
          label="Nội dung Chapter"
          name="content"
          rules={[
            { required: true, message: "Vui lòng nhập nội dung chapter" },
            { min: 3, message: "Nội dung phải có ít nhất 3 ký tự" },
          ]}
        >
          <Input.TextArea
            placeholder="Nhập nội dung chapter..."
            rows={4}
            showCount
          />
        </Form.Item>

        <Form.Item label="Chọn thời gian xuất bản" name="publishedAt">
          <DatePicker
            showTime={{
              defaultValue: dayjs("00:00", "HH:mm"),
            }}
            format="HH:mm DD-MM-YYYY"
            placeholder="Chọn thời gian xuất bản"
            className="w-full"
            showToday={false}
          />
        </Form.Item>

        <Form.Item name="isPremium" valuePropName="checked">
          <Checkbox>Chỉ dành cho Premium</Checkbox>
        </Form.Item>

        <Form.Item className="mb-0 text-right">
          <Space>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              className="bg-blue-600 hover:bg-blue-700"
              loading={loading}
            >
              {editingChapter ? "Cập nhật" : "Thêm Chapter"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
