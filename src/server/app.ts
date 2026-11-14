import { Hono } from "hono";
import { fetchPublicationsPage } from "../openalex";
import { mapPublication } from "../shared/publications";

export const app = new Hono();

app.get("/api/health", (c) => {
  return c.json({ status: "ok" });
});

app.get("/api/publications", async (c) => {
  const page = Number(c.req.query("page") ?? "1");
  const pageSize = 10;

  if (!Number.isInteger(page) || page < 1 || page * pageSize > 10_000) {
    return c.json({ error: "Invalid page number." }, 400);
  }
  try {
    const data = await fetchPublicationsPage(page, pageSize);

    return c.json({
      results: data.results.map(mapPublication),
      total: data.meta.count,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("Failed to fetch publications");

    return c.json(
      { error: "We couldn’t load publications. Please try again." },
      502,
    );
  }
});

app.get("/api/publications/:id", async (c) => {
  const id = c.req.param("id");

  if (!/^W\d+$/.test(id)) {
    return c.json({ error: "Invalid publication ID." }, 400);
  }

  try {
    const data = await fetchPublicationsPage(1, 1, id);
    const work = data.results[0];

    if (!work) {
      return c.json(
        { error: "Publication not found within this collection." },
        404,
      );
    }

    return c.json(mapPublication(work));
  } catch {
    console.error("Failed to fetch publication");

    return c.json(
      { error: "We couldn’t load this publication. Please try again." },
      502,
    );
  }
});
