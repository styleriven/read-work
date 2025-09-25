"use client";
import Image from "next/image";
import Link from "next/link";

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export default function Footer({ className = "", ...props }: FooterProps) {
  return (
    <footer
      className={`${className} row-start-3 flex gap-[24px] flex-wrap items-center bg-[#282F3A] justify-center bottom-0 text-black`}
      {...props}
    >
      {/* Thêm internal links */}
      <div className="flex gap-4 text-white">
        <Link href="/" className="hover:underline">
          Trang chủ
        </Link>
        {/* <Link href="/about" className="hover:underline">
          Giới thiệu
        </Link>
        <Link href="/services" className="hover:underline">
          Dịch vụ
        </Link>
        <Link href="/contact" className="hover:underline">
          Liên hệ
        </Link>
        <Link href="/blog" className="hover:underline">
          Blog
        </Link> */}
      </div>
    </footer>
  );
}
