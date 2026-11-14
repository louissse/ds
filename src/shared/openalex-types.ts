// The subset of OpenAlex fields consumed by our mapping.
export type OpenAlexWork = {
  id: string;
  title: string;
  publication_date: string;
  cited_by_count: number;
  doi: string | null;
  authorships: {
    author: { id: string | null; display_name: string };
    author_position: "first" | "middle" | "last";
    institutions: {
      id: string;
      display_name: string;
      country_code: string | null;
    }[];
  }[];
  topics: { id: string; display_name: string }[];
  primary_location: { landing_page_url: string | null } | null;
  open_access: { is_oa: boolean; oa_status: string; oa_url: string | null };
  abstract_inverted_index: Record<string, number[]> | null;
};

export type OpenAlexWorksResponse = {
  results: OpenAlexWork[];
};
