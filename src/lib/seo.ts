import { Metadata } from "next";

const domain = process.env.NEXT_PUBLIC_APP_URL;

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  noIndex?: boolean;
}

const defaultMetadata = {
  siteName: "Truyện Online",
  defaultTitle: "Truyện Online - Đọc truyện miễn phí",
  defaultDescription:
    "Website đọc truyện online miễn phí với hàng ngàn bộ truyện hay. Cập nhật liên tục các thể loại: tiên hiệp, ngôn tình, trinh thám, kinh dị...",
  siteUrl: domain,
  defaultImage: "/huy.jpg",
};

export function generateSEOMetadata({
  title,
  description,
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  tags,
  noIndex = false,
}: SEOProps): Metadata {
  const fullTitle = title
    ? `${title} | ${defaultMetadata.siteName}`
    : defaultMetadata.defaultTitle;

  const finalDescription = description || defaultMetadata.defaultDescription;
  const finalImage = image || defaultMetadata.defaultImage;
  const finalUrl = url
    ? `${defaultMetadata.siteUrl}${url}`
    : defaultMetadata.siteUrl;

  const metadata: Metadata = {
    metadataBase: defaultMetadata.siteUrl
      ? new URL(defaultMetadata.siteUrl)
      : undefined,
    title: fullTitle,
    description: finalDescription,

    // Open Graph
    openGraph: {
      title: fullTitle,
      description: finalDescription,
      url: finalUrl,
      siteName: defaultMetadata.siteName,
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "vi_VN",
      type: type,
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: finalDescription,
      images: [finalImage],
      creator: "@ReadWorld",
    },

    alternates: {
      canonical: finalUrl,
    },

    keywords: tags?.join(", "),

    authors: authors?.map((name) => ({ name })),

    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };

  // Article specific metadata
  if (type === "article" && (publishedTime || modifiedTime)) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      publishedTime,
      modifiedTime,
      authors: authors,
      tags,
    };
  }

  return metadata;
}
