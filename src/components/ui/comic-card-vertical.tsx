import { shortenText } from "@/lib/uitls/utils";
import Image from "next/image";
import Link from "next/link";

export default function ComicCardVertical({
  id,
  slug,
  title,
  img,
  className,
  ...props
}: {
  id: string;
  slug: string;
  title: string;
  img: string;
  className?: string;
}) {
  return (
    <Link
      className={`flex flex-col  justify-center text-center   ${className}`}
      title={title}
      href={`/comic/${slug}`}
      {...props}
    >
      <div className="h-fit p-2 bg-white rounded-xl shadow hover:shadow-lg hover:scale-[1.05] transition cursor-pointer">
        <Image
          src={img || "/default-cover.png"}
          alt={shortenText(title, 30)}
          width={100}
          height={200}
          className="rounded-lg mx-auto"
        />
        <p className="text-black truncate mt-2 text-sm font-medium w-full mx-auto">
          {title}
        </p>
      </div>
    </Link>
  );
}
