# OpenAlex publications

A full-stack coding exercise exploring climate-related publications from Danish institutions, published in 2025.

## Scope and status

The import script has successfully stored 1,000 publications in SQLite. The first Hono/React vertical slice is complete: a paginated publication list with loading skeletons, empty and error states, and manual retry. Search, filters and details remain to be implemented.

Search will use the OpenAlex API directly within the exercise's fixed scope. SQLite separately demonstrates data extraction and storage. Additional analysis and public deployment are currently out of scope.

## Architecture

See [application architecture](docs/architecture.md) for the agreed technology choices and decisions still being clarified.

## First vertical slice

The next implementation goal is [View climate research publications](docs/stories/01-publication-list.md), with scope, acceptance criteria and verification steps.

## Running the import

Development uses Node.js 22.14.0 and npm.

1. Run `npm ci`.
2. Create `.env` in the project root containing `OPENALEX_API_KEY=your_key`.
3. Run `npm run import`.

The script creates `publications.sqlite` in the current working directory, so run it from the project root. The environment file and database are excluded from Git. Run `npm run format` to format the code.

## Running the web application

After installing dependencies and creating `.env` as above, run these commands in separate terminals:

- `npm run dev:server` starts Hono on port 3000.
- `npm run dev:client` starts Vite; open the URL printed in its terminal.

Vite proxies `/api` requests to Hono. The list shows 10 records per page and stores the page in the URL. TanStack Query caches each page in memory; a full reload clears that cache. Browser requests time out after 30 seconds.

## Data and technical decisions

- TypeScript is used for the import script and SQLite for local storage. SQLite was chosen because I have some familiarity with it and it requires minimal setup.
- We store fields relevant to the results list and detail view rather than the entire API response: title, date, links, citation count, abstract, open access information, author affiliations and topics.
- Simple values are stored in columns. Author affiliations and topics are stored as JSON text to preserve their nested structure without introducing many tables. Separate tables would make extensive SQL analysis of these relationships easier.
- The OpenAlex ID is the primary key. The import inserts new publications and updates existing ones, preventing duplicates when rerun.
- Author order and `author_position` are preserved. Institutions and their countries are nested under each author. The UI's combined institution list will be derived from these affiliations and deduplicated by institution ID.
- Abstracts are reconstructed from OpenAlex's word positions. Missing abstracts are stored as `null`.

## Publication model

Each row in `publications` represents one OpenAlex publication. The import maps the API response to a smaller application object, then stores it as follows:

| Application field         | SQLite column      | Content                                          |
| ------------------------- | ------------------ | ------------------------------------------------ |
| `id`                      | `id`               | OpenAlex ID; primary key used for upsert         |
| `title`                   | `title`            | Publication title                                |
| `publicationDate`         | `publication_date` | Date as `YYYY-MM-DD` text                        |
| `citationCount`           | `citation_count`   | Integer citation count                           |
| `doi`                     | `doi`              | DOI URL, or `null`                               |
| `landingPageUrl`          | `landing_page_url` | Publication page URL, or `null`                  |
| `abstract`                | `abstract`         | Reconstructed abstract text, or `null`           |
| `openAccess.isOpenAccess` | `is_open_access`   | Boolean stored as integer `0` or `1`             |
| `openAccess.status`       | `oa_status`        | OpenAlex open access status                      |
| `openAccess.url`          | `oa_url`           | Open access URL, or `null`                       |
| `authorships`             | `authorships_json` | Ordered author affiliations, stored as JSON text |
| `topics`                  | `topics_json`      | Topic IDs and names, stored as JSON text         |

The nested fields have this shape (illustrative values):

```json
{
  "authorships": [
    {
      "authorId": "https://openalex.org/A123",
      "authorName": "Example Author",
      "authorPosition": "first",
      "institutions": [
        {
          "id": "https://openalex.org/I123",
          "name": "Example University",
          "countryCode": "DK"
        }
      ]
    }
  ],
  "topics": [
    {
      "id": "https://openalex.org/T123",
      "name": "Example topic"
    }
  ]
}
```

An author ID or institution country code may be `null`, and the lists may be empty. Each author can have multiple institutions. Countries describe institutional affiliations, not author nationality. `authorPosition` is `first`, `middle` or `last`; the array order is also preserved because multiple authors can be `middle`.

The results list can use title, date, authors, institutions and topics. The detail view additionally uses the abstract, full author affiliations, citation count, links and open access information. A combined institution list is derived from the authorships and deduplicated by institution ID, rather than stored a second time.

## Import behaviour

The import requests 10 pages of 100 publications sequentially, saving each page before requesting the next. It waits one second between pages and stops early if a page is empty. API requests are kept in `src/openalex.ts`; pagination, mapping and storage are handled by `src/import-publications.ts`.

HTTP 429 and server errors (5xx) trigger up to three retries, normally after 2, 4 and 8 seconds. For 429 responses, `Retry-After` is honoured when valid. Network failures without an HTTP response are not retried. Previously saved rows remain available if a later request fails; rerunning the script starts from page 1 and updates existing records.

## Manual verification so far

A publication was fetched, transformed and inspected in SQLite Viewer. Upsert was tested by importing the title as `TEST`, then importing the original title again. There was still only one row with that ID. The import was expanded incrementally, first to multiple publications, then two pages, and finally 10 pages. The completed import was verified to contain 1,000 rows in SQLite.

Run `npm test` for the first Vitest test: it verifies abstract reconstruction with out-of-order and repeated words through the shared publication mapping. Run `npm run typecheck` for static type checking. Both checks pass. Retry branches have not been explicitly tested. The list frontend and Hono endpoints work locally. See the first story for the manual verification record and remaining limitations.

## UX and visual direction

See [the visual handoff](docs/design/README.md) for screenshots and a self-contained interactive prototype.

The interface was explored with a separate interactive prototype using fictional publications before implementing the web application.

- Visual inspiration: [Research Portal Denmark](https://local.forskningsportal.dk/search/78730) and [Statistics Denmark](https://www.dst.dk/da/Statistik/emner/borgere/navne/hvor-mange-hedder). Use readable dark text, blue links and actions, and sans-serif typography. Prefer DIN Next when available, with Helvetica/Arial fallbacks.
- The introduction uses background `#F4F7FC` and a `4px solid #0074c6` left border. The top rule uses the same blue.
- Keep results compact, with three visually separated groups: date/open access/title; authors/institutions; topics. Use commas rather than dot separators. Topics appear as plain text rather than badges.
- A dropdown selects whether to search by title, author or affiliation country. Institution and topic filters are separate. The climate, Danish-affiliation and 2025 scope remains fixed.
- A small, understated **Clear filters** action appears when an institution or topic filter is active. It resets these filters while preserving the search text.
- Selecting a title opens publication details. The combined institution list is deduplicated by institution ID.

### States agreed for implementation

- **Loading:** skeletons following the result layout, with an accessible busy state.
- **Request failure:** a clear error message and **Try again**, repeating the request while preserving search and filters.
- **No matches:** an explanation suggesting another search or clearing filters. This is distinct from a request failure.
- Pagination, working publication links, keyboard/focus behaviour and responsive layouts must be completed and verified in the real application.

The prototype is a design reference, not the implemented frontend. Loading and error states have been agreed but are not demonstrated in the prototype yet.

## Deployment

Local execution of the import script is described above. Backend and frontend deployment instructions will be added once those components are implemented.

## AI usage

See [PROMPTS.md](PROMPTS.md) for selected prompts, division of work and verification of AI suggestions.
