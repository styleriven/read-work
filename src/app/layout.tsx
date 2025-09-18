import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/lib/providers/client-provider";
import AuthProvider from "@/lib/providers/auth-provider";
import AuthProviderHelper from "@/lib/providers/auth-provider-helper";
import LayoutMain from "@/components/Layout/layout-main";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Đọc Truyện Online - Read World",
  description: "Nơi đọc truyện online miễn phí",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProvider>
          <AuthProvider>
            <AuthProviderHelper>
              <LayoutMain>{children}</LayoutMain>
            </AuthProviderHelper>
          </AuthProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
