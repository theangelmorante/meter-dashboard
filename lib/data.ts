import { processReadings } from "./processor";
import { buildFleetSummary } from "./fleet";
import type { RawReading } from "./types";
import readingsData from "@/data/readings.json";

/**
 * Single source of truth for all processed data.
 * Computed once at module level — all consumers share the same result.
 */
export const rawReadings = readingsData as RawReading[];
export const processedRecords = processReadings(rawReadings);
export const fleetSummary = buildFleetSummary(rawReadings, processedRecords);
export const meterIds = [...new Set(rawReadings.map((r) => r.meterId))];
