import { useQuery } from "@tanstack/react-query";
import type { Publication } from "../../shared/publications";

export type PublicationsResponse = {
  results: Publication[];
  total: number;
  page: number;
  pageSize: number;
};

async function fetchPublications(page: number): Promise<PublicationsResponse> {
  const response = await fetch(`/api/publications?page=${page}`, {
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error("We couldn’t load publications. Please try again.");
  }

  return response.json();
}

export function usePublications(page: number) {
  return useQuery({
    queryKey: ["publications", page],
    queryFn: () => fetchPublications(page),
  });
}
