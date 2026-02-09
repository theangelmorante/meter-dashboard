"use client";

import { createContext, useContext } from "react";
import type { ProcessedRecord } from "@/lib/types";
import type { FleetMeterSummary } from "@/lib/fleet";

interface DataContextValue {
  fleet: FleetMeterSummary[];
  processed: ProcessedRecord[];
  meterIds: string[];
}

const DataContext = createContext<DataContextValue | null>(null);

/**
 * Provides pre-processed meter data to all client components.
 * Data is computed once in the server and passed as props — no re-processing.
 */
export function DataProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: DataContextValue;
}) {
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

/**
 * Hook to consume meter data from context.
 */
export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
