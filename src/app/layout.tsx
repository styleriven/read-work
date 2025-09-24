import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/lib/providers/client-provider";
import AuthProvider from "@/lib/providers/auth-provider";
import AuthProviderHelper from "@/lib/providers/auth-provider-helper";
import LayoutMain from "@/components/Layout/layout-main";

const domain = process.env.NEXT_PUBLIC_APP_URL;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: domain ? new URL(domain) : undefined,
  title:
    "Đọc Truyện Online - Read World | Kho Truyện Miễn Phí Cập Nhật Nhanh Nhất",
  description:
    "Đọc truyện online miễn phí tại Read World - Kho tàng truyện tranh, tiểu thuyết, light novel được cập nhật liên tục hàng ngày. Giao diện thân thiện, đọc mượt mà trên mọi thiết bị.",
  keywords:
    "đọc truyện online, truyện tranh, tiểu thuyết, light novel, truyện miễn phí, read world",
  authors: [{ name: "Read World Team" }],
  creator: "Read World",
  publisher: "Read World",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "Đọc Truyện Online - Read World | Kho Truyện Miễn Phí",
    description:
      "Kho tàng truyện online miễn phí với hàng nghìn đầu truyện hay được cập nhật liên tục. Đọc truyện tranh, tiểu thuyết, light novel mọi lúc mọi nơi.",
    url: `${domain}`,
    siteName: "Read World",
    images: [
      {
        url: `${domain}/huy.jpg`,
        width: 1200,
        height: 630,
        alt: "Read World - Đọc Truyện Online Miễn Phí",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@readworld",
    creator: "@readworld",
    title: "Đọc Truyện Online - Read World | Kho Truyện Miễn Phí",
    description:
      "Kho tàng truyện online miễn phí với hàng nghìn đầu truyện hay được cập nhật liên tục. Đọc truyện tranh, tiểu thuyết, light novel mọi lúc mọi nơi.",
    images: [`${domain}/huy.jpg`],
  },
  alternates: {
    canonical: `${domain}`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <meta
          name="ahrefs-site-verification"
          content="4a98fad9c61f79470d9c6da531398cd792d9bfee2a67024f54b7cfb21f41feab"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Read World",
              url: domain,
              description:
                "Kho tàng truyện online miễn phí với hàng nghìn đầu truyện hay được cập nhật liên tục",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${domain}/search?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
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

        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="aKCA79j8BWVr2k8Kbib9Iw"
          async
        ></script>
      </body>
    </html>
  );
}
