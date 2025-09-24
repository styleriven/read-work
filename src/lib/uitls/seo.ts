export function generateComicUrl(slug: string) {
  return `/comic/${slug}`;
}

export function generateChapterUrl(comicSlug: string, chapterSlug: string) {
  return `/comic/${comicSlug}/chapter/${chapterSlug}`;
}

export function extractExcerpt(
  content: string,
  maxLength: number = 160
): string {
  const plainText = content.replace(/<[^>]*>/g, "");
  return plainText.length > maxLength
    ? plainText.substring(0, maxLength).trim() + "..."
    : plainText;
}
