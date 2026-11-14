import { useQuery } from "@tanstack/react-query";
import type { Publication } from "../../shared/publications";

export type PublicationsResponse = {
  results: Publication[];
  total: number;
  page: number;
  pageSize: number;
};

async function fetchPublications(
  page: number,
  query: string,
  institution: string,
): Promise<PublicationsResponse> {
  const params = new URLSearchParams({
    page: String(page),
  });

  if (query) {
    params.set("q", query);
  }

  if (institution) {
    params.set("institution", institution);
  }

  const response = await fetch(`/api/publications?${params}`, {
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error("We couldn’t load publications. Please try again.");
  }

  return response.json();
}

export function usePublications(
  page: number,
  query: string,
  institution: string,
) {
  return useQuery({
    queryKey: ["publications", page, query, institution],
    queryFn: () => fetchPublications(page, query, institution),
  });
}
