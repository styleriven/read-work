import { BreadcrumbItem } from "@/types/breadcrumb-item";

interface StructuredDataProps {
  comic?: any;
  chapter?: any;
  breadcrumbs?: BreadcrumbItem[];
  type?: "comic" | "chapter" | "category" | "author";
}

const domain = process.env.NEXT_PUBLIC_APP_URL;

export function StructuredData({
  comic,
  chapter,
  breadcrumbs,
  type,
}: StructuredDataProps) {
  const generateComicSchema = () => {
    if (!comic) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Book",
      name: comic.title,
      description: comic.description,
      author: {
        "@type": "Person",
        name: comic?.authorName,
      },
      publisher: {
        "@type": "Organization",
        name: "Truyện Online",
        url: domain,
      },
      url: `${domain}/comic/${comic?.slug}`,
      image: comic?.coverImage,
      numberOfPages: comic?.chapters?.length,
    };
  };

  const generateChapterSchema = () => {
    if (!comic || !chapter) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${comic.title} - Chương ${chapter.chapterNumber}: ${chapter.title}`,
      description: comic.description,
      author: {
        "@type": "Person",
        name: comic.authorName,
      },
      datePublished: chapter.publishedAt,
      dateModified: chapter.updatedAt,
      publisher: {
        "@type": "Organization",
        name: "Truyện Online",
        url: domain,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${domain}/comic/${comic.slug}/chapter/${chapter.slug}`,
      },
      image: comic.image,
      isPartOf: {
        "@type": "Book",
        name: comic.title,
        url: `${domain}/comic/${comic.slug}`,
      },
      wordCount: chapter.content.length,
    };
  };

  const generateBreadcrumbSchema = () => {
    if (!breadcrumbs) return null;

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url
          ? `${process.env.NEXT_PUBLIC_SITE_URL}${item.url}`
          : undefined,
      })),
    };
  };

  let schema;
  if (type === "comic") {
    schema = generateComicSchema();
  } else if (type === "chapter") {
    schema = generateChapterSchema();
  }

  const breadcrumbSchema = generateBreadcrumbSchema();

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
    </>
  );
}
