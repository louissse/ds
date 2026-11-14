import { useQuery } from "@tanstack/react-query";

export type InstitutionOption = {
  id: string;
  name: string;
  count: number;
};

type InstitutionsResponse = {
  results: InstitutionOption[];
};

async function fetchInstitutions(query: string): Promise<InstitutionsResponse> {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  const response = await fetch(`/api/institutions?${params}`, {
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error("We couldn’t load institutions. Please try again.");
  }

  return response.json();
}

export function useInstitutions(query: string) {
  return useQuery({
    queryKey: ["institutions", query],
    queryFn: () => fetchInstitutions(query),
  });
}
