import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/lib/providers/client-provider";
import AuthProvider from "@/lib/providers/auth-provider";
import AuthProviderHelper from "@/lib/providers/auth-provider-helper";
import LayoutMain from "@/components/Layout/layout-main";
import { HeadData } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Head from "next/head";
import Script from "next/script";

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
    <html lang="vi">
      <head>
        <meta
          name="ahrefs-site-verification"
          content="4a98fad9c61f79470d9c6da531398cd792d9bfee2a67024f54b7cfb21f41feab"
        ></meta>
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="aKCA79j8BWVr2k8Kbib9Iw"
          async
        ></script>
      </head>
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
