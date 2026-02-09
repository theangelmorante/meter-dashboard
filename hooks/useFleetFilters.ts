"use client";

import { useMemo, useState } from "react";
import type { FleetMeterSummary } from "@/lib/fleet";

export type SortField = "meterId" | "latestTimestamp" | "totalConsumption" | "status";
type SortDir = "asc" | "desc";

export interface FleetFilters {
  search: string;
  status: "all" | "active" | "stale";
}

/**
 * Hook that encapsulates fleet overview filtering and sorting logic.
 * Keeps UI components free of business logic.
 */
export function useFleetFilters(fleet: FleetMeterSummary[]) {
  const [filters, setFilters] = useState<FleetFilters>({ search: "", status: "all" });
  const [sortField, setSortField] = useState<SortField>("meterId");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    let list = [...fleet];

    // Filter by search (meter ID)
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((m) => m.meterId.toLowerCase().includes(q));
    }

    // Filter by status
    if (filters.status !== "all") {
      list = list.filter((m) => m.status === filters.status);
    }

    // Sort
    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === "totalConsumption") {
        cmp = a.totalConsumption - b.totalConsumption;
      } else if (sortField === "latestTimestamp") {
        cmp = a.latestTimestamp.localeCompare(b.latestTimestamp);
      } else {
        cmp = a[sortField].localeCompare(b[sortField]);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [fleet, filters, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const resetFilters = () => {
    setFilters({ search: "", status: "all" });
    setSortField("meterId");
    setSortDir("asc");
  };

  return { filtered, filters, setFilters, sortField, sortDir, toggleSort, resetFilters };
}
