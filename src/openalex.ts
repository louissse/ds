import type { OpenAlexWorksResponse } from "./shared/openalex-types";
import { setTimeout as sleep } from "node:timers/promises";

export async function fetchPublicationsPage(
  page: number,
  pageSize: number,
  workId?: string,
  titleQuery?: string,
  institutionId?: string,
): Promise<OpenAlexWorksResponse> {
  const url = new URL("https://api.openalex.org/works");

  url.searchParams.set("search", "climate change");
  if (titleQuery) {
    url.searchParams.set("search.title", titleQuery);
  }
  url.searchParams.set(
    "filter",
    "institutions.country_code:DK,from_publication_date:2025-01-01,to_publication_date:2025-12-31",
  );
  if (workId) {
    const scopeFilter = url.searchParams.get("filter");

    url.searchParams.set("filter", `${scopeFilter},openalex:${workId}`);
  }
  if (institutionId) {
    const scopeFilter = url.searchParams.get("filter");
    url.searchParams.set(
      "filter",
      `${scopeFilter},authorships.institutions.id:${institutionId}`,
    );
  }
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(pageSize));

  const apiKey = process.env.OPENALEX_API_KEY;

  if (apiKey) {
    url.searchParams.set("api_key", apiKey);
  }

  console.log(`Fetching page ${page} (${pageSize} publications)`);

  const maxRetries = 3;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url);

    if (response.ok) {
      const data = (await response.json()) as OpenAlexWorksResponse;
      return data;
    }

    const canRetry = response.status === 429 || response.status >= 500;

    if (!canRetry || attempt === maxRetries) {
      throw new Error(`OpenAlex returned status ${response.status}`);
    }

    const retryAfter = response.headers.get("Retry-After");
    let delayMs = 2 ** (attempt + 1) * 1000;

    if (response.status === 429 && retryAfter !== null) {
      const seconds = Number(retryAfter);

      if (Number.isFinite(seconds)) {
        delayMs = Math.max(0, seconds * 1000);
      } else {
        const retryDate = Date.parse(retryAfter);

        if (!Number.isNaN(retryDate)) {
          delayMs = Math.max(0, retryDate - Date.now());
        }
      }
    }

    console.log(
      `OpenAlex returned ${response.status}. Retrying in ${delayMs / 1000} seconds`,
    );

    await sleep(delayMs);
  }
  throw new Error("OpenAlex request did not complete");
}

type InstitutionGroupsResponse = {
  group_by: {
    key: string;
    key_display_name: string;
    count: number;
  }[];
};

export async function fetchInstitutions(titleQuery?: string) {
  const url = new URL("https://api.openalex.org/works");

  url.searchParams.set("search", "climate change");
  url.searchParams.set(
    "filter",
    "institutions.country_code:DK,from_publication_date:2025-01-01,to_publication_date:2025-12-31",
  );

  if (titleQuery) {
    url.searchParams.set("search.title", titleQuery);
  }

  url.searchParams.set("group_by", "authorships.institutions.id");
  url.searchParams.set("per_page", "100");
  url.searchParams.set("sort", "count:desc");

  const apiKey = process.env.OPENALEX_API_KEY;

  if (apiKey) {
    url.searchParams.set("api_key", apiKey);
  }

  const response = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`OpenAlex returned status ${response.status}`);
  }

  const data = (await response.json()) as InstitutionGroupsResponse;

  return data.group_by
    .filter((group) => group.key.startsWith("https://openalex.org/I"))
    .map((group) => ({
      id: group.key,
      name: group.key_display_name,
      count: group.count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "en"));
}
