export function PublicationSearchControls() {
  return (
    <section aria-label="Publication search and filters" className="mt-7">
      <p id="search-preview-note" className="mb-3 text-sm">
        Search and filters are not available yet.
      </p>
      <fieldset disabled aria-describedby="search-preview-note">
        <legend className="sr-only">Search and filters</legend>
        <div className="flex flex-wrap gap-2 rounded-sm border-2 border-[#0074c6] p-1.5">
          <label className="sr-only" htmlFor="search-type">
            Search by
          </label>
          <select
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
            placeholder="Search publication titles…"
            className="min-w-0 flex-1 basis-40 bg-white px-3 py-2 placeholder:text-[#52675d]"
          />
          <button
            type="button"
            className="rounded-sm bg-[#0074c6] px-5 py-2 font-semibold text-white"
          >
            Search
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <label
            className="flex w-full flex-col gap-1 text-sm font-semibold sm:w-auto"
            htmlFor="institution-filter"
          >
            Institution
            <select
              id="institution-filter"
              className="rounded-sm border border-[#b5cccf] bg-white px-3 py-2 text-base font-normal sm:min-w-64"
            >
              <option>All institutions</option>
            </select>
          </label>
          <label
            className="flex w-full flex-col gap-1 text-sm font-semibold sm:w-auto"
            htmlFor="topic-filter"
          >
            Topic
            <select
              id="topic-filter"
              className="rounded-sm border border-[#b5cccf] bg-white px-3 py-2 text-base font-normal sm:min-w-48"
            >
              <option>All topics</option>
            </select>
          </label>
        </div>
      </fieldset>
    </section>
  );
}
