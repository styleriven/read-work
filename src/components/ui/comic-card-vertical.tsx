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
      className={`flex flex-col justify-center text-center p-2 bg-white rounded-xl shadow hover:shadow-lg hover:scale-[1.05] transition cursor-pointer ${className}`}
      title={title}
      href={`/comic/${slug}`}
      {...props}
    >
      <Image
        src={img}
        alt={shortenText(title, 30)}
        width={100}
        height={200}
        className="rounded-lg mx-auto"
      />
      <p className="truncate mt-2 text-sm font-medium w-full mx-auto">
        {title}
      </p>
    </Link>
  );
}
