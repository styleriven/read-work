import { shortenText } from "@/lib/uitls/utils";
import Image from "next/image";
import Link from "next/link";

export default function ComicCardHorizontal({
  id,
  slug,
  title,
  image,
  description,
  className,
  ...props
}: {
  id: string;
  slug: string;
  title: string;
  image: string;
  description: string;
  className?: string;
}) {
  return (
    <Link href={`/comic/${slug}`} className="block">
      <div
        key={id}
        className={`flex gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors ${className}`}
        {...props}
      >
        <div className="w-13 h-16 flex-shrink-0">
          <Image
            src={image || "/default-cover.png"}
            alt={shortenText(title, 3)}
            width={48}
            height={64}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
            {title}
          </h4>
          <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
        </div>
      </div>
    </Link>
  );
}
