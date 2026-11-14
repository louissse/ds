export function PublicationDetailSkeleton() {
  return (
    <div role="status" className="mt-6">
      <span className="sr-only">Loading publication…</span>
      <div aria-hidden="true" className="space-y-8 motion-safe:animate-pulse">
        <div className="space-y-3 border-l-4 border-[#0074c6] bg-[#F4F7FC] p-5 sm:p-7">
          <div className="h-4 w-24 bg-slate-200" />
          <div className="h-9 w-full bg-slate-200" />
          <div className="h-9 w-3/4 bg-slate-200" />
          <div className="mt-6 h-12 w-2/3 bg-slate-200" />
        </div>
        {[0, 1, 2].map((section) => (
          <div key={section} className="space-y-3">
            <div className="h-6 w-44 max-w-full bg-slate-200" />
            <div className="h-4 w-full bg-slate-200" />
            <div className="h-4 w-full bg-slate-200" />
            <div className="h-4 w-3/4 bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
