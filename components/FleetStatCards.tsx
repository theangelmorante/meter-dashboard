"use client";

import { useFleetStats } from "@/hooks/useFleetStats";

export default function FleetStatCards() {
  const stats = useFleetStats();

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Total consumption
        </span>
        <p className="mt-1 text-2xl font-bold text-slate-800">
          {stats.totalConsumption.toLocaleString("en-US", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}
          <span className="ml-1 text-base font-normal text-slate-500">gal</span>
        </p>
      </div>
      <div className="rounded-xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Incidents
        </span>
        <p className="mt-1 text-2xl font-bold text-slate-800">
          {stats.incidentCount}
          <span className="ml-1 text-sm font-normal text-slate-500">
            (gaps + counter resets)
          </span>
        </p>
      </div>
    </div>
  );
}
