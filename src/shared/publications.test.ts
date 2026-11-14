import { expect, test } from "vitest";
import type { OpenAlexWork } from "./openalex-types";
import { mapPublication } from "./publications";

test("reconstructs an abstract using word positions, including repeated words", () => {
  // Arrange: words deliberately appear out of order in the API object.
  const work: OpenAlexWork = {
    id: "https://openalex.org/W123",
    title: "Example publication",
    publication_date: "2025-06-01",
    cited_by_count: 0,
    doi: null,
    authorships: [],
    topics: [],
    primary_location: null,
    open_access: { is_oa: false, oa_status: "closed", oa_url: null },
    abstract_inverted_index: {
      change: [1, 4],
      requires: [2],
      Climate: [0],
      policy: [3],
    },
  };

  // Act: use the same mapping as the import script and backend.
  const publication = mapPublication(work);

  // Assert: positions determine the text, not the object's key order.
  expect(publication.abstract).toBe("Climate change requires policy change");
});
