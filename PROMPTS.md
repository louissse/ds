# AI usage during development

This document records selected relevant prompts and how the suggestions were used. It is updated at significant milestones. The prompt excerpts below are translated from Danish.

## Working approach

I used Codex as a discussion partner and for small code suggestions. I asked for a limited scope and explanations throughout so I could work in the code myself and explain the decisions. I chose a script with SQLite, Hono, React and search through the OpenAlex API. Implementation proceeded in small steps.

## Selected prompts

### Scope and understanding

> It is important that you do not just write a lot of code that I cannot follow while we develop. I need to be able to explain all the choices.

AI helped read the exercise and propose a step-by-step plan. I kept the scope small and prioritised familiar technologies. Three Matt Pocock skills were installed for clarification and documentation; his full workflow was not adopted.

### A data model based on the UI

> Even though we are not using our own database for the final search, I still think we should consider which fields we store in relation to the final display.

I shared a concrete API response. AI proposed a smaller publication object and a mapping. We selected fields for the list and detail views, preserving authors' institutions and countries as nested data.

### Refinements and corrections

I challenged suggestions during development:

- I asked to preserve `author_position` alongside the author list order.
- I questioned the meaning of affiliations and compared a publication on Forskningsportalen and OpenAlex myself. We established that the combined institution list can be derived from author affiliations, deduplicated by institution ID. AI had initially suggested that the publication's empty `institutions` field might be relevant; this was corrected after consulting the documentation.
- I pointed out that publications can change between imports. AI's initial suggestion to skip existing IDs was therefore changed to an upsert that updates the data.

### Implementation and troubleshooting

AI suggested small code snippets for API requests, mapping, abstract reconstruction and SQLite storage. I inserted and adapted the code and ran it incrementally. AI configured Prettier directly in the project.

When the API key was `undefined`, AI checked the variable name and configuration without printing the key. The solution was to load `.env` explicitly in the import command.

### Pagination and API load

> How do we fetch 1,000 publications without overloading the API?

AI consulted the OpenAlex documentation and proposed sequential requests with 100 publications per page, a one-second pause between pages and limited retries for temporary HTTP errors. I suggested moving API handling into a separate file. We first extracted the working API call, then added pagination, then retries. I applied the changes incrementally and ran the full import successfully.

### Exploring the interface before implementation

> I would like to take a short break from code and decide on UX and UI with a quick browser prototype using no real data.

AI built a separate interactive prototype with fictional publications. I directed revisions to contrast, typography and colours using Research Portal Denmark and Statistics Denmark as references. I specified the introduction background and blue border, refined result spacing into three groups, chose plain comma-separated topics instead of badges, and requested a search-type dropdown and a discreet clear-filters action. We also agreed on skeleton loading, retryable request errors and a separate empty-results state for the implementation. These are design decisions; they do not mean the actual frontend has been implemented.

## Verification

- I first ran the API request for one publication and reviewed the transformed object in the terminal.
- I inspected the stored row in SQLite Viewer. An apparently empty database turned out to be a view that needed reopening; AI also checked the database file directly.
- I tested upsert by saving a test title and then reimporting the correct title. The publication was updated without adding another row.
- The import was extended to multiple publications, then two pages and finally 10 pages. I confirmed that 1,000 publications were stored and that I understood the flow. AI subsequently verified the row count directly in SQLite.

There are no automated tests yet, and the retry branches have not been explicitly tested. The import of 1,000 publications is complete; the backend and frontend are not implemented yet.

## Architecture clarification before the first slice

I explicitly requested the grill-with-docs skill to establish a shared understanding before implementation. AI asked questions in rounds and recorded agreed decisions in [the architecture document](docs/architecture.md). I chose Tailwind and TanStack Query over the initial suggestions of plain CSS and built-in React data fetching because I already know these tools. We agreed on a shared publication mapping, server-side OpenAlex access, URL-based search state, React Router, backend retries, optional deployment and a small Vitest test suite alongside manual browser checks. The user confirmed the consolidated architecture on 14 November 2026; this entry records planning, not completed implementation or tests.

## First automated test

AI installed Vitest and wrote one focused test of abstract reconstruction through the shared publication mapper, using fictional input with out-of-order and repeated words. AI ran `npm test` and `npm run typecheck`; both passed. This verifies only that behaviour, not the full mapping or HTTP flow.

## First vertical slice completed

The developer wrote most of the Hono, React, Vite, Tailwind and TanStack Query setup with incremental AI guidance. At explicit requests, AI corrected type connections, implemented the publication list item and pagination controls, and limited the display to the first three authors and their institutions. The developer questioned the need for React Router and requested an explanation of fetch cancellation and timeouts before implementing a 30-second timeout.

The developer manually checked pagination, skeletons, error handling, empty results, narrow layout, keyboard operation and boundary controls. AI verified that the temporary empty response was removed and reran type checking and the existing abstract test successfully. Search, filters and details remain outside this completed slice.

## Detail presentation and verification

At my request, AI implemented the detail layout following the agreed design, then revised author and institution sections into compact, expandable paragraphs based on my feedback. I asked AI to add a detail skeleton and test the flow. AI separated the Hono app from server startup for testing and added simulated-response tests for detail success, invalid IDs, 404, upstream failure/recovery and fixed-scope query construction. All six tests, type checking and frontend build pass. Browser rendering and expansion behaviour still need final manual verification; backend tests do not claim to cover those interactions.

## Search and institution filter

The developer implemented title search and institution-group endpoints with AI guidance and proposed obtaining institution choices from the current search rather than a hard-coded list. We limited options to the top 100 groups. At the developer's request, AI connected a controlled search input and later the institution filter through URL state, query keys and backend validation. AI added three targeted tests; all nine tests pass. Topic filtering and author/country search are not implemented. The developer requested a pause after connecting institutions to reassess the time spent.

At my request, AI replaced the native institution select with a single-select combobox based on the Base UI primitives used by shadcn/ui, with project-specific styling instead of installing the full shadcn theme. AI checked local option search and institution selection updating the URL in the browser. Type checking, all nine tests and the frontend build passed.
