"use client";
import { usePathname } from "next/navigation";
import Footer from "../landing/footer";
import Header from "../landing/header";

export default function LayoutMain({
  className,
  children,
  showHero = true,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
  showHero?: boolean;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header className="bg-[#0B3973] relative z-10" />
      <main
        className={`flex-1 w-full bg-gray-100 bg-[url('/huy.jpg')] bg-cover bg-center bg-fixed ${className}`}
        {...props}
      >
        {children}
      </main>

      <Footer />
    </div>
  );
}
