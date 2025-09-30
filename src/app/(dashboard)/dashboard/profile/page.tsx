"use client";
import Loading from "@/components/ui/loading";
import { notify } from "@/components/ui/notify";
import { REQUEST_URLS_V1 } from "@/config/request-urls";
import { GetNameRole } from "@/enums/Role";
import { UserQuery } from "@/lib/server/queries/user-query";
import { IUser } from "@/types/user";
import {
  UserOutlined,
  MessageOutlined,
  TagOutlined,
  LinkOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  GetProp,
  message,
  Timeline,
  Upload,
  UploadProps,
  Input,
  Button,
  Card,
  Row,
  Col,
  Descriptions,
} from "antd";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
const { TextArea } = Input;

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("Bạn chỉ được upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Hình ảnh phải nhỏ hơn 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

export default function Profile() {
  const [loadingUploadImage, setLoadingUploadImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [userData, setUserData] = useState<IUser | null>();
  const { data: session, status } = useSession();
  const user = session?.user;

  const [userName, setUserName] = useState(user?.userName || "");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState(user?.bio || "");

  async function GetDataProfile() {
    if (user) {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const data = await UserQuery.getFullUser(user.id);
        setUserData(data);
        setImageUrl(data?.avatar || "/default-avatar.png");
        setBio(data?.bio || "");
        setUserName(data?.userName || "");
        setDisplayName(data?.displayName || "");
      } catch (error) {
        notify({
          type: "error",
          title: "Lỗi",
          description: "Không thể tải thông tin người dùng.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (user && userData?.id !== user?.id) {
      GetDataProfile();
    }
  }, [user]);

  const handleChange: UploadProps["onChange"] = (info) => {
    try {
      if (info.file.status === "uploading") {
        setLoadingUploadImage(true);
        return;
      }
      if (info.file.status === "done") {
        getBase64(info.file.originFileObj as FileType, () => {
          const url = info.file.response.url as string;
          setImageUrl(url);
          UserQuery.updateUser({ avatar: url });
          message.success("Cập nhật ảnh đại diện thành công!");
          setLoadingUploadImage(false);
        });
      }
    } catch (error) {
      message.error("Lỗi khi tải ảnh lên. Vui lòng thử lại.");
      setLoadingUploadImage(false);
    }
  };

  const saveUserName = async () => {
    // Nếu không thay đổi thì bỏ qua
    if (!userName || userData?.userName === userName) return;

    try {
      const updated = await UserQuery.updateUser({
        user_name: userName.trim(),
      });

      setUserData((prev) => (prev ? { ...prev, userName: userName } : prev));

      message.success("Cập nhật ngoại hiệu thành công!");
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Lỗi khi cập nhật ngoại hiệu. Vui lòng thử lại.");
    }
  };

  const saveDisplayName = async () => {
    if (!displayName || userData?.displayName === displayName) return;

    try {
      const updated = await UserQuery.updateUser({
        display_name: displayName.trim(),
      });
      setUserData((prev) =>
        prev ? { ...prev, displayName: displayName } : prev
      );
      message.success("Cập nhật tên gọi khác thành công!");
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Lỗi khi cập nhật tên gọi khác. Vui lòng thử lại.");
    }
  };

  const saveBio = async () => {
    if (!bio || userData?.bio === bio) return;

    try {
      const updated = await UserQuery.updateUser({
        bio: bio.trim(),
      });
      setUserData((prev) => (prev ? { ...prev, bio: bio } : prev));
      message.success("Cập nhật tên gọi khác thành công!");
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Lỗi khi cập nhật trích dẫn yêu thích. Vui lòng thử lại.");
    }
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      type="button"
    >
      {loadingUploadImage ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8, fontSize: "12px", color: "#fff" }}>
        Upload
      </div>
    </button>
  );

  return isLoading || status === "loading" ? (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <Loading styleIcon={{ fontSize: "5rem" }} />
    </div>
  ) : (
    <div className="flex-grow  min-h-screen">
      <div className="max-w-4xl mx-auto py-6 px-4">
        <Timeline
          mode="left"
          className="w-full"
          items={[
            {
              dot: (
                <UserOutlined
                  style={{ fontSize: "16px" }}
                  className="m-[-15px]"
                />
              ),
              color: "blue",
              children: (
                <Card
                  title={
                    <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                      Profile
                    </span>
                  }
                  className="shadow-md"
                >
                  <Row gutter={[24, 16]}>
                    <Col xs={24} sm={8}>
                      <div className="flex justify-center">
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
                            height: "150px",
                            backgroundColor: "#4a5568",
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
                            uploadButton
                          )}
                        </Upload>
                      </div>
                    </Col>
                    <Col xs={24} sm={16}>
                      <Descriptions column={1} size="small">
                        <Descriptions.Item
                          label="Ngoại Hiệu"
                          styles={{ label: { fontWeight: "bold" } }}
                        >
                          {userData?.userName}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label="Email"
                          styles={{ label: { fontWeight: "bold" } }}
                        >
                          {userData?.email}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label="Chức Vụ"
                          styles={{ label: { fontWeight: "bold" } }}
                        >
                          {GetNameRole(userData?.role || 3)}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label="Referral"
                          styles={{ label: { fontWeight: "bold" } }}
                        >
                          {userData?.detail?.referral.length} người
                        </Descriptions.Item>
                        <Descriptions.Item
                          label="Điểm danh"
                          styles={{ label: { fontWeight: "bold" } }}
                        >
                          <span
                            style={{
                              color: "#1890ff",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            Nhận vàng miễn phí
                          </span>
                        </Descriptions.Item>
                      </Descriptions>
                    </Col>
                    <Col xs={24}>
                      <Row gutter={[16, 8]} style={{ marginTop: "16px" }}>
                        <Col span={6}>
                          <div className="text-center">
                            <div style={{ fontWeight: "bold" }}>Ánh Kim:</div>
                            <div>{userData?.detail?.metallic}</div>
                          </div>
                        </Col>
                        <Col span={6}>
                          <div className="text-center">
                            <div style={{ fontWeight: "bold" }}>Ruby:</div>
                            <div>{userData?.detail?.ruby}</div>
                          </div>
                        </Col>
                        <Col span={6}>
                          <div className="text-center">
                            <div style={{ fontWeight: "bold" }}>Vé bố cáo:</div>
                            <div>{userData?.detail?.tickets}</div>
                          </div>
                        </Col>
                        <Col span={6}>
                          <div className="text-center">
                            <div style={{ fontWeight: "bold" }}>Điểm SVIP:</div>
                            <div>{userData?.detail?.svipPoints}</div>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
              ),
            },
            {
              dot: (
                <MessageOutlined
                  style={{ fontSize: "16px" }}
                  className="m-[-15px]"
                />
              ),
              color: "green",
              children: (
                <Card
                  title={
                    <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                      Trích Dẫn Yêu Thích
                    </span>
                  }
                  className="shadow-md"
                >
                  <TextArea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value.trim())}
                    placeholder="Nhập trích dẫn yêu thích của bạn..."
                    style={{ marginBottom: "12px" }}
                  />
                  <Button
                    type="default"
                    size="middle"
                    onClick={() => {
                      saveBio();
                    }}
                  >
                    Cập Nhật
                  </Button>
                </Card>
              ),
            },
            {
              dot: (
                <TagOutlined
                  style={{ fontSize: "16px" }}
                  className="m-[-15px]"
                />
              ),
              color: "orange",
              children: (
                <Card
                  title={
                    <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                      Ngoại Hiệu
                    </span>
                  }
                  className="shadow-md"
                >
                  <Row gutter={16} align="middle">
                    <Col flex="auto">
                      <Input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value.trim())}
                        placeholder="Nhập ngoại hiệu của bạn..."
                      />
                    </Col>
                    <Col>
                      <Button
                        type="default"
                        size="middle"
                        onClick={() => {
                          saveUserName();
                        }}
                      >
                        Thay Đổi
                      </Button>
                    </Col>
                  </Row>
                </Card>
              ),
            },
            {
              dot: (
                <LinkOutlined
                  style={{ fontSize: "16px" }}
                  className="m-[-15px]"
                />
              ),
              color: "purple",
              children: (
                <Card
                  title={
                    <div className="flex justify-between gap-2">
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        Tên gọi khác
                      </span>
                    </div>
                  }
                  className="shadow-md"
                >
                  <Row gutter={16} align="middle">
                    <Col flex="auto">
                      <Input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value.trim())}
                      />
                    </Col>
                    <Col>
                      <Button
                        type="default"
                        size="middle"
                        onClick={() => saveDisplayName()}
                      >
                        Thay Đổi
                      </Button>
                    </Col>
                  </Row>
                </Card>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
