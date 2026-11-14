import { PublicationDetailSkeleton } from "../components/PublicationDetailSkeleton";
import { PublicationDetails } from "../components/PublicationDetails";
import { Link, useLocation, useParams } from "react-router";
import { usePublication } from "../hooks/usePublication";

export default function PublicationDetailPage() {
  const { id } = useParams();
  const {
    data: publication,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = usePublication(id ?? "");
  const location = useLocation();
  const backTo = location.state?.from ?? "/";

  return (
    <main className="mx-auto max-w-4xl px-5 py-8 text-[#002e2e] sm:px-8">
      <Link to={backTo} className="text-[#0074c6] underline">
        Back to results
      </Link>

      {!id ? (
        <p role="alert" className="mt-6">
          Invalid publication ID.
        </p>
      ) : isPending ? (
        <PublicationDetailSkeleton />
      ) : isError ? (
        <div role="alert" className="mt-6">
          <p>{error.message}</p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-2 underline"
          >
            {isFetching ? "Trying again…" : "Try again"}
          </button>
        </div>
      ) : (
        <PublicationDetails publication={publication} />
      )}
    </main>
  );
}
