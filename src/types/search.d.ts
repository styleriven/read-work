export interface SearchFilterOptions {
  categories: Array<{ id: string; name: string; slug: string }>;
  statuses: string[];
  types: Array<{ value: string; label: string }>;
  ageRatings: string[];
  languages: string[];
  sortOptions: Array<{ value: string; label: string }>;
}

export interface SearchPageProps {
  searchParams: {
    q?: string;
    categories?: string;
    status?: string;
    type?: string;
    ageRating?: string;
    language?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: string;
    limit?: string;
  };
}
