import type { OpenAlexWork } from "./openalex-types";

export type Institution = {
  id: string;
  name: string;
  countryCode: string | null;
};

export type Authorship = {
  authorId: string | null;
  authorName: string;
  authorPosition: "first" | "middle" | "last";
  institutions: Institution[];
};

export type Topic = {
  id: string;
  name: string;
};

export type Publication = {
  id: string;
  title: string;
  publicationDate: string;
  citationCount: number;
  doi: string | null;
  landingPageUrl: string | null;
  abstract: string | null;
  openAccess: {
    isOpenAccess: boolean;
    status: string;
    url: string | null;
  };
  authorships: Authorship[];
  topics: Topic[];
};

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
export function mapPublication(work: OpenAlexWork): Publication {
  return {
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
}
