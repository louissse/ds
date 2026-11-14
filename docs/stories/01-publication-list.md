# View climate research publications

Status: complete for the agreed first slice, 14 November 2026.

## User story

As a user, I want to see a list of climate-related publications from Danish institutions published in 2025, so I can get an overview of the research.

## Vertical slice

React → `GET /api/publications` in Hono → OpenAlex → Hono → React.

The backend requests the selected page of 10 matching publications and returns `{ results, total, page, pageSize }`. The API key stays on the server. The SQLite import remains a separate part of the exercise; this flow reads from OpenAlex.

## Acceptance criteria

- Opening the application loads the first page of up to 10 publications from OpenAlex through Hono.
- Previous and Next controls allow browsing pages. Previous is disabled on page 1; Next is disabled on the last page or when there are no results.
- The current page is stored in the URL and included in the TanStack Query key. Reloading and browser back/forward navigation preserve the selected page, and pages are cached separately.
- The backend validates the requested page and returns pagination metadata alongside results. Requests beyond OpenAlex's supported basic-paging range are rejected clearly.
- Loading, failure and retry apply to the selected page. Retry repeats that page's request.
- Every request preserves the fixed scope: climate change, at least one Danish institutional affiliation, and publication dates from 2025-01-01 through 2025-12-31.
- Each result shows its title, publication date, the first three author names and their institutions, topics and open access status. Additional authors are indicated with “and X more”; all authors remain in the underlying publication object. Author order is preserved, institutions are deduplicated by OpenAlex institution ID, and missing optional information does not break the view.
- The list follows the agreed visual direction: compact results with three groups (date/access/title; authors/institutions; topics), readable dark text and comma-separated topics.
- While the request is pending, the list shows skeletons and exposes an accessible loading state.
- A failed request shows a clear error message and a keyboard-accessible **Try again** button that repeats the request.
- A successful response with no publications shows an empty-state message rather than an error.
- The page works on narrow and wide screens, with labelled controls and visible keyboard focus.
- The API key is not included in frontend code, browser requests or displayed error messages.

## Outside this slice

Search input and search-type selection, institution/topic filters, clear filters and publication details will be added in later slices. The prototype shows the intended direction for those features; they are not required to finish this story.

## Implementation approach

Work in small, explainable steps: a minimal Hono endpoint, then a React list connected to it, then pagination and loading, empty and error states. Keep the whole browser-to-OpenAlex flow as the goal. Review each change with the user before introducing the next concept.

See the [visual handoff](../design/README.md) and the [publication model](../../README.md#publication-model).

## Verification before marking complete

Check the real browser-to-backend-to-OpenAlex flow, confirm the fixed filters and displayed fields, and verify loading, empty results, failed requests and retry. Verify page changes, first/last-page controls, URL reload and back/forward behaviour, per-page cache keys and retry of a failed page. Check a narrow layout and keyboard operation. Record actual checks and any limitations here when the slice is implemented.

## Verification record

The developer manually confirmed the live list, pagination and URL navigation, loading skeletons, timeout/error display, empty results, narrow layout, keyboard operation and last-page controls. Empty results were simulated with a temporary backend response, which has been removed. The backend was restarted during failure/recovery checks; an orphaned process occupying port 3000 was stopped.

AI ran `npm run typecheck` and `npm test` successfully at slice completion. The current single automated test covers abstract reconstruction only; it does not automate the browser checks above.

The browser request times out after 30 seconds. Query caching is in memory, with five minutes of freshness; full reloads clear it. Backend OpenAlex requests still have no explicit timeout, and disconnecting the browser does not cancel backend work. These are known limitations rather than claims of production readiness.
