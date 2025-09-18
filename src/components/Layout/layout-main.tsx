"use client";
import Footer from "../landing/footer";
import Header from "../landing/header";

export default function LayoutMain({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <main
      className={`flex flex-col justify-between scroll-smooth w-full min-h-screen bg-gray-100 bg-[url('/huy.jpg')] bg-cover bg-center bg-fixed mx-auto ${className}`}
      {...props}
    >
      <Header className="bg-[#0B3973]" />
      {children}
      <Footer />
    </main>
  );
}
