"use client";

import {
  AccountBookOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FireOutlined,
  LineChartOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import AllComicsCard from "./all-comics-card";
import ComicCard from "../ui/comic-card-vertical";
import { ComicQuery } from "@/lib/server/queries/comic-query";
import Loading from "../ui/loading";

export default function AllComics() {
  const [comicRanking, setComicRanking] = useState<any[]>([]);
  const [isLoadingRanking, setIsLoadingRanking] = useState(false);

  const [comicNewlyUpdated, setComicNewlyUpdated] = useState<any[]>([]);
  const [isLoadingNewlyUpdated, setIsLoadingNewlyUpdated] = useState(false);

  async function fetchComics(typeComic: number, type: number) {
    try {
      if (typeComic === 0) {
        const data = await ComicQuery.getRandomComics(9);
        setComicRanking(data);
      }
      if (typeComic === 1) {
        const data = await ComicQuery.getRandomComics(9);
        setComicNewlyUpdated(data);
      }
    } catch (error) {
      console.error("Error fetching comics:", error);
    }
  }

  const [contentRanking, setContentRanking] = useState({
    title: "Bảng xếp hạng",
    icon: <FireOutlined />,
    children: [
      {
        label: "Đang thịnh hành",
        icon: <LineChartOutlined />,
        action: () => GetComicTrendy(0),
        status: true,
      },
      {
        label: "Cập nhật 24 h",
        icon: <ClockCircleOutlined />,
        action: () => GetComicTrendy(1),
        status: false,
      },
      {
        label: "Kim thánh bản",
        icon: <DollarOutlined />,
        action: () => GetComicTrendy(2),
        status: false,
      },
      {
        label: "Kim bài đề cử",
        icon: <AccountBookOutlined />,
        action: () => GetComicTrendy(3),
        status: false,
      },
    ],
  });

  function ChangeStatusContentRanking(index: number) {
    setContentRanking((prev) => ({
      ...prev,
      children: prev.children.map((child, i) => ({
        ...child,
        status: i === index,
      })),
    }));
  }

  async function GetComicTrendy(type: number) {
    if (isLoadingRanking) return;
    setIsLoadingRanking(true);
    ChangeStatusContentRanking(type);

    switch (type) {
      case 0:
        await fetchComics(0, 0);
        break;
      case 1:
        await fetchComics(0, 1);
        break;
      case 2:
        await fetchComics(0, 2);
        break;
      case 3:
        await fetchComics(0, 3);
        break;
      default:
        setComicRanking([]);
    }
    setIsLoadingRanking(false);
  }

  const [contentNewlyUpdated, setContentNewlyUpdated] = useState({
    title: "Mới cập nhật",
    icon: <FireOutlined />,
    children: [
      {
        label: "Chương Mới",
        icon: <LineChartOutlined />,
        action: () => GetComicNewlyUpdated(0),
        status: true,
      },
      {
        label: "Truyện mới",
        icon: <ClockCircleOutlined />,
        action: () => GetComicNewlyUpdated(1),
        status: false,
      },
      {
        label: "Đề cử mới",
        icon: <DollarOutlined />,
        action: () => GetComicNewlyUpdated(2),
        status: false,
      },
      {
        label: "Mới hoàn thành",
        icon: <AccountBookOutlined />,
        action: () => GetComicNewlyUpdated(3),
        status: false,
      },
    ],
  });

  function ChangeStatusContentNewlyUpdated(index: number) {
    setContentNewlyUpdated((prev) => ({
      ...prev,
      children: prev.children.map((child, i) => ({
        ...child,
        status: i === index,
      })),
    }));
  }

  async function GetComicNewlyUpdated(type: number) {
    if (isLoadingNewlyUpdated) return;
    setIsLoadingNewlyUpdated(true);
    ChangeStatusContentNewlyUpdated(type);
    switch (type) {
      case 0:
        await fetchComics(1, 0);
        break;
      case 1:
        await fetchComics(1, 1);
        break;
      case 2:
        await fetchComics(1, 2);
        break;
      case 3:
        await fetchComics(1, 3);
        break;
      default:
        setComicNewlyUpdated([]);
    }
    setIsLoadingNewlyUpdated(false);
  }

  useEffect(() => {
    GetComicTrendy(0);
    GetComicNewlyUpdated(0);
  }, []);

  return (
    <div className="w-full">
      <h2 className="flex p-4 ml-10">Tất Cả Tác Phẩm</h2>
      <div className=" border p-4 rounded-lg bg-gradient-to-b shadow-lg bg-gray-100/60">
        <div className="flex justify-between mb-10">
          <AllComicsCard
            className="w-1/4"
            title={contentRanking.title}
            icon={contentRanking.icon}
            Children={contentRanking.children}
          />
          {isLoadingRanking ? (
            <div className="flex justify-center items-center w-full">
              <Loading styleIcon={{ fontSize: "5rem" }} />
            </div>
          ) : (
            <div className="grid grid-cols-9 gap-4 w-full">
              {comicRanking.map((comic) => (
                <ComicCard
                  key={comic.id}
                  id={comic.id}
                  slug={comic.slug}
                  title={comic.title}
                  img={comic.coverImage ?? "/default-cover.png"}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <AllComicsCard
            className="w-1/4"
            title={contentNewlyUpdated.title}
            icon={contentNewlyUpdated.icon}
            Children={contentNewlyUpdated.children}
          />

          {isLoadingNewlyUpdated ? (
            <div className="flex justify-center items-center w-full">
              <Loading styleIcon={{ fontSize: "5rem" }} />
            </div>
          ) : (
            <div className="grid grid-cols-9 gap-4 w-full">
              {comicNewlyUpdated.map((comic) => (
                <ComicCard
                  key={comic.id}
                  id={comic.id}
                  slug={comic.slug}
                  title={comic.title}
                  img={comic.coverImage ?? "/default-cover.png"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
