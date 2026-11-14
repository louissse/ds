import { useState } from "react";
import { useInstitutions } from "../hooks/useInstitutions";

type PublicationSearchControlsProps = {
  query: string;
  institution: string;
  onInstitutionChange: (id: string) => void;
  onSearch: (query: string) => void;
};

export function PublicationSearchControls({
  query,
  onSearch,
  institution,
  onInstitutionChange,
}: PublicationSearchControlsProps) {
  const [searchText, setSearchText] = useState(query);
  const {
    data: institutions,
    isPending,
    isError,
    refetch,
  } = useInstitutions(query);

  return (
    <section aria-label="Publication search and filters" className="mt-7">
      <p id="search-preview-note" className="mb-3 text-sm">
        Author search, country search and the topic filter are not available
        yet.
      </p>
      <form
        aria-describedby="search-preview-note"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch(searchText.trim());
        }}
      >
        <div className="flex flex-wrap gap-2 rounded-sm border-2 border-[#0074c6] p-1.5">
          <label className="sr-only" htmlFor="search-type">
            Search by
          </label>
          <select
            disabled
            id="search-type"
            className="min-w-28 border-b border-[#b5cccf] bg-white px-3 py-2 sm:border-r sm:border-b-0"
          >
            <option>Title</option>
            <option>Author</option>
            <option>Country</option>
          </select>
          <label className="sr-only" htmlFor="publication-search">
            Search publications
          </label>
          <input
            id="publication-search"
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search publication titles…"
            className="min-w-0 flex-1 basis-40 bg-white px-3 py-2 placeholder:text-[#52675d]"
          />
          <button
            type="submit"
            className="rounded-sm bg-[#0074c6] px-5 py-2 font-semibold text-white"
          >
            Search
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-start gap-4">
          <div className="flex w-full min-w-0 flex-col gap-1 sm:w-auto sm:max-w-96">
            <label
              className="flex w-full flex-col gap-1 text-sm font-semibold sm:w-auto"
              htmlFor="institution-filter"
            >
              Institution
              <select
                disabled={isPending || (isError && !institutions)}
                value={institution}
                onChange={(event) => onInstitutionChange(event.target.value)}
                id="institution-filter"
                aria-describedby="institution-help"
                className="w-full rounded-sm border border-[#b5cccf] bg-white px-3 py-2 text-base font-normal sm:max-w-96"
              >
                <option value="">
                  {isPending
                    ? "Loading institutions…"
                    : isError
                      ? "Institutions unavailable"
                      : "All institutions"}
                </option>

                {institution &&
                  !institutions?.results.some((item) =>
                    item.id.endsWith(`/${institution}`),
                  ) && (
                    <option value={institution}>
                      Selected institution ({institution})
                    </option>
                  )}
                {institutions?.results.map((institution) => (
                  <option
                    key={institution.id}
                    value={institution.id.split("/").pop()}
                  >
                    {institution.name} ({institution.count})
                  </option>
                ))}
              </select>
            </label>
            <p id="institution-help" className="text-sm">
              Top 100 institutions in matching publications.
            </p>
            {isError && (
              <button
                type="button"
                onClick={() => refetch()}
                className="self-start text-sm text-[#0074c6] underline"
              >
                Retry loading institutions
              </button>
            )}
          </div>

          <label
            className="flex w-full flex-col gap-1 text-sm font-semibold sm:w-auto"
            htmlFor="topic-filter"
          >
            Topic
            <select
              disabled
              id="topic-filter"
              className="rounded-sm border border-[#b5cccf] bg-white px-3 py-2 text-base font-normal sm:min-w-48"
            >
              <option>All topics</option>
            </select>
          </label>
          {institution && (
            <button
              type="button"
              onClick={() => onInstitutionChange("")}
              className="self-start py-2 text-sm text-[#0074c6] underline sm:mt-6"
            >
              Clear filters
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
