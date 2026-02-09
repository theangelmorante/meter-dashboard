import type { ProcessedRecord, RawReading } from "./types";

export interface FleetMeterSummary {
  meterId: string;
  latestTimestamp: string;
  totalConsumption: number;
  status: "active" | "stale";
}

const MS_PER_TWO_HOURS = 2 * 60 * 60 * 1000;

// ─── Helper functions ───────────────────────────────────────────────

/** Returns the latest timestamp (in ms) across all raw readings. */
function getDatasetEndTime(raw: RawReading[]): number {
  return Math.max(...raw.map((r) => new Date(r.timestamp).getTime()));
}

/** Groups raw readings by meterId. */
function groupByMeter(raw: RawReading[]): Record<string, RawReading[]> {
  const groups: Record<string, RawReading[]> = {};
  for (const r of raw) {
    (groups[r.meterId] ??= []).push(r);
  }
  return groups;
}

/** Sums total consumption per meter from processed records. */
function sumConsumptionByMeter(processed: ProcessedRecord[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const p of processed) {
    totals[p.meterId] = (totals[p.meterId] ?? 0) + p.consumption;
  }
  return totals;
}

/** Extracts unique meter IDs preserving insertion order. */
function getUniqueMeterIds(raw: RawReading[]): string[] {
  return [...new Set(raw.map((r) => r.meterId))];
}

/** Returns the latest reading for a pre-sorted list of readings. */
function getLatestReading(readings: RawReading[]): RawReading | undefined {
  return readings[readings.length - 1];
}

/** Determines if a meter is active based on its latest reading time. */
function isMeterActive(latestTimestamp: string, referenceMs: number): boolean {
  return referenceMs - new Date(latestTimestamp).getTime() <= MS_PER_TWO_HOURS;
}

// ─── Fleet stats (for stat cards) ─────────────────────────────────────

export interface FleetStats {
  totalConsumption: number;
  incidentCount: number;
}

/** Total fleet consumption (gal) and count of gap_estimated + counter_reset + overflow events. */
export function getFleetStats(processed: ProcessedRecord[]): FleetStats {
  let totalConsumption = 0;
  let incidentCount = 0;

  for (const p of processed) {
    totalConsumption += p.consumption;
    if (p.flag === "gap_estimated" || p.flag === "counter_reset" || p.flag === "overflow")
      incidentCount += 1;
  }

  return { totalConsumption, incidentCount };
}

// ─── Public API ─────────────────────────────────────────────────────

/**
 * Builds a fleet overview summary from raw readings and processed records.
 *
 * Status:
 *  - "active" if the meter reported within the last 2 hours of the dataset
 *  - "stale" otherwise
 */
export function buildFleetSummary(
  raw: RawReading[],
  processed: ProcessedRecord[],
  referenceTime?: Date
): FleetMeterSummary[] {
  const ref = referenceTime?.getTime() ?? getDatasetEndTime(raw);
  const byMeter = groupByMeter(raw);
  const totals = sumConsumptionByMeter(processed);

  return getUniqueMeterIds(raw).map((meterId) => {
    const latest = getLatestReading(byMeter[meterId] ?? []);

    return {
      meterId,
      latestTimestamp: latest?.timestamp ?? "",
      totalConsumption: totals[meterId] ?? 0,
      status: latest && isMeterActive(latest.timestamp, ref) ? "active" : "stale",
    };
  });
}
