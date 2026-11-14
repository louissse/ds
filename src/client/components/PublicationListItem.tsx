import type { Publication } from "../../shared/publications";
import { Link, useLocation } from "react-router";

type PublicationListItemProps = {
  publication: Publication;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function PublicationListItem({ publication }: PublicationListItemProps) {
  const visibleAuthors = publication.authorships.slice(0, 3);
  const remainingAuthorCount =
    publication.authorships.length - visibleAuthors.length;

  // Multiple authors can share an institution; identify it by OpenAlex ID.
  const institutions = [
    ...new Map(
      visibleAuthors.flatMap((authorship) =>
        authorship.institutions.map((institution) => [
          institution.id,
          institution,
        ]),
      ),
    ).values(),
  ];

  const location = useLocation();
  const id = publication.id.split("/").pop();

  return (
    <li className="border-b border-[#b5cccf] py-4">
      <article className="space-y-2.5 text-[#002e2e]">
        <div>
          <p className="text-sm leading-tight">
            <time dateTime={publication.publicationDate}>
              {dateFormatter.format(new Date(publication.publicationDate))}
            </time>
            {publication.openAccess.isOpenAccess && ", Open access"}
          </p>
          <h2 className="text-xl leading-tight font-semibold text-[#0074c6]">
            <Link
              to={`/publication/${id}`}
              state={{ from: location.pathname + location.search }}
              className="hover:underline"
            >
              {publication.title}
            </Link>
          </h2>
        </div>

        <div>
          <p className="leading-snug">
            {visibleAuthors.map((author) => author.authorName).join(", ") ||
              "Author information unavailable"}
            {remainingAuthorCount > 0 && ` and ${remainingAuthorCount} more`}
          </p>
          <p className="text-sm">
            {institutions.map((institution) => institution.name).join(", ") ||
              "Institution information unavailable"}
          </p>
        </div>

        <p className="text-sm">
          <span className="font-semibold text-[#0074c6]">Topics: </span>
          <span className="font-semibold">
            {publication.topics.map((topic) => topic.name).join(", ") ||
              "Topic information unavailable"}
          </span>
        </p>
      </article>
    </li>
  );
}
