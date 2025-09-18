"use client";
import { ComicQuery } from "@/lib/server/queries/comic-query";
import { IComic } from "@models/interfaces/i-comic";
import { useState, useEffect } from "react";
import ComicCardVertical from "../ui/comic-card-vertical";
import Loading from "../ui/loading";

export default function BookGrid() {
  const [comics, setComics] = useState<IComic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchComics() {
    try {
      setIsLoading(true);
      const data = await ComicQuery.getRandomComics(12);
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
      <div className="w-1/2 flex justify-center items-center border p-4 rounded-lg bg-gradient-to-b shadow-lg mx-10 bg-gray-100/60">
        <Loading styleIcon={{ fontSize: "5rem" }} />
      </div>
    );
  }

  return (
    <div className="w-1/2 flex justify-center border p-4 rounded-lg bg-gradient-to-b shadow-lg mx-10 bg-gray-100/60">
      <div className="grid grid-cols-6 gap-4 ">
        {comics.map((comic) => (
          <ComicCardVertical
            key={comic.id}
            id={comic.id}
            title={comic.title}
            img={comic.coverImage ?? "/default-cover.png"}
          />
        ))}
      </div>
    </div>
  );
}
