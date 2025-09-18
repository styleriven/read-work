"use client";
import { useEffect, useState } from "react";
import { ComicQuery } from "@/lib/server/queries/comic-query";
import { BgColorsOutlined } from "@ant-design/icons";
import { IComic } from "@models/interfaces/i-comic";
import Image from "next/image";
import Loading from "../ui/loading";

export default function ExclusiveComic() {
  const [comics, setComics] = useState<IComic[] | undefined>();
  const [currentComic, setCurrentComic] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchComics() {
    try {
      setIsLoading(true);
      const data = await ComicQuery.getRandomComics(5);
      setComics(data);
    } catch (error) {
      console.error("Error fetching comics:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchComics();
  }, []);

  if (isLoading) {
    return (
      <div className="w-1/4 ml-10 flex justify-center items-center hover:scale-[1.02] transition">
        <Loading styleIcon={{ fontSize: "5rem" }} />
      </div>
    );
  }

  return (
    <div className="w-1/4 ml-10 flex justify-center items-center hover:scale-[1.02] transition text-lg">
      <div className="flex flex-col justify-between w-fit h-full border p-5 rounded-lg bg-gradient-to-b shadow-lg bg-gray-100">
        <h2 className="flex items-center gap-2 font-semibold">
          <BgColorsOutlined />
          Độc quyền
        </h2>

        <div>
          {comics && comics.length > 0 && (
            <>
              <Image
                src={comics[currentComic].coverImage ?? "/default-cover.png"}
                alt={comics[currentComic].title}
                width={200}
                height={200}
                title={comics[currentComic].title}
                className="object-contain cursor-pointer"
              />
              <span>{comics[currentComic].title}</span>
            </>
          )}
        </div>

        <div className="flex justify-center mt-2 w-full">
          {comics &&
            comics.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full mr-3 cursor-pointer ${
                  i === currentComic ? "bg-green-600" : "bg-green-400"
                }`}
                onClick={() => setCurrentComic(i)}
              ></div>
            ))}
        </div>
      </div>
    </div>
  );
}
