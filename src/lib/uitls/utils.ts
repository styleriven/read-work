export function shortenText(text: string, maxLength: number) {
  return text.length > maxLength ? text.slice(0, maxLength) + " ..." : text;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[đ]/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function timeAgo(dateString?: Date) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

export function formatNumber(
  num: number = 0,
  locale: string = "vi-VN"
): string {
  if (num === null || num === undefined) return "0";
  if (num < 1000) return num.toLocaleString(locale);

  const units = [
    { value: 1e18, symbol: "Qi" }, // Quintillion (tỷ tỷ)
    { value: 1e15, symbol: "Qa" }, // Quadrillion (triệu tỷ)
    { value: 1e12, symbol: "T" }, // Trillion (nghìn tỷ)
    { value: 1e9, symbol: "B" }, // Billion (tỷ)
    { value: 1e6, symbol: "M" }, // Million (triệu)
    { value: 1e3, symbol: "K" }, // Thousand (ngàn)
  ];

  for (const unit of units) {
    if (num >= unit.value) {
      return (num / unit.value).toFixed(1).replace(/\.0$/, "") + unit.symbol;
    }
  }

  return num.toLocaleString(locale);
}

export function isUUIDv4(str: string): boolean {
  const uuidV4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4Regex.test(str);
}
