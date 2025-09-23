"use client";
import { use, useEffect, useState } from "react";
import {
  BookOutlined,
  FileTextOutlined,
  UserOutlined,
  TagsOutlined,
  PlusOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Alert,
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
} from "antd";
import { useSession } from "next-auth/react";
import Loading from "@/components/ui/loading";
import { notify } from "@/components/ui/notify";
import { CategoryQuery } from "@/lib/server/queries/category-query";
import { ComicQuery } from "@/lib/server/queries/comic-query";
import { REQUEST_URLS_V1 } from "@/config/request-urls";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/uitls/utils";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface ComicFormValues {
  title: string;
  description: string;
  authorName: string;
  type: string;
  category: string[];
}

export default function CreateComicPage() {
  const [form] = Form.useForm<ComicFormValues>();
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { data: session, status } = useSession();
  const user = session?.user;
  const [numberCreateUser, setNumberCreateUser] = useState(0);
  const [categoriesOptions, setCategoriesOptions] = useState<
    SelectProps["options"]
  >([]);

  const typeComic = [
    { value: "suu-tam", label: "Sưu Tầm" },
    { value: "sang-tac", label: "Sáng Tác" },
    { value: "tu-dich", label: "Tự Dịch" },
  ];

  useEffect(() => {
    if (!user) return;
    const timeDiff = Date.now() - new Date(user?.createdAt).getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    setNumberCreateUser(dayDiff);
  }, [user]);

  useEffect(() => {
    GetCategory();
  }, []);

  const GetCategory = async () => {
    try {
      const data = await CategoryQuery.getAll();
      if (Array.isArray(data)) {
        setCategoriesOptions(
          data.map((cat) => ({
            label: cat.name,
            value: cat.id,
          }))
        );
      }
    } catch (err) {
    } finally {
    }
  };

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

      const data = await ComicQuery.createComic(formData);
      // Reset form
      form.resetFields();
      setImageUrl(undefined);
    } catch (err) {
      console.error(err);
      notify({
        type: "error",
        title: "Có lỗi xảy ra!",
        description: "Đăng truyện không thành công, vui lòng thử lại!",
      });
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isLt5M = file.size / 1024 / 1024 < 5;

    if (!isImage) {
      notify({
        type: "error",
        title: "Chỉ được upload ảnh",
        description: "Vui lòng chọn file ảnh (jpg, png, jpeg...)",
      });
      return false;
    }

    if (!isLt5M) {
      notify({
        type: "error",
        title: "Ảnh quá lớn",
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
      setImageUrl(url);
      setUploadProgress(0);
      notify({
        type: "success",
        title: "Upload thành công",
        description: "Ảnh đã được tải lên!",
      });
    } else if (info.file.status === "error") {
      setUploadProgress(0);
      notify({
        type: "error",
        title: "Upload thất bại",
        description: "Vui lòng thử lại!",
      });
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loading styleIcon={{ fontSize: "5rem" }} />
        <Text className="mt-4 text-lg">Đang tải...</Text>
      </div>
    );
  }

  const canCreateComic = numberCreateUser >= 30;
  const progressPercent = Math.min((numberCreateUser / 30) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Avatar
              size={48}
              icon={<PlusOutlined />}
              className="bg-green-500"
            />
            <div>
              <Title level={2} className="mb-0">
                Đăng truyện mới
              </Title>
              <Text className="text-gray-600">
                Tạo và chia sẻ câu chuyện của bạn
              </Text>
            </div>
          </div>
        </div>

        {/* Account Status Alert */}
        {!canCreateComic && (
          <Alert
            message="Tài khoản chưa đủ điều kiện"
            description={
              <div className="mt-2">
                <Text>
                  Tài khoản phải đăng ký tối thiểu 30 ngày mới được đăng truyện.
                </Text>
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tiến độ: {numberCreateUser}/30 ngày</span>
                    <span>{Math.round(progressPercent)}%</span>
                  </div>
                  <Progress
                    percent={progressPercent}
                    status={canCreateComic ? "success" : "active"}
                    strokeColor={canCreateComic ? "#52c41a" : "#1890ff"}
                  />
                </div>
              </div>
            }
            type={canCreateComic ? "success" : "warning"}
            icon={
              canCreateComic ? <CheckCircleOutlined /> : <InfoCircleOutlined />
            }
            showIcon
            className="mb-6"
          />
        )}

        <Row gutter={[24, 24]}>
          {/* Main Form */}
          <Col xs={24} lg={16}>
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
                initialValues={{
                  type: "suu-tam",
                  category: [],
                }}
              >
                <Form.Item label="Ảnh bìa truyện" required>
                  <div className="flex flex-col items-center">
                    <Upload
                      name="file"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${REQUEST_URLS_V1.UPLOAD}`}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      accept="image/*"
                      style={{
                        width: "150px",
                        height: "150px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                      }}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="avatar"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        <div>
                          <div style={{ marginTop: 8 }}>Upload</div>
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
                    {
                      min: 2,
                      message: "Tên truyện phải có ít nhất 2 ký tự",
                    },
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
                      ]}
                    >
                      <Input
                        placeholder="Nhập tên tác giả..."
                        prefix={<UserOutlined className="text-gray-400" />}
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
                      disabled={!canCreateComic}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isLoadingSubmit ? "Đang đăng..." : "Đăng truyện"}
                    </Button>
                    <Button size="large" onClick={() => form.resetFields()}>
                      Làm mới
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Preview & Tips */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" size="large" className="w-full">
              {/* Preview Card */}
              <Card title="Xem trước" className="shadow-sm">
                <div className="text-center">
                  <Image
                    width="100%"
                    height={200}
                    src={imageUrl || "/default-cover.png"}
                    alt="Cover preview"
                    className="rounded-lg object-cover"
                  />
                  <div className="mt-4 text-left">
                    <Title level={5} ellipsis className="mb-1">
                      {form.getFieldValue("title") || "Tên truyện"}
                    </Title>
                    <Text className="text-gray-500 text-sm block mb-2">
                      {form.getFieldValue("authorName") || "Tác giả"}
                    </Text>
                    <Paragraph
                      ellipsis={{ rows: 3 }}
                      className="text-gray-600 text-sm"
                    >
                      {form.getFieldValue("description") ||
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
                    <span>Mẹo viết truyện hay</span>
                  </div>
                }
                className="shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex gap-2 items-center">
                    <Text className="text-sm">
                      Chọn ảnh bìa thu hút và chất lượng cao
                    </Text>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Text className="text-sm">
                      Viết mô tả ngắn gọn, súc tích nhưng hấp dẫn
                    </Text>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Text className="text-sm">
                      Chọn đúng thể loại để độc giả dễ tìm
                    </Text>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Text className="text-sm">
                      Cập nhật chapter thường xuyên
                    </Text>
                  </div>
                </div>
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
}
