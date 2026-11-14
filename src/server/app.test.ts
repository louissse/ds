import { afterEach, expect, test, vi } from "vitest";
import { fetchPublicationsPage } from "../openalex";
import { app } from "./app";
import type { OpenAlexWork } from "../shared/openalex-types";

vi.mock("../openalex", () => ({ fetchPublicationsPage: vi.fn() }));
const fetchPage = vi.mocked(fetchPublicationsPage);
afterEach(() => vi.resetAllMocks());

const work: OpenAlexWork = {
  id: "https://openalex.org/W123",
  title: "Example publication",
  publication_date: "2025-06-01",
  cited_by_count: 2,
  doi: null,
  authorships: [],
  topics: [],
  primary_location: null,
  open_access: { is_oa: false, oa_status: "closed", oa_url: null },
  abstract_inverted_index: null,
};

test("direct detail requests return the mapped publication", async () => {
  fetchPage.mockResolvedValue({ meta: { count: 1 }, results: [work] });
  const response = await app.request("/api/publications/W123");
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({
    id: work.id,
    citationCount: 2,
    abstract: null,
  });
  expect(fetchPage).toHaveBeenCalledWith(1, 1, "W123");
});

test("invalid IDs are rejected without contacting OpenAlex", async () => {
  const response = await app.request("/api/publications/invalid");
  expect(response.status).toBe(400);
  expect(fetchPage).not.toHaveBeenCalled();
});

test("missing or out-of-scope publications return 404", async () => {
  fetchPage.mockResolvedValue({ meta: { count: 0 }, results: [] });
  const response = await app.request("/api/publications/W123");
  expect(response.status).toBe(404);
  expect(await response.json()).toEqual({
    error: "Publication not found within this collection.",
  });
});

test("an upstream failure returns a safe error and a later retry can succeed", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  fetchPage.mockRejectedValueOnce(new Error("private upstream details"));
  fetchPage.mockResolvedValueOnce({ meta: { count: 1 }, results: [work] });
  const failed = await app.request("/api/publications/W123");
  expect(failed.status).toBe(502);
  expect(await failed.json()).toEqual({
    error: "We couldn’t load this publication. Please try again.",
  });
  const retried = await app.request("/api/publications/W123");
  expect(retried.status).toBe(200);
  vi.restoreAllMocks();
});
