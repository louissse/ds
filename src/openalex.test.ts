import { afterEach, expect, test, vi } from "vitest";
import { fetchPublicationsPage } from "./openalex";

afterEach(() => vi.unstubAllGlobals());

test("detail lookups preserve the fixed scope and add the requested ID", async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValue(
      new Response(JSON.stringify({ meta: { count: 0 }, results: [] })),
    );
  vi.stubGlobal("fetch", fetchMock);
  await fetchPublicationsPage(1, 1, "W123");
  const url = fetchMock.mock.calls[0][0] as URL;
  expect(url.searchParams.get("search")).toBe("climate change");
  expect(url.searchParams.get("filter")).toBe(
    "institutions.country_code:DK,from_publication_date:2025-01-01,to_publication_date:2025-12-31,openalex:W123",
  );
  expect(url.searchParams.get("per_page")).toBe("1");
});

test("title and institution filters preserve the collection scope", async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValue(
      new Response(JSON.stringify({ meta: { count: 0 }, results: [] })),
    );
  vi.stubGlobal("fetch", fetchMock);
  await fetchPublicationsPage(1, 10, undefined, "bats", "I123");
  const url = fetchMock.mock.calls[0][0] as URL;
  expect(url.searchParams.get("search")).toBe("climate change");
  expect(url.searchParams.get("search.title")).toBe("bats");
  expect(url.searchParams.get("filter")).toBe(
    "institutions.country_code:DK,from_publication_date:2025-01-01,to_publication_date:2025-12-31,authorships.institutions.id:I123",
  );
});
