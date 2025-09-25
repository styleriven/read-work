import { cache } from "react";

interface categoryPageProps {
  params: { categorySlug: string };
}

export default async function categoryPage({ params }: categoryPageProps) {
  const { categorySlug } = await params;
}
