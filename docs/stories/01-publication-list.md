# View climate research publications

Status: planned.

## User story

As a user, I want to see a list of climate-related publications from Danish institutions published in 2025, so I can get an overview of the research.

## Vertical slice

React → `GET /api/publications` in Hono → OpenAlex → Hono → React.

The backend requests the first 10 matching publications and returns the data needed by the list. The API key stays on the server. The SQLite import remains a separate part of the exercise; this flow reads from OpenAlex.

## Acceptance criteria

- Opening the application loads up to 10 publications from OpenAlex through Hono.
- Every request preserves the fixed scope: climate change, at least one Danish institutional affiliation, and publication dates from 2025-01-01 through 2025-12-31.
- Each result shows its title, publication date, author names, institutions, topics and open access status. Author order is preserved, institutions are deduplicated by OpenAlex institution ID, and missing optional information does not break the view.
- The list follows the agreed visual direction: compact results with three groups (date/access/title; authors/institutions; topics), readable dark text and comma-separated topics.
- While the request is pending, the list shows skeletons and exposes an accessible loading state.
- A failed request shows a clear error message and a keyboard-accessible **Try again** button that repeats the request.
- A successful response with no publications shows an empty-state message rather than an error.
- The page works on narrow and wide screens, with labelled controls and visible keyboard focus.
- The API key is not included in frontend code, browser requests or displayed error messages.

## Outside this slice

Search input and search-type selection, institution/topic filters, clear filters, user-controlled pagination and publication details will be added in later slices. The prototype shows the intended direction for those features; they are not required to finish this story.

## Implementation approach

Work in small, explainable steps: a minimal Hono endpoint, then a React list connected to it, then loading, empty and error states. Keep the whole browser-to-OpenAlex flow as the goal. Review each change with the user before introducing the next concept.

See the [visual handoff](../design/README.md) and the [publication model](../../README.md#publication-model).

## Verification before marking complete

Check the real browser-to-backend-to-OpenAlex flow, confirm the fixed filters and displayed fields, and verify loading, empty results, failed requests and retry. Check a narrow layout and keyboard operation. Record actual checks and any limitations here when the slice is implemented.
