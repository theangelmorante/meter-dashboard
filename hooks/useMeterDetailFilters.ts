"use client";

import { useMemo, useState } from "react";
import type { ProcessedRecord } from "@/lib/types";

export type MeterDetailSortField = "hour" | "consumption" | "flag";
type SortDir = "asc" | "desc";

export interface MeterDetailFilters {
  flag: "all" | "normal" | "gap_estimated" | "counter_reset";
}

/**
 * Hook that encapsulates meter detail filtering and sorting logic.
 */
export function useMeterDetailFilters(records: ProcessedRecord[]) {
  const [filters, setFilters] = useState<MeterDetailFilters>({ flag: "all" });
  const [sortField, setSortField] = useState<MeterDetailSortField>("hour");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    let list = [...records];

    // Filter by flag
    if (filters.flag !== "all") {
      list = list.filter((r) => r.flag === filters.flag);
    }

    // Sort
    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === "consumption") {
        cmp = a.consumption - b.consumption;
      } else {
        cmp = a[sortField].localeCompare(b[sortField]);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [records, filters, sortField, sortDir]);

  const toggleSort = (field: MeterDetailSortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const resetFilters = () => {
    setFilters({ flag: "all" });
    setSortField("hour");
    setSortDir("asc");
  };

  return { filtered, filters, setFilters, sortField, sortDir, toggleSort, resetFilters };
}
