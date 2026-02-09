"use client";

import Link from "next/link";
import type { FleetMeterSummary } from "@/lib/fleet";

interface FleetMeterCardsProps {
  fleet: FleetMeterSummary[];
  /** When this key changes, the list re-mounts and plays entrance animation (smooth transition on filter/sort). */
  listKey?: string;
}

export default function FleetMeterCards({ fleet, listKey = "default" }: FleetMeterCardsProps) {
  if (fleet.length === 0) {
    return (
      <p className="py-8 text-center text-slate-400 animate-fade-in">
        No meters match your filters.
      </p>
    );
  }

  return (
    <div key={listKey} className="flex flex-col gap-3">
      {fleet.map((row, index) => (
        <Link
          key={row.meterId}
          href={`/meter/${row.meterId}`}
          className="group flex items-center rounded-xl border border-slate-100 bg-white px-5 py-4 shadow-sm transition-all hover:border-teal-200 hover:shadow-md animate-fade-in"
          style={{ animationDelay: `${index * 40}ms` }}
        >
          <div className="w-32 shrink-0">
            <span className="text-xs uppercase tracking-wider text-slate-400">Meter</span>
            <p className="font-mono text-base font-semibold text-teal-700 group-hover:text-teal-800">
              {row.meterId}
            </p>
          </div>

          <div className="min-w-0 flex-1 px-4">
            <span className="text-xs uppercase tracking-wider text-slate-400">Last Reading</span>
            <p className="truncate text-sm text-slate-700">
              {row.latestTimestamp
                ? new Date(row.latestTimestamp).toUTCString().replace("GMT", "UTC")
                : "—"}
            </p>
          </div>

          <div className="w-36 shrink-0 px-4 text-right">
            <span className="text-xs uppercase tracking-wider text-slate-400">Consumption</span>
            <p className="text-base font-semibold text-slate-800">
              {row.totalConsumption.toFixed(1)}{" "}
              <span className="text-xs font-normal text-slate-500">gal</span>
            </p>
          </div>

          <div className="w-24 shrink-0 text-right">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                row.status === "active"
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
              }`}
            >
              <span
                className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                  row.status === "active" ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              {row.status}
            </span>
          </div>

          <div className="ml-3 text-slate-300 transition-colors group-hover:text-teal-500">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
}
