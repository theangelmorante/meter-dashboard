"use client";

import { useMemo } from "react";
import { useData } from "@/contexts/DataContext";
import { getFleetStats } from "@/lib/fleet";

/**
 * Returns global fleet stats (total consumption, incident count) from processed data.
 * Logic lives in lib/fleet.getFleetStats; this hook only wires context to it.
 */
export function useFleetStats() {
  const { processed } = useData();
  return useMemo(() => getFleetStats(processed), [processed]);
}
