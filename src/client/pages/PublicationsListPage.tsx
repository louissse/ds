import { PublicationListItem } from "../components/PublicationListItem";
import { usePublications } from "../hooks/usePublications";
import { useSearchParams } from "react-router";
import { PublicationListSkeleton } from "../components/PublicationListSkeleton";

export default function PublicationsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedPage = Number(searchParams.get("page") ?? "1");

  const page =
    Number.isInteger(requestedPage) &&
    requestedPage >= 1 &&
    requestedPage <= 1000
      ? requestedPage
      : 1;

  const { data, isPending, isError, refetch, isFetching } =
    usePublications(page);

  function goToPage(nextPage: number) {
    setSearchParams((current) => {
      const updated = new URLSearchParams(current);
      updated.set("page", String(nextPage));
      return updated;
    });
  }

  const totalPages = data
    ? Math.min(Math.ceil(data.total / data.pageSize), 1000)
    : 0;

  return (
    <main className="p-8 text-[#002e2e]">
      <h1 className="text-3xl font-bold">Climate research in Denmark</h1>

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
