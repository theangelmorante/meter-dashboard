"use client";

import type { MeterDetailFilters, MeterDetailSortField } from "@/hooks/useMeterDetailFilters";

interface MeterDetailFilterBarProps {
  filters: MeterDetailFilters;
  setFilters: (f: MeterDetailFilters) => void;
  sortField: MeterDetailSortField;
  sortDir: "asc" | "desc";
  onToggleSort: (field: MeterDetailSortField) => void;
  onReset: () => void;
}

const SORT_LABELS: Record<MeterDetailSortField, string> = {
  hour: "Hour",
  consumption: "Consumption",
  flag: "Flag",
};

export default function MeterDetailFilterBar({
  filters,
  setFilters,
  sortField,
  sortDir,
  onToggleSort,
  onReset,
}: MeterDetailFilterBarProps) {
  const hasActiveFilters = filters.flag !== "all";

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <select
        value={filters.flag}
        onChange={(e) =>
          setFilters({ flag: e.target.value as MeterDetailFilters["flag"] })
        }
        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-sm outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
      >
        <option value="all">All flags</option>
        <option value="normal">Normal</option>
        <option value="gap_estimated">Gap Estimated</option>
        <option value="counter_reset">Counter Reset</option>
        <option value="overflow">Overflow (32-bit)</option>
      </select>

      {(["hour", "consumption", "flag"] as const).map((field) => (
        <button
          key={field}
          onClick={() => onToggleSort(field)}
          className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
            sortField === field
              ? "bg-teal-600 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          {SORT_LABELS[field]}
          {sortField === field && (sortDir === "asc" ? " ↑" : " ↓")}
        </button>
      ))}

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="rounded-lg bg-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-300 transition-colors"
        >
          Reset
        </button>
      )}
    </div>
  );
}
