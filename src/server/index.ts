import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { fetchPublicationsPage } from "../openalex";
import { mapPublication } from "../shared/publications";

const app = new Hono();

app.get("/api/health", (c) => {
  return c.json({ status: "ok" });
});

app.get("/api/publications", async (c) => {
  try {
    const works = await fetchPublicationsPage(1, 10);
    const publications = works.map(mapPublication);

    return c.json({ results: publications });
  } catch (error) {
    console.error("Failed to fetch publications");

    return c.json(
      { error: "We couldn’t load publications. Please try again." },
      502,
    );
  }
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server running at http://localhost:${info.port}`);
  },
);
