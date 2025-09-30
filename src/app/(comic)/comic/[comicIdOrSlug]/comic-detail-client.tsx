"use client";
import Avatar from "@/components/ui/avatar";
import ComicCardHorizontal from "@/components/ui/comic-card-horizontal";
import {
  BookOutlined,
  CheckOutlined,
  CommentOutlined,
  EyeOutlined,
  HeartOutlined,
  PlayCircleOutlined,
  StarOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  Image,
  Pagination,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import { useState, useEffect, use } from "react";
import CommentCard from "../comment-card";
import ModalSendComment from "../../modal-send-comment";
import { ComicQuery } from "@/lib/server/queries/comic-query";
import Loading from "@/components/ui/loading";
import { useSession } from "next-auth/react";
import { REQUEST_URLS_V1 } from "@/config/request-urls";
import { notify } from "@/components/ui/notify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChapterQuery } from "@/lib/server/queries/chapter-query";
import { formatNumber, timeAgo } from "@/lib/uitls/utils";
import { StructuredData } from "@/components/seo/StructuredData";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { CommentQuery } from "@/lib/server/queries/comment-query";

const { Title, Text, Paragraph } = Typography;

interface ComicDetailClientProps {
  initialComic: any;
}

export default function ComicDetailClient({
  initialComic,
}: ComicDetailClientProps) {
  const [comicData, setComicData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingChapter, setIsLoadingChapter] = useState(true);
  const [relatedStories, setRelatedStories] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [totalChapters, setTotalChapters] = useState(0);
  const [pageChapter, setPageChapter] = useState(1);
  const [limitChapter, setLimitChapter] = useState(12);
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;
  const [comments, setComments] = useState<any[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [totalComments, setTotalComments] = useState(0);
  const [pageComment, setPageComment] = useState(1);
  const [limitComment, setLimitComment] = useState(10);
  const [breadcrumbs, setBreadcrumbs] = useState([
    { name: "Trang chủ", url: "/" },
    { name: comicData?.title },
  ]);

  const fetchRelatedStories = async () => {
    try {
      const data = await ComicQuery.getRandomComics(10);
      setRelatedStories(data);
    } catch (error) {
      console.error("Error fetching related stories:", error);
    }
  };

  const fetchComic = async () => {
    try {
      setIsLoading(true);
      setComicData(initialComic);
      setBreadcrumbs([
        { name: "Trang chủ", url: "/" },
        { name: initialComic?.title },
      ]);
    } catch (error) {
      console.error("Error fetching comic:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChapters = async () => {
    setIsLoadingChapter(true);
    try {
      const data = await ChapterQuery.getChapterSummaryByComicId(
        initialComic.id,
        "",
        pageChapter,
        limitChapter
      );
      setChapters(data.data || []);
      setTotalChapters(data.totalCount || 0);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    } finally {
      setIsLoadingChapter(false);
    }
  };

  const fetchComments = async () => {
    try {
      setIsLoadingComments(true);
      const data = await CommentQuery.getCommentsByTargetId(
        initialComic.id,
        pageComment,
        limitComment
      );
      setComments(data?.comments || []);
      setTotalComments(data?.totalCount || 0);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    if (initialComic?.id) {
      fetchChapters();
      fetchComments();
    }
  }, [pageChapter, limitChapter, initialComic?.id]);

  useEffect(() => {
    fetchRelatedStories();
  }, []);

  useEffect(() => {
    fetchComic();
  }, [initialComic]);

  const [expandedDescription, setExpandedDescription] = useState(false);
  const [selectedComment, setSelectedComment] = useState<{
    id?: string;
    name?: string;
  }>({});

  const [modalSendCommentOpen, setModalSendCommentOpen] = useState(false);

  async function SendComment(content: string, id?: string, name?: string) {
    if (!user) return;

    let newComment = await CommentQuery.createComment({
      targetId: initialComic.id,
      targetType: "Comic",
      comicId: comicData.id,
      authorId: user.id,
      content,
      parentCommentId: id,
    });

    newComment.author = {
      id: user.id,
      userName: user.userName,
      email: user.email,
      avatar: user.avatar,
    };

    function addReplyRecursive(comments: any[], newReply: any): any[] {
      return comments.map((comment) => {
        if (comment.id === newReply.parentCommentId) {
          return {
            ...comment,
            replies: [newReply, ...(comment.replies || [])],
          };
        } else if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: addReplyRecursive(comment.replies, newReply),
          };
        }
        return comment;
      });
    }

    if (newComment.parentCommentId) {
      setComments((prevComments) =>
        addReplyRecursive(prevComments, newComment)
      );
    } else {
      setComments((prevComments) => [newComment, ...prevComments]);
    }

    setTotalComments((prev) => prev + 1);

    notify({
      type: "success",
      title: "Bình luận thành công",
      description: "Bình luận của bạn đã được gửi thành công!",
    });

    setTimeout(() => {
      const el = document.getElementById(`comment-${newComment.id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }

  async function getCommentMore() {
    try {
      if (isLoadingComments) return;

      setIsLoadingComments(true);
      const data = await CommentQuery.getCommentsByTargetId(
        initialComic.id,
        pageComment + 1,
        limitComment
      );
      setComments((prevComments) => [
        ...prevComments,
        ...(data?.comments || []),
      ]);
      if (data.comments && data.comments.length > 0) {
        setPageComment((prev) => prev + 1);
        setTotalComments(data?.totalCount || 0);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  }

  function OpenModalSendMail(id?: string, name?: string) {
    setSelectedComment({ id, name });
    setModalSendCommentOpen(true);
  }

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      notify({
        type: "error",
        title: "Chỉ được upload ảnh",
        description: "Vui lòng chọn file ảnh (jpg, png, jpeg...)",
      });
    }
    return isImage;
  };

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "done") {
      const url = info.file.response?.url;
      setComicData({ ...comicData, coverImage: url });
      ComicQuery.updateComic(comicData.id, { coverImage: url });
      notify({
        type: "success",
        title: "Upload thành công",
        description: "Ảnh đã được tải lên!",
      });
    } else if (info.file.status === "error") {
      notify({
        type: "error",
        title: "Upload thất bại",
        description: "Vui lòng thử lại!",
      });
    }
  };

  function CloseModalSendMail() {
    setModalSendCommentOpen(false);
  }

  async function handleReadContinue() {
    if (chapters.length === 0) {
      notify({
        title: "Truyện hiện chưa có chương nào",
        description: "Vui lòng quay lại sau",
        type: "info",
      });
      return;
    }

    let targetChapterSlug = chapters[0].slug;

    if (user) {
      try {
        const bookmark = await ComicQuery.getBookmarkedComic(initialComic.id);
        if (bookmark?.chapter?.slug) {
          targetChapterSlug = bookmark?.chapter?.slug;
        }
      } catch (error) {
        console.error("Error fetching bookmark:", error);
      }
    }

    router.push(`/comic/${initialComic.slug}/chapter/${targetChapterSlug}`);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loading styleIcon={{ fontSize: "5rem" }} />
        <Text className="mt-4 text-lg">Đang tải...</Text>
      </div>
    );
  }

  if (!comicData) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <BookOutlined style={{ fontSize: "4rem", color: "#d9d9d9" }} />
        <Title level={3} className="mt-4">
          Không tìm thấy truyện
        </Title>
        <Text>Truyện không tồn tại hoặc đã bị xóa.</Text>
        <div className="mt-4">
          <Button type="primary" onClick={() => router.back()}>
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ModalSendComment
        isOpen={modalSendCommentOpen}
        id={selectedComment.id}
        name={selectedComment.name}
        onOk={SendComment}
        onCancel={CloseModalSendMail}
      />
      <StructuredData
        comic={comicData}
        type="comic"
        breadcrumbs={breadcrumbs}
      />
      <div className="min-h-screen ">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Breadcrumb items={breadcrumbs} className="mb-6" />
          <div className="flex md:flex-row flex-col items-stretch gap-6">
            {/* Cover Image */}
            <div className="flex flex-col flex-shrink-0 items-center justify-center">
              {comicData?.authorId.includes(user?.id) ? (
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
                    width: "192px",
                    height: "224px",
                  }}
                >
                  <Image
                    src={comicData?.coverImage || "/default-cover.png"}
                    alt={comicData?.title}
                    className="object-cover rounded-lg shadow-md w-48 h-56"
                    preview={false}
                    width={"100%"}
                    height={"100%"}
                  />
                </Upload>
              ) : (
                <Image
                  src={comicData?.coverImage || "/default-cover.png"}
                  alt={comicData?.title}
                  width={192}
                  height={224}
                  className="object-cover rounded-lg shadow-md w-48 h-56"
                  preview={{
                    mask: <span className="text-white">Xem ảnh</span>,
                  }}
                />
              )}

              <div className="mt-3 flex gap-2">
                <button
                  className="flex-1 bg-cyan-500 text-white py-2 px-4 rounded-lg hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    handleReadContinue();
                  }}
                >
                  <PlayCircleOutlined className="w-4 h-4" />
                  Đọc Tiếp
                </button>
                {comicData?.authorId.includes(user?.id) && (
                  <Link href={`/comic/${comicData.slug}/edit`} passHref>
                    <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                      Chỉnh Sửa
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* Story Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {comicData?.title}
                </h1>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Tác Giả:</span>
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    {comicData?.authorName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Tình Trạng:</span>
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckOutlined />
                    {comicData?.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Đánh Giá:</span>
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarOutlined
                          key={star}
                          className="w-4 h-4 text-gray-300"
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {comicData?.rating}/5 trên tổng số{" "}
                      {comicData?.totalRatings} đánh giá
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <EyeOutlined className="w-4 h-4" />
                  {formatNumber(comicData?.stats?.viewsCount)} lượt xem
                </div>

                <button
                  // onClick={handleLike}
                  className={`flex items-center gap-1 transition-colors hover:text-red-500 ${
                    true ? "text-red-500" : "text-gray-600"
                  }`}
                >
                  <HeartOutlined
                    className={`w-4 h-4 ${true ? "text-red-500" : ""}`}
                  />
                  {formatNumber(100000)} thích
                </button>

                <div className="flex items-center gap-1">
                  <UserAddOutlined className="w-4 h-4" />
                  {formatNumber(comicData?.stats?.bookmarksCount)} theo dõi
                </div>
                <a
                  className="flex items-center gap-1 cursor-pointer"
                  href="#comments"
                >
                  <CommentOutlined className="w-4 h-4" />
                  Bình luận
                </a>
              </div>

              {/* Description */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p
                  className={`text-gray-700 leading-relaxed ${
                    expandedDescription ? "" : "line-clamp-2"
                  }`}
                >
                  {comicData?.description}
                </p>

                <button
                  className="text-blue-600 hover:underline mt-2"
                  onClick={() => setExpandedDescription(!expandedDescription)}
                >
                  {expandedDescription ? "Thu gọn" : "Xem thêm"}
                </button>
              </div>
            </div>

            <div className="w-80">
              <div className="bg-gray-100 h-full rounded-2xl p-2 flex flex-col items-center justify-center gap-8">
                {comicData?.authors?.map((a: any, i: number) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center gap-4 w-full"
                  >
                    <Avatar
                      className=""
                      width={80}
                      height={80}
                      imageUrl={a.avatar || "/default-avatar.png"}
                      preview={true}
                    />
                    <span className="text-sm text-gray-600">
                      {a.userName || a.email}
                    </span>
                    <button
                      className="text-gray-600 px-4 py-2 rounded-lg shadow-none
                      hover:shadow-[-6px_6px_15px_rgba(0,0,0,0.4)]
                      transition-all duration-500 ease-in-out"
                    >
                      Xin Quyền Quản Lý
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex md:flex-row flex-col gap-6">
            {/* Left Content */}
            <div className="flex-1">
              {/* Purchase Banner */}
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Ưu Đãi Dành Cho Bạn
                </h3>
                <p className="text-blue-700 text-sm mb-3">
                  Ứng hộ <span className="font-semibold">81,000 Vàng</span> để
                  mua combo truyện{" "}
                  <span className="font-semibold">{comicData?.title}</span>
                </p>
                <p className="text-blue-600 text-xs mb-3">
                  Rẻ hơn 44.55% so với đọc từng chương (tiết kiệm 65,074 Vàng)
                </p>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                  Chi Tiết
                </button>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 flex flex-col gap-6">
                  <h3 className=" text-black font-semibold mb-4 flex items-center gap-2">
                    Danh Sách Chương
                  </h3>

                  {isLoadingChapter ? (
                    <div className="w-full flex justify-center items-center">
                      <Loading />
                    </div>
                  ) : chapters.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {chapters.map((chapter: any, index: number) => (
                        <Link
                          key={chapter.id}
                          href={`/comic/${initialComic.slug}/chapter/${chapter.slug}`}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-gray-100"
                        >
                          <span
                            className="text-sm text-gray-700 truncate"
                            title={chapter.title}
                          >
                            Chương {chapter.chapterNumber}: {chapter.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Text>Chưa có chương nào</Text>
                  )}

                  <Pagination
                    align="center"
                    current={pageChapter}
                    pageSize={limitChapter}
                    total={totalChapters}
                    onChange={(page) => setPageChapter(page)}
                    showSizeChanger={false}
                  />
                </div>
              </div>

              {/* Comments Section */}
              <div
                id="comments"
                className="flex flex-col gap-1 bg-white rounded-lg shadow-sm mt-6 p-4"
              >
                <h3 className="text-black font-semibold mb-4 flex items-center gap-2">
                  Bình Luận ({totalComments})
                </h3>
                {comments.map((comment) => (
                  <CommentCard
                    id={comment.id}
                    key={comment.id}
                    imageUrl={comment?.author?.avatar || "/default-avatar.png"}
                    name={comment?.author?.userName || comment?.author?.email}
                    time={timeAgo(comment.createdAt)}
                    user={user}
                    content={comment.content}
                    replies={comment.replies}
                    onReplyClick={OpenModalSendMail}
                  />
                ))}
                {isLoadingComments && (
                  <div className="w-full flex justify-center items-center">
                    <Loading />
                  </div>
                )}

                <div className="mt-4 flex justify-around">
                  {user && (
                    <button
                      className="text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 p-1 rounded-lg transition-colors cursor-pointer "
                      onClick={() => OpenModalSendMail()}
                    >
                      Thêm Bình Luận
                    </button>
                  )}
                  <button
                    className="text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 p-1 rounded-lg transition-colors cursor-pointer"
                    onClick={() => {
                      getCommentMore();
                    }}
                  >
                    Xem Thêm Bình Luận
                  </button>
                </div>
              </div>
            </div>

            <div className="w-80">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className=" text-black font-semibold mb-4 flex items-center gap-2">
                  Có Thể Bạn Thích
                </h3>
                <div className="space-y-4 max-h-[450px] overflow-y-auto">
                  {relatedStories.map((story) => (
                    <ComicCardHorizontal
                      key={story.id}
                      id={story.id}
                      slug={story.slug}
                      title={story.title}
                      image={story.coverImage}
                      description={story.description}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
