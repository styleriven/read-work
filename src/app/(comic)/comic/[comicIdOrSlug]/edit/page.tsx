"use client";
import { useEffect, useState } from "react";
import {
  BookOutlined,
  UserOutlined,
  SaveOutlined,
  InfoCircleOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Input,
  Select,
  SelectProps,
  Tooltip,
  Upload,
  UploadProps,
  Row,
  Col,
  Typography,
  Avatar,
  Space,
  Progress,
  Image,
  Form,
  Modal,
  Divider,
  Pagination,
  Table,
  Popconfirm,
  InputNumber,
  Tag,
} from "antd";
import { useSession } from "next-auth/react";
import Loading from "@/components/ui/loading";
import { notify } from "@/components/ui/notify";
import { CategoryQuery } from "@/lib/server/queries/category-query";
import { ComicQuery } from "@/lib/server/queries/comic-query";
import { REQUEST_URLS_V1 } from "@/config/request-urls";
import { useParams, useRouter } from "next/navigation";
import { IComic } from "@models/interfaces/i-comic";
import { ChapterQuery } from "@/lib/server/queries/chapter-query";
import { IChapter } from "@models/interfaces/i-chapter";
import ModalChapterEdit from "./modal-chapter-edit";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

interface ComicFormValues {
  title?: string;
  description?: string;
  authorName?: string;
  type?: string;
  category?: string[];
  coverImage?: string;
}

export default function EditComicPage() {
  const params = useParams();
  const comicIdOrSlug = params.comicIdOrSlug as string;
  const router = useRouter();

  const [form] = Form.useForm<ComicFormValues>();

  const { data: session, status } = useSession();
  const user = session?.user;

  const [totalChapters, setTotalChapters] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [comic, setComic] = useState<IComic>();
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [originalValues, setOriginalValues] = useState<ComicFormValues>({});
  const [imageUrl, setImageUrl] = useState<string>();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categoriesOptions, setCategoriesOptions] = useState<
    SelectProps["options"]
  >([]);

  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<IChapter | null>(null);

  const typeComic = [
    { value: "suu-tam", label: "Sưu Tầm" },
    { value: "sang-tac", label: "Sáng Tác" },
    { value: "tu-dich", label: "Tự Dịch" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [comicData, categoriesData] = await Promise.all([
          ComicQuery.getComicByIdOrSlug(comicIdOrSlug),
          CategoryQuery.getAll(),
        ]);

        if (Array.isArray(categoriesData)) {
          setCategoriesOptions(
            categoriesData.map((cat) => ({
              label: cat.name,
              value: cat.id,
            }))
          );
        }
        setComic(comicData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        notify({
          type: "error",
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải thông tin truyện và danh mục.",
        });
      }
    };

    if (comicIdOrSlug) {
      fetchData();
    }
  }, [comicIdOrSlug]);

  useEffect(() => {
    if (!user || status === "loading" || !comic) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (!comic?.authorId.includes(user.id)) {
          setIsAuthor(false);
          notify({
            type: "error",
            title: "Không có quyền truy cập",
            description: "Bạn không có quyền chỉnh sửa truyện này.",
          });
          return;
        }

        setIsAuthor(true);
        setImageUrl(comic.coverImage);

        const formValues = {
          title: comic.title,
          description: comic.description,
          authorName: comic.authorName,
          type: comic.type,
          category: comic.categoryId,
          coverImage: comic.coverImage,
        };

        form.setFieldsValue(formValues);
        setOriginalValues(formValues);
      } catch (error) {
        console.error("Error fetching data:", error);
        notify({
          type: "error",
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải thông tin truyện. Vui lòng thử lại.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [comic, user, form]);

  // Fetch chapters
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await ChapterQuery.getChaptersByComicId(
          comic?.id,
          "",
          currentPage,
          pageSize
        );
        setChapters(response.data);
        setTotalChapters(response.totalCount);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    if (comic && isAuthor) {
      fetchChapters();
    }
  }, [comic, currentPage, pageSize, isAuthor]);

  // Upload handlers
  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isLt5M = file.size / 1024 / 1024 < 5;

    if (!isImage) {
      notify({
        type: "error",
        title: "Định dạng không hỗ trợ",
        description: "Vui lòng chọn file ảnh (jpg, png, jpeg, webp...)",
      });
      return false;
    }

    if (!isLt5M) {
      notify({
        type: "error",
        title: "File quá lớn",
        description: "Kích thước ảnh phải nhỏ hơn 5MB",
      });
      return false;
    }

    return true;
  };

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setUploadProgress(info.file.percent || 0);
    }

    if (info.file.status === "done") {
      const url = info.file.response?.url;
      if (url) {
        setImageUrl(url);
        form.setFieldValue("coverImage", url);
        setUploadProgress(0);
        notify({
          type: "success",
          title: "Tải ảnh thành công",
          description: "Ảnh bìa đã được cập nhật!",
        });
      }
    } else if (info.file.status === "error") {
      setUploadProgress(0);
      notify({
        type: "error",
        title: "Tải ảnh thất bại",
        description: "Có lỗi xảy ra khi tải ảnh. Vui lòng thử lại!",
      });
    }
  };

  // Form handlers
  const handleSubmit = async (values: ComicFormValues) => {
    if (!imageUrl) {
      return notify({
        type: "error",
        title: "Thiếu ảnh bìa",
        description: "Vui lòng tải ảnh bìa truyện!",
      });
    }

    if (isLoadingSubmit) return;
    setIsLoadingSubmit(true);

    try {
      const formData = {
        ...values,
        coverImage: imageUrl,
      };

      const data = await ComicQuery.updateComic(comic?.id, formData);
      setComic(data);
      notify({
        type: "success",
        title: "Cập nhật thành công",
        description: "Thông tin truyện đã được cập nhật!",
      });

      setOriginalValues(formData);

      // Navigate back after short delay
      setTimeout(() => {
        router.push(`/comic/${data?.slug}`);
      }, 1000);
    } catch (err) {
      console.error("Update error:", err);
      notify({
        type: "error",
        title: "Cập nhật thất bại",
        description: "Có lỗi xảy ra khi cập nhật truyện. Vui lòng thử lại!",
      });
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const resetForm = () => {
    form.setFieldsValue(originalValues);
    setImageUrl(originalValues.coverImage);
  };

  const handleCancel = () => {
    confirm({
      title: "Bạn có chắc muốn hủy?",
      content: "Các thay đổi chưa lưu sẽ bị mất.",
      onOk() {
        router.push(`/comic/${comic?.slug}`);
      },
    });
  };

  const handleAddChapter = () => {
    setEditingChapter(null);
    setIsChapterModalOpen(true);
  };

  const handleEditChapter = (chapter: IChapter) => {
    setEditingChapter(chapter);
    setIsChapterModalOpen(true);
  };

  const handleViewChapter = (chapterIdOrSlug: string) => {
    window.open(
      `/comic/${comic?.slug}/chapter/${chapterIdOrSlug}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleDeleteChapter = async (chapterId: string) => {
    try {
      // await ChapterQuery.deleteChapter(chapterId);
      setChapters((prev) => prev.filter((chapter) => chapter.id !== chapterId));
      setTotalChapters((prev) => prev - 1);
      notify({
        type: "success",
        title: "Thành công",
        description: "Chapter đã được xóa thành công!",
      });
    } catch (error) {
      console.error("Error deleting chapter:", error);
      notify({
        type: "error",
        title: "Lỗi",
        description: "Xóa chapter thất bại.",
      });
    }
  };

  const handleChapterSubmit = async (values: Partial<IChapter>) => {
    try {
      if (editingChapter) {
        // Update existing chapter

        const updatedChapter = { ...editingChapter, ...values };
        await ChapterQuery.updateChapter(editingChapter.id, updatedChapter);

        setChapters((prev) =>
          prev.map((chapter) =>
            chapter.id === editingChapter.id
              ? ({ ...chapter, ...values } as IChapter)
              : chapter
          )
        );
        notify({
          type: "success",
          title: "Thành công",
          description: "Chapter đã được cập nhật thành công!",
        });
      } else {
        // Create new chapter
        const newChapterData = {
          ...values,
          comicId: comic?.id,
        };
        const createdChapter = await ChapterQuery.createChapter(newChapterData);

        setChapters((prev) => [...prev, createdChapter]);
        setTotalChapters((prev) => prev + 1);
        notify({
          type: "success",
          title: "Thành công",
          description: "Chapter đã được thêm thành công!",
        });
      }
      setIsChapterModalOpen(false);
    } catch (error) {
      console.error("Error saving chapter:", error);
      notify({
        type: "error",
        title: "Lỗi",
        description: "Lưu chapter thất bại.",
      });
    }
  };

  const chapterColumns = [
    {
      title: "Số Chapter",
      dataIndex: "chapterNumber",
      key: "chapterNumber",
      width: 120,
      sorter: (a: IChapter, b: IChapter) => a.chapterNumber - b.chapterNumber,
      showSorterTooltip: false,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      render: (date: string) => dayjs(date).format("DD/MM/YY"),
    },
    {
      title: "Xuất bản",
      dataIndex: "publishedAt",
      key: "publishedAt",
      width: 130,
      render: (date: string) => (
        <span title={date ? dayjs(date).format("HH:mm") : "Chưa xuất bản"}>
          {date ? dayjs(date).format("DD/MM/YY") : "Chưa xuất bản"}
        </span>
      ),
    },
    {
      title: "Premium",
      dataIndex: "isPremium",
      key: "isPremium",
      width: 90,
      render: (isPremium: boolean) =>
        isPremium ? (
          <Tag color="gold">Premium</Tag>
        ) : (
          <Tag color="default">Miễn phí</Tag>
        ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 110,
      render: (record: IChapter) => (
        <Space size="small">
          <Tooltip title="Xem chapter">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewChapter(record.slug || record.id)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditChapter(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa chapter"
            description="Bạn có chắc muốn xóa chapter này?"
            onConfirm={() => handleDeleteChapter(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Loading state
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <Loading styleIcon={{ fontSize: "5rem" }} />
        <Text className="mt-4 text-lg">Đang tải thông tin truyện...</Text>
      </div>
    );
  }

  // Comic not found
  if (!comic) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="text-center">
          <BookOutlined className="text-6xl text-gray-400 mb-4" />
          <Title level={3} className="text-gray-600">
            Truyện không tồn tại
          </Title>
          <Text className="text-gray-500">
            Truyện này có thể đã bị xóa hoặc bạn không có quyền truy cập.
          </Text>
          <div className="mt-6">
            <Button type="primary" onClick={() => router.push("/")}>
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Unauthorized access
  if (!isAuthor) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="text-center">
          <ExclamationCircleOutlined className="text-6xl text-red-500 mb-4" />
          <Title level={3} className="text-gray-600">
            Không có quyền truy cập
          </Title>
          <Text className="text-gray-500">
            Bạn không có quyền chỉnh sửa truyện này.
          </Text>
          <div className="mt-6">
            <Space>
              <Button onClick={() => router.back()}>Quay lại</Button>
              <Button
                type="primary"
                onClick={() => router.push(`/comic/${comic.slug}`)}
              >
                Xem truyện
              </Button>
            </Space>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 justify-center">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                size={48}
                icon={<EditOutlined />}
                className="bg-orange-500"
              />
              <div>
                <Title level={2} className="mb-0">
                  Chỉnh sửa truyện
                </Title>
                <Text className="text-gray-600">
                  Cập nhật thông tin "{comic?.title}"
                </Text>
              </div>
            </div>
          </div>
        </div>

        <Row gutter={[10, 10]}>
          {/* Main Form */}
          <Col xs={24} lg={18}>
            <Card
              title={
                <div className="flex items-center gap-2">
                  <BookOutlined className="text-blue-500" />
                  <span>Thông tin truyện</span>
                </div>
              }
              className="shadow-sm"
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                size="large"
                onValuesChange={() => {}}
              >
                <Form.Item label="Ảnh bìa truyện" required>
                  <div className="flex flex-col items-center">
                    <Upload
                      name="file"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action={`${process.env.NEXT_PUBLIC_BACKEND_URL}${REQUEST_URLS_V1.UPLOAD}`}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      accept="image/*"
                      style={{
                        width: "150px",
                        height: "200px",
                      }}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Cover preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <BookOutlined
                            style={{ fontSize: 24, color: "#999" }}
                          />
                          <div style={{ marginTop: 8, color: "#999" }}>
                            Tải ảnh bìa
                          </div>
                        </div>
                      )}
                    </Upload>

                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <Progress
                        percent={uploadProgress}
                        size="small"
                        className="mt-2 w-full max-w-xs"
                      />
                    )}
                  </div>
                </Form.Item>

                <Form.Item
                  label="Tên truyện"
                  name="title"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên truyện" },
                    { min: 2, message: "Tên truyện phải có ít nhất 2 ký tự" },
                    { max: 100, message: "Tên truyện không quá 100 ký tự" },
                  ]}
                >
                  <Input
                    placeholder="Nhập tên truyện..."
                    prefix={<BookOutlined className="text-gray-400" />}
                    showCount
                    maxLength={100}
                  />
                </Form.Item>

                <Form.Item
                  label="Mô tả truyện"
                  name="description"
                  rules={[
                    { required: true, message: "Vui lòng nhập mô tả truyện" },
                    { min: 20, message: "Mô tả phải có ít nhất 20 ký tự" },
                    { max: 2000, message: "Mô tả không quá 2000 ký tự" },
                  ]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Nhập mô tả chi tiết về truyện..."
                    showCount
                    maxLength={2000}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Loại truyện"
                      name="type"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn loại truyện",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Chọn loại truyện"
                        options={typeComic}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Tác giả"
                      name="authorName"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên tác giả",
                        },
                        {
                          min: 2,
                          message: "Tên tác giả phải có ít nhất 2 ký tự",
                        },
                        { max: 50, message: "Tên tác giả không quá 50 ký tự" },
                      ]}
                    >
                      <Input
                        placeholder="Nhập tên tác giả..."
                        prefix={<UserOutlined className="text-gray-400" />}
                        showCount
                        maxLength={50}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Thể loại"
                  name="category"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ít nhất 1 thể loại",
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Chọn thể loại"
                    options={categoriesOptions}
                    maxTagCount="responsive"
                    maxTagPlaceholder={(omittedValues) => (
                      <Tooltip
                        title={omittedValues
                          .map(({ label }) => label)
                          .join(", ")}
                      >
                        <span>+{omittedValues.length} thể loại</span>
                      </Tooltip>
                    )}
                  />
                </Form.Item>

                <Form.Item className="mb-0">
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      icon={<SaveOutlined />}
                      loading={isLoadingSubmit}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isLoadingSubmit ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                    <Button size="large" onClick={resetForm}>
                      Hoàn tác
                    </Button>
                    <Button size="large" onClick={handleCancel}>
                      Hủy
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Preview & Tips */}
          <Col xs={24} lg={6}>
            <Space direction="vertical" size="large" className="w-full">
              {/* Preview Card */}
              <Card title="Xem trước" className="shadow-sm">
                <div className="text-center">
                  <Image
                    width="100%"
                    height={200}
                    src={imageUrl || "/default-cover.png"}
                    alt="Cover preview"
                    className="rounded-lg object-contain"
                    preview={false}
                  />

                  <div className="mt-4 text-left">
                    <Title level={5} ellipsis className="mb-1">
                      {form.getFieldValue("title") ||
                        comic?.title ||
                        "Tên truyện"}
                    </Title>
                    <Text className="text-gray-500 text-sm block mb-2">
                      {form.getFieldValue("authorName") ||
                        comic?.authorName ||
                        "Tác giả"}
                    </Text>
                    <Paragraph
                      ellipsis={{ rows: 3 }}
                      className="text-gray-600 text-sm"
                    >
                      {form.getFieldValue("description") ||
                        comic?.description ||
                        "Mô tả truyện sẽ hiển thị ở đây..."}
                    </Paragraph>
                  </div>
                </div>
              </Card>

              {/* Tips Card */}
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <InfoCircleOutlined className="text-orange-500" />
                    <span>Mẹo chỉnh sửa</span>
                  </div>
                }
                className="shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <Text className="text-sm">
                      Cập nhật ảnh bìa với chất lượng cao để thu hút độc giả
                    </Text>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <Text className="text-sm">
                      Viết mô tả hấp dẫn và súc tích để tạo ấn tượng tốt
                    </Text>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <Text className="text-sm">
                      Chọn đúng thể loại giúp độc giả dễ dàng tìm thấy truyện
                    </Text>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <Text className="text-sm">
                      Thông tin chính xác giúp xây dựng uy tín với độc giả
                    </Text>
                  </div>
                </div>
              </Card>

              <Card title="Thông tin gốc" size="small" className="shadow-sm">
                <div className="space-y-2 text-xs text-gray-600">
                  <div>
                    <Text strong>Ngày tạo:</Text>{" "}
                    {comic?.createdAt
                      ? `${dayjs(comic.createdAt).format("HH:mm DD/MM/YY")}`
                      : "N/A"}
                  </div>
                  <div>
                    <Text strong>Cập nhật:</Text>{" "}
                    {comic?.updatedAt
                      ? `${dayjs(comic.updatedAt).format("HH:mm DD/MM/YY")}`
                      : "N/A"}
                  </div>

                  <div>
                    <Text strong>ID:</Text> {comic?.id}
                  </div>
                </div>
              </Card>
            </Space>
          </Col>
        </Row>

        <Divider className="my-8" />
        <Card
          title={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOutlined className="text-green-500" />
                <span>Quản lý Chapters ({totalChapters})</span>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddChapter}
                className="bg-green-600 hover:bg-green-700"
              >
                Thêm Chapter
              </Button>
            </div>
          }
          className="shadow-sm"
        >
          <Table
            dataSource={chapters}
            columns={chapterColumns}
            rowKey="id"
            pagination={false}
            className="mb-4"
            scroll={{ x: 600 }}
            locale={{
              emptyText: (
                <div className="py-8">
                  <BookOutlined className="text-4xl text-gray-300 mb-2" />
                  <div>không có chapter nào</div>
                  <Button
                    type="link"
                    onClick={handleAddChapter}
                    className="mt-2"
                  >
                    Thêm chapter tại đây
                  </Button>
                </div>
              ),
            }}
          />

          {totalChapters > 0 && (
            <div className="flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalChapters}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          )}
        </Card>

        <ModalChapterEdit
          editingChapter={editingChapter}
          isChapterModalOpen={isChapterModalOpen}
          handleChapterSubmit={handleChapterSubmit}
          onCancel={() => {
            setIsChapterModalOpen(false);
            setEditingChapter(null);
          }}
        />
      </div>
    </div>
  );
}
