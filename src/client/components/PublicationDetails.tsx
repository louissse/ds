import { useState } from "react";
import type { Publication } from "../../shared/publications";

type PublicationDetailsProps = {
  publication: Publication;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

function countryName(code: string | null) {
  return code ? (countryNames.of(code) ?? code) : "Country unavailable";
}

export function PublicationDetails({ publication }: PublicationDetailsProps) {
  const [expandedPublicationId, setExpandedPublicationId] = useState<
    string | null
  >(null);
  const showAllAuthors = expandedPublicationId === publication.id;
  const visibleAuthors = showAllAuthors
    ? publication.authorships
    : publication.authorships.slice(0, 8);
  const [expandedInstitutionsId, setExpandedInstitutionsId] = useState<
    string | null
  >(null);
  const showAllInstitutions = expandedInstitutionsId === publication.id;

  const institutions = [
    ...new Map(
      publication.authorships.flatMap((author) =>
        author.institutions.map((institution) => [institution.id, institution]),
      ),
    ).values(),
  ];

  const visibleInstitutions = showAllInstitutions
    ? institutions
    : institutions.slice(0, 8);

  return (
    <article className="mt-6 space-y-8">
      <header className="border-l-4 border-[#0074c6] bg-[#F4F7FC] p-5 sm:p-7">
        <p className="text-sm">Publication</p>
        <h1 className="mt-1 text-2xl leading-tight font-bold break-words sm:text-4xl">
          {publication.title}
        </h1>
        <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
          <div>
            <dt className="text-sm">Published</dt>
            <dd className="font-semibold">
              <time dateTime={publication.publicationDate}>
                {dateFormatter.format(new Date(publication.publicationDate))}
              </time>
            </dd>
          </div>
          <div>
            <dt className="text-sm">Citations</dt>
            <dd className="font-semibold">
              {publication.citationCount.toLocaleString("en-GB")}
            </dd>
          </div>
          <div>
            <dt className="text-sm">Access</dt>
            <dd className="font-semibold">
              {publication.openAccess.isOpenAccess
                ? "Open access"
                : "Not open access"}
              <span className="font-normal">
                {" "}
                ({publication.openAccess.status})
              </span>
            </dd>
          </div>
        </dl>
      </header>

      <section aria-labelledby="abstract-heading">
        <h2 id="abstract-heading" className="text-xl font-semibold">
          Abstract
        </h2>
        <p className="mt-3 leading-relaxed whitespace-pre-line">
          {publication.abstract ||
            "No abstract is available for this publication."}
        </p>
      </section>

      <section aria-labelledby="authors-heading">
        <h2 id="authors-heading" className="text-xl font-semibold">
          Authors and affiliations
        </h2>
        {publication.authorships.length === 0 ? (
          <p className="mt-3">Author information unavailable.</p>
        ) : (
          <>
            <p id="publication-authors" className="mt-3 leading-relaxed">
              {visibleAuthors.map((author, index) => (
                <span key={`${author.authorId ?? author.authorName}-${index}`}>
                  {index > 0 && "; "}
                  <strong className="font-semibold">
                    {author.authorName}
                  </strong>{" "}
                  {showAllAuthors && (
                    <span className="italic">
                      (
                      {author.institutions.length > 0
                        ? author.institutions
                            .map(
                              (institution) =>
                                `${institution.name}, ${countryName(institution.countryCode)}`,
                            )
                            .join("; ")
                        : "Affiliation information unavailable"}
                      )
                    </span>
                  )}
                </span>
              ))}
            </p>
            {publication.authorships.length > 0 && (
              <button
                type="button"
                aria-expanded={showAllAuthors}
                aria-controls="publication-authors"
                onClick={() =>
                  setExpandedPublicationId(
                    showAllAuthors ? null : publication.id,
                  )
                }
                className="mt-2 py-1 text-sm text-[#0074c6] underline underline-offset-2"
              >
                {showAllAuthors
                  ? "Show less"
                  : "Show all authors and affiliations"}
              </button>
            )}
          </>
        )}
      </section>

      <section aria-labelledby="institutions-heading">
        <h2 id="institutions-heading" className="text-xl font-semibold">
          Institutions and countries
        </h2>
        {institutions.length === 0 ? (
          <p className="mt-3">Institution information unavailable.</p>
        ) : (
          <>
            <p id="publication-institutions" className="mt-3 leading-relaxed">
              {visibleInstitutions.map((institution, index) => (
                <span key={institution.id}>
                  {index > 0 && "; "}
                  <strong className="font-semibold">
                    {institution.name}
                  </strong>{" "}
                  <span className="italic">
                    ({countryName(institution.countryCode)})
                  </span>
                </span>
              ))}
            </p>
            {institutions.length > 8 && (
              <button
                type="button"
                aria-expanded={showAllInstitutions}
                aria-controls="publication-institutions"
                onClick={() =>
                  setExpandedInstitutionsId(
                    showAllInstitutions ? null : publication.id,
                  )
                }
                className="mt-2 py-1 text-sm text-[#0074c6] underline underline-offset-2"
              >
                {showAllInstitutions
                  ? "Show less"
                  : `Show ${institutions.length - 8} more institutions`}
              </button>
            )}
          </>
        )}
      </section>

      <section aria-labelledby="topics-heading">
        <h2 id="topics-heading" className="text-xl font-semibold">
          Topics
        </h2>
        <p className="mt-3">
          {publication.topics.map((topic) => topic.name).join(", ") ||
            "Topic information unavailable."}
        </p>
      </section>

      <section aria-labelledby="links-heading">
        <h2 id="links-heading" className="text-xl font-semibold">
          Publication links
        </h2>
        <ul className="mt-3 space-y-3 break-words">
          {publication.doi && (
            <li>
              <a
                className="text-[#0074c6] underline underline-offset-2"
                href={publication.doi}
              >
                DOI: {publication.doi.replace("https://doi.org/", "")}
              </a>
            </li>
          )}
          {publication.landingPageUrl &&
            publication.landingPageUrl !== publication.doi && (
              <li>
                <a
                  className="text-[#0074c6] underline underline-offset-2"
                  href={publication.landingPageUrl}
                >
                  View publication
                </a>
              </li>
            )}
          {publication.openAccess.url && (
            <li>
              <a
                className="text-[#0074c6] underline underline-offset-2"
                href={publication.openAccess.url}
              >
                Read open access version
              </a>
            </li>
          )}
          <li>
            <a
              className="text-[#0074c6] underline underline-offset-2"
              href={publication.id}
            >
              View record on OpenAlex
            </a>
          </li>
        </ul>
      </section>
    </article>
  );
}
