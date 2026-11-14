export function PublicationListSkeleton() {
  return (
    <div className="mt-6" role="status">
      <span className="sr-only">Loading publications…</span>

      <ul aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => (
          <li
            key={index}
            className="space-y-2.5 border-b border-[#b5cccf] py-4 motion-safe:animate-pulse"
          >
            <div className="space-y-1">
              <div className="h-4 w-44 max-w-full bg-slate-200" />
              <div className="h-6 w-4/5 bg-slate-200" />
            </div>

            <div className="space-y-1">
              <div className="h-5 w-3/5 bg-slate-200" />
              <div className="h-4 w-2/5 bg-slate-200" />
            </div>

            <div className="h-4 w-2/3 bg-slate-200" />
          </li>
        ))}
      </ul>
    </div>
  );
}
