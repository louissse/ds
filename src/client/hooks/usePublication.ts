import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Publication } from "../../shared/publications";
import type { PublicationsResponse } from "./usePublications";

async function fetchPublication(id: string): Promise<Publication> {
  const response = await fetch(`/api/publications/${id}`, {
    signal: AbortSignal.timeout(30_000),
  });

  if (response.status === 404) {
    throw new Error("Publication not found within this collection.");
  }

  if (!response.ok) {
    throw new Error("We couldn’t load this publication. Please try again.");
  }

  return response.json();
}

export function usePublication(id: string) {
  const queryClient = useQueryClient();
  const cachedPage = queryClient
    .getQueriesData<PublicationsResponse>({ queryKey: ["publications"] })
    .find(([, data]) =>
      data?.results.some(
        (publication) => publication.id === `https://openalex.org/${id}`,
      ),
    );

  const cachedPublication = cachedPage?.[1]?.results.find(
    (publication) => publication.id === `https://openalex.org/${id}`,
  );

  return useQuery({
    queryKey: ["publication", id],
    queryFn: () => fetchPublication(id),
    initialData: cachedPublication,
    // Preserve the list data's age instead of making old data fresh again.
    initialDataUpdatedAt: cachedPage
      ? queryClient.getQueryState(cachedPage[0])?.dataUpdatedAt
      : undefined,
    enabled: Boolean(id),
  });
}
