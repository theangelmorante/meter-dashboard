"use client";

export default function FleetSkeleton() {
  return (
    <div className="opacity-90">
      {/* Stat cards skeleton */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-100 bg-white px-5 py-4 shadow-sm"
          >
            <div className="h-3 w-24 rounded bg-slate-200 animate-pulse" />
            <div className="mt-3 h-8 w-32 rounded bg-slate-200 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Filter bar skeleton */}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="h-9 w-48 rounded-lg bg-slate-200 animate-pulse" />
        <div className="h-9 w-28 rounded-lg bg-slate-200 animate-pulse" />
        <div className="h-9 w-20 rounded-lg bg-slate-200 animate-pulse" />
        <div className="h-9 w-24 rounded-lg bg-slate-200 animate-pulse" />
      </div>

      {/* Card list skeleton */}
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center rounded-xl border border-slate-100 bg-white px-5 py-4 shadow-sm"
          >
            <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
            <div className="ml-4 h-4 flex-1 max-w-[200px] rounded bg-slate-200 animate-pulse" />
            <div className="h-4 w-20 rounded bg-slate-200 animate-pulse" />
            <div className="ml-4 h-6 w-16 rounded-full bg-slate-200 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
