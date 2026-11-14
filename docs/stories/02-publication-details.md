# View publication details

Status: implemented and automated checks passing; remaining manual checks listed below.

## User story

As a user, I want to open a publication and inspect its abstract, authors, affiliations and access information so I can assess its relevance and find the original work.

## Scope and implementation

- React Router opens `/publication/:id`. The return link preserves the originating list URL, including its page number; direct entry falls back to `/`.
- `usePublication` reuses matching list data as initial detail data, preserving its original update timestamp. Fresh data avoids another request; stale data can refresh in the background. Direct entry or reload fetches through Hono when the in-memory cache is empty.
- `GET /api/publications/:id` validates the ID and performs a scoped OpenAlex list query with the ID filter added. It returns a mapped publication, 400 for malformed IDs, 404 for missing/out-of-scope records, or a generic 502 on upstream failure.
- Details show title, date, citation count, open access status, abstract, topics, DOI and available external links.
- Initially show eight author names. Expanding shows every available author and affiliation, with institution/country text in italics. Institutions are independently deduplicated by OpenAlex ID and shown as a compact paragraph, initially limited to eight, with an expansion control. Both sections can collapse again.
- Initial loading uses an accessible skeleton with reduced-motion support. Errors offer manual retry. Missing optional metadata is explained rather than left blank.

## Verification

The developer confirmed cache-based display, direct/reload fetching during development and reviewed the compact detail layout. AI added automated tests with simulated responses for successful direct detail requests, malformed IDs without an upstream call, scoped empty results returning 404, safe 502 errors followed by a successful retry, and preservation of the fixed scope in the outgoing detail query. Together with the existing abstract test, all six tests pass. Type checking and the frontend production build also pass.

These tests exercise Hono and API construction, not browser rendering. AI additionally verified direct browser entry with an empty cache (loading followed by real publication data), author expansion, an out-of-scope record showing the not-found message, and generic upstream error display with a Try again button. Very small numeric IDs such as W1 produced an upstream error rather than an empty response, so they currently show the generic retryable error. Remaining manual checks: retry recovery in the detail browser UI, keyboard expansion and narrow-screen layout. No automated browser suite was added.

## Known limitations

The fetch response type is assumed rather than runtime-validated. Browser requests time out after 30 seconds; upstream requests still have no explicit timeout. The completeness of author metadata depends on the OpenAlex response. Search and filtering are separate slices.
