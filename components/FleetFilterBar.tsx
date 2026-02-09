"use client";

import type { FleetFilters, SortField } from "@/hooks/useFleetFilters";

interface FleetFilterBarProps {
  filters: FleetFilters;
  setFilters: (f: FleetFilters) => void;
  sortField: SortField;
  sortDir: "asc" | "desc";
  onToggleSort: (field: SortField) => void;
  onReset: () => void;
}

const SORT_LABELS: Record<SortField, string> = {
  meterId: "Meter ID",
  latestTimestamp: "Last Reading",
  totalConsumption: "Consumption",
  status: "Status",
};

export default function FleetFilterBar({
  filters,
  setFilters,
  sortField,
  sortDir,
  onToggleSort,
  onReset,
}: FleetFilterBarProps) {
  const hasActiveFilters = filters.search !== "" || filters.status !== "all";

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <input
        type="text"
        placeholder="Search meter ID..."
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        className="w-48 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
      />
      <select
        value={filters.status}
        onChange={(e) =>
          setFilters({ ...filters, status: e.target.value as "all" | "active" | "stale" })
        }
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
      >
        <option value="all">All statuses</option>
        <option value="active">Active</option>
        <option value="stale">Stale</option>
      </select>

      {(["meterId", "latestTimestamp", "totalConsumption"] as const).map((field) => (
        <button
          key={field}
          onClick={() => onToggleSort(field)}
          className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
            sortField === field
              ? "bg-teal-600 text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          {SORT_LABELS[field]} {sortField === field && (sortDir === "asc" ? "↑" : "↓")}
        </button>
      ))}

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="rounded-lg bg-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-300 transition-colors"
        >
          Reset
        </button>
      )}
    </div>
  );
}
