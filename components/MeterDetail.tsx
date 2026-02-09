"use client";

import Link from "next/link";
import { useData } from "@/contexts/DataContext";
import { useMeterDetailFilters } from "@/hooks/useMeterDetailFilters";
import ConsumptionChart from "@/components/ConsumptionChart";
import MeterDetailFilterBar from "@/components/MeterDetailFilterBar";
import MeterDetailTable from "@/components/MeterDetailTable";

interface MeterDetailProps {
  meterId: string;
}

export default function MeterDetail({ meterId }: MeterDetailProps) {
  const { processed } = useData();
  const meterRecords = processed.filter((r) => r.meterId === meterId);
  const { filtered, filters, setFilters, sortField, sortDir, toggleSort, resetFilters } =
    useMeterDetailFilters(meterRecords);

  if (meterRecords.length === 0) {
    return (
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 transition-colors hover:text-teal-800"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to Fleet Overview
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-slate-800">Meter not found</h1>
        <p className="mt-2 text-slate-500">
          No data available for meter <span className="font-mono">{meterId}</span>.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 transition-colors hover:text-teal-800"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to Fleet Overview
      </Link>

      <h1 className="mt-3 mb-1 text-2xl font-bold text-slate-800">
        Meter <span className="text-teal-700">{meterId}</span>
      </h1>
      <p className="mb-5 text-sm text-slate-500">
        Hourly consumption overview — {filtered.length} record{filtered.length !== 1 ? "s" : ""} shown
        {filters.flag !== "all" && ` (filtered by ${filters.flag})`}
      </p>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Hourly Consumption
          </h2>
          {filtered.length === 0 ? (
            <p className="flex h-[280px] items-center justify-center text-sm text-slate-400">
              No records match the current filter.
            </p>
          ) : (
            <ConsumptionChart records={filtered} />
          )}
        </div>

        <div className="flex flex-col rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Records
          </h2>
          <MeterDetailFilterBar
            filters={filters}
            setFilters={setFilters}
            sortField={sortField}
            sortDir={sortDir}
            onToggleSort={toggleSort}
            onReset={resetFilters}
          />
          <MeterDetailTable records={filtered} />
        </div>
      </div>
    </div>
  );
}
