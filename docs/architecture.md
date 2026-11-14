# Application architecture

Status: architecture confirmed by the user on 14 November 2026; web application implementation has not started.

## Agreed decisions

- Use React, TypeScript, Vite and Tailwind for the frontend. Tailwind is familiar to the developer and supports the agreed visual direction.
- Start with native HTML controls and custom React components, without a component library.
- Use TanStack Query for server data, caching and request state. It is familiar to the developer. Treat successful data as fresh for five minutes. Query keys include search type, search text, filters and page number. Disable automatic retries in the frontend: the backend owns bounded automatic retries, and the UI provides a manual Try again action.
- Use Hono for all browser-facing OpenAlex requests. Keep the API key on the server, enforce the climate/Danish-affiliation/2025 scope and map responses to application objects.
- Fetch lists, searches and details from OpenAlex through Hono. SQLite remains separate, used by the import script. This avoids restricting detail views to the 1,000 imported records.
- Keep one repository and one package.json, with separate folders for import, backend and frontend code. Exact paths remain to be agreed.
- Share the publication mapping between import and backend, and share its TypeScript output type with the frontend. Keep SQLite code out of shared/browser code.
- During local development, run Vite and Hono as separate processes. Vite proxies `/api` requests to Hono.

- Use React Router for separate list and detail URLs, such as `/` and `/publications/W123`. Add detail navigation in its own slice.
- List responses contain `{ results, total, page, pageSize }`. Results use the application's publication model rather than exposing the raw OpenAlex response.
- For deployment, target one Node server: Hono handles `/api` and serves the built React app. Local development still uses separate Vite and Hono processes. Public deployment is optional; a working local setup and deployment instructions are the priority.

- Store committed search type, search text, filters and page number in URL parameters when those features are implemented. Use these values in query keys so reload, sharing and back navigation preserve the search.
- Enforce the fixed scope for direct detail requests too. Verify the OpenAlex mechanism during the detail slice; do not infer climate relevance from title or topic labels alone.
- Use Vitest for a small set of meaningful tests: mapping relationships and order, abstract reconstruction including missing data, fixed API filters and error handling. Simulate OpenAlex responses in automated tests rather than making live requests. Verify each slice manually in the browser, including loading, empty/error states, retry, keyboard use and narrow layouts. Defer a larger automated browser test setup.

## Confirmation and implementation

The user confirmed the consolidated architecture on 14 November 2026. Exact file paths, package configuration and endpoint details will be introduced and explained in small steps within each slice.

The first implementation target is the [publication list story](stories/01-publication-list.md). The design reference is in [the visual handoff](design/README.md). Continue in small steps that the developer can follow and explain.
