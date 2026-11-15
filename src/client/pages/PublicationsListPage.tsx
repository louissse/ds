import { PublicationSearchControls } from "../components/PublicationSearchControls";
import { PublicationListItem } from "../components/PublicationListItem";
import { usePublications } from "../hooks/usePublications";
import { useSearchParams } from "react-router";
import { PublicationListSkeleton } from "../components/PublicationListSkeleton";

export default function PublicationsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const institution = searchParams.get("institution") ?? "";
  const requestedPage = Number(searchParams.get("page") ?? "1");
  const query = searchParams.get("q")?.trim() ?? "";

  const page =
    Number.isInteger(requestedPage) &&
    requestedPage >= 1 &&
    requestedPage <= 1000
      ? requestedPage
      : 1;

  const { data, isPending, isError, refetch, isFetching } = usePublications(
    page,
    query,
    institution,
  );

  function goToPage(nextPage: number) {
    setSearchParams((current) => {
      const updated = new URLSearchParams(current);
      updated.set("page", String(nextPage));
      return updated;
    });
  }

  function searchPublications(nextQuery: string) {
    setSearchParams((current) => {
      const updated = new URLSearchParams(current);
      if (nextQuery) {
        updated.set("q", nextQuery);
      } else {
        updated.delete("q");
      }
      if (nextQuery !== query) {
        updated.delete("institution");
      }
      updated.set("page", "1");
      return updated;
    });
  }

  function changeInstitution(id: string) {
    setSearchParams((current) => {
      const updated = new URLSearchParams(current);
      if (id) updated.set("institution", id);
      else updated.delete("institution");
      updated.set("page", "1");
      return updated;
    });
  }

  const totalPages = data
    ? Math.min(Math.ceil(data.total / data.pageSize), 1000)
    : 0;

  return (
    <main className="mx-auto max-w-5xl border-t-4 border-[#0074c6] px-5 py-8 text-[#002e2e] sm:px-8">
      <header className="border-l-4 border-[#0074c6] bg-[#F4F7FC] p-5 sm:p-7">
        <p className="text-xs font-semibold tracking-wide uppercase">
          Publications, Danish institutions
        </p>
        <h1 className="mt-2 text-3xl leading-tight font-bold sm:text-4xl">
          Climate research in Denmark
        </h1>
        <p className="mt-4">
          Discover publications connected to Danish research institutions.
        </p>
        <ul
          aria-label="Collection scope"
          className="mt-5 flex flex-wrap gap-2 text-sm"
        >
          {["Climate change", "Danish affiliations", "Published in 2025"].map(
            (scope) => (
              <li
                key={scope}
                className="border border-[#b5cccf] bg-white px-2.5 py-1"
              >
                {scope}
              </li>
            ),
          )}
        </ul>
      </header>
      <PublicationSearchControls
        key={query}
        query={query}
        onSearch={searchPublications}
        institution={institution}
        onInstitutionChange={changeInstitution}
      />
      {data && !isError && (
        <p className="mt-7 border-b-2 border-[#002e2e] pb-3" aria-live="polite">
          {data.total.toLocaleString("en-GB")} publications
        </p>
      )}

      {isPending ? (
        <PublicationListSkeleton />
      ) : isError ? (
        <div role="alert">
          <p>We couldn’t load publications. Please try again.</p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-2 underline"
          >
            {isFetching ? "Trying again…" : "Try again"}
          </button>
        </div>
      ) : data.results.length === 0 ? (
        <p>No publications found.</p>
      ) : (
        <ul className="mt-6">
          {data.results.map((publication) => (
            <PublicationListItem
              key={publication.id}
              publication={publication}
            />
          ))}
        </ul>
      )}
      {data && totalPages > 0 && (
        <nav
          aria-label="Publication pages"
          className="mt-6 flex flex-wrap items-center justify-between gap-4"
        >
          <span aria-live="polite">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="rounded-sm border px-4 py-2 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              className="rounded-sm border px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </nav>
      )}
    </main>
  );
}
