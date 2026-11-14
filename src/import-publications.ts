import Database from "better-sqlite3";
import { fetchPublicationsPage } from "./openalex";
import { setTimeout as sleep } from "node:timers/promises";

console.log("Import af publikationer");

function buildAbstract(
  invertedIndex: Record<string, number[]> | null,
): string | null {
  if (!invertedIndex) {
    return null;
  }

  const words: string[] = [];

  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const position of positions) {
      words[position] = word;
    }
  }

  return words.join(" ");
}

async function main() {
  //Opret database og tabel for publikationer hvis de ikke allerede eksisterer
  const db = new Database("publications.sqlite");
  db.exec(`
  CREATE TABLE IF NOT EXISTS publications (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    publication_date TEXT NOT NULL,
    citation_count INTEGER NOT NULL,
    doi TEXT,
    landing_page_url TEXT,
    abstract TEXT,
    is_open_access INTEGER NOT NULL,
    oa_status TEXT NOT NULL,
    oa_url TEXT,
    authorships_json TEXT NOT NULL,
    topics_json TEXT NOT NULL
  )
`);

  // Forbered SQL-indsættelse
  const insert = db.prepare(`
  INSERT INTO publications (
    id, title, publication_date, citation_count,
    doi, landing_page_url, abstract,
    is_open_access, oa_status, oa_url,
    authorships_json, topics_json
  ) VALUES (
    @id, @title, @publicationDate, @citationCount,
    @doi, @landingPageUrl, @abstract,
    @isOpenAccess, @oaStatus, @oaUrl,
    @authorshipsJson, @topicsJson
  )
  ON CONFLICT(id) DO UPDATE SET
  title = excluded.title,
  publication_date = excluded.publication_date,
  citation_count = excluded.citation_count,
  doi = excluded.doi,
  landing_page_url = excluded.landing_page_url,
  abstract = excluded.abstract,
  is_open_access = excluded.is_open_access,
  oa_status = excluded.oa_status,
  oa_url = excluded.oa_url,
  authorships_json = excluded.authorships_json,
  topics_json = excluded.topics_json
`);

  const pageSize = 100;
  const maxPages = 10;

  let savedCount = 0;

  for (let page = 1; page <= maxPages; page++) {
    const works = await fetchPublicationsPage(page, pageSize);

    if (works.length === 0) {
      break;
    }

    for (const work of works) {
      const publication = {
        id: work.id,
        title: work.title,
        publicationDate: work.publication_date,
        citationCount: work.cited_by_count,
        doi: work.doi,
        authorships: work.authorships.map((authorship) => ({
          authorId: authorship.author.id,
          authorName: authorship.author.display_name,
          authorPosition: authorship.author_position,
          institutions: authorship.institutions.map((institution) => ({
            id: institution.id,
            name: institution.display_name,
            countryCode: institution.country_code,
          })),
        })),
        topics: work.topics.map((topic) => ({
          id: topic.id,
          name: topic.display_name,
        })),
        landingPageUrl: work.primary_location?.landing_page_url ?? null,
        openAccess: {
          isOpenAccess: work.open_access.is_oa,
          status: work.open_access.oa_status,
          url: work.open_access.oa_url,
        },
        abstract: buildAbstract(work.abstract_inverted_index),
      };

      console.dir(publication, { depth: null });

      // Indsæt publikation i databasen
      const result = insert.run({
        id: publication.id,
        title: publication.title,
        publicationDate: publication.publicationDate,
        citationCount: publication.citationCount,
        doi: publication.doi,
        landingPageUrl: publication.landingPageUrl,
        abstract: publication.abstract,
        isOpenAccess: publication.openAccess.isOpenAccess ? 1 : 0,
        oaStatus: publication.openAccess.status,
        oaUrl: publication.openAccess.url,
        authorshipsJson: JSON.stringify(publication.authorships),
        topicsJson: JSON.stringify(publication.topics),
      });
      savedCount += result.changes;
    }
    console.log(`Page ${page} saved. Total: ${savedCount}`);

    if (page < maxPages) {
      await sleep(1000);
    }
  }
  console.log(`Saved ${savedCount} publications`);
  db.close();
}

main().catch(console.error);
