"use client";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export default function EmptyState({
  title = "No meters found",
  message = "The dataset has no meter readings. Add data to readings.json to see the fleet overview.",
}: EmptyStateProps) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-white py-16 px-6 shadow-sm">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <svg
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.5a2 2 0 012 2v14a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      <p className="mt-2 max-w-sm text-center text-sm text-slate-500">{message}</p>
    </div>
  );
}
