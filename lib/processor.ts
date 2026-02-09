import type { ProcessedRecord, RawReading } from "./types";

const MS_PER_HOUR = 60 * 60 * 1000;

// ─── Small utility functions ────────────────────────────────────────

/**
 * Truncates an ISO timestamp to the start of its hour.
 * "2025-02-05T10:03:22Z" → "2025-02-05T10:00:00Z"
 */
function toHourBucket(iso: string): string {
  const d = new Date(iso);
  d.setUTCMinutes(0, 0, 0);
  return d.toISOString().replace(".000Z", "Z");
}

/** Converts an ISO hour string to epoch milliseconds. */
function hourToMs(hour: string): number {
  return new Date(hour).getTime();
}

/** Converts epoch milliseconds to a clean ISO hour string. */
function msToHour(ms: number): string {
  return new Date(ms).toISOString().replace(".000Z", "Z");
}

// ─── Grouping & dedup ───────────────────────────────────────────────

/** Groups an array of readings by meterId. */
function groupByMeter(readings: RawReading[]): Record<string, RawReading[]> {
  const groups: Record<string, RawReading[]> = {};
  for (const r of readings) {
    (groups[r.meterId] ??= []).push(r);
  }
  return groups;
}

/** Removes consecutive readings that share the same timestamp. */
function dedup(readings: RawReading[]): RawReading[] {
  return readings.filter(
    (r, i) => i === 0 || r.timestamp !== readings[i - 1].timestamp
  );
}

// ─── Detection helpers ──────────────────────────────────────────────

/** Returns true if the meter counter has reset (current < previous). */
function isCounterReset(prev: RawReading, curr: RawReading): boolean {
  return curr.cumulativeVolume < prev.cumulativeVolume;
}

/** Returns how many hourly buckets separate two hour strings. */
function countBuckets(prevHour: string, currHour: string): number {
  return (hourToMs(currHour) - hourToMs(prevHour)) / MS_PER_HOUR;
}

// ─── Record builders ────────────────────────────────────────────────

/** Builds a single counter-reset record. */
function buildResetRecord(meterId: string, hour: string, currentVolume: number): ProcessedRecord {
  return { meterId, hour, consumption: currentVolume, flag: "counter_reset" };
}

/** Builds a single normal-delta record. */
function buildNormalRecord(meterId: string, hour: string, delta: number): ProcessedRecord {
  return { meterId, hour, consumption: delta, flag: "normal" };
}

/** Builds gap-estimated records distributed evenly across missing buckets. */
function buildGapRecords(meterId: string, startHour: string, delta: number, bucketCount: number): ProcessedRecord[] {
  const perBucket = delta / bucketCount;
  let t = hourToMs(startHour);

  return Array.from({ length: bucketCount }, () => {
    const record: ProcessedRecord = {
      meterId,
      hour: msToHour(t),
      consumption: perBucket,
      flag: "gap_estimated",
    };
    t += MS_PER_HOUR;
    return record;
  });
}

// ─── Pair processor ─────────────────────────────────────────────────

/** Processes a consecutive pair of readings into one or more hourly records. */
function processPair(prev: RawReading, curr: RawReading): ProcessedRecord[] {
  const prevHour = toHourBucket(prev.timestamp);
  const currHour = toHourBucket(curr.timestamp);

  if (isCounterReset(prev, curr)) {
    return [buildResetRecord(prev.meterId, prevHour, curr.cumulativeVolume)];
  }

  const delta = curr.cumulativeVolume - prev.cumulativeVolume;
  const buckets = countBuckets(prevHour, currHour);

  if (buckets <= 1) {
    return [buildNormalRecord(prev.meterId, prevHour, delta)];
  }

  return buildGapRecords(prev.meterId, prevHour, delta, buckets);
}

// ─── Per-meter processor ────────────────────────────────────────────

/** Processes all readings for a single meter into hourly records. */
function processMeter(readings: RawReading[]): ProcessedRecord[] {
  const cleaned = dedup(readings);
  const records: ProcessedRecord[] = [];

  for (let i = 1; i < cleaned.length; i++) {
    records.push(...processPair(cleaned[i - 1], cleaned[i]));
  }

  return records;
}

// ─── Public API ─────────────────────────────────────────────────────

/**
 * Processes raw meter readings into hourly consumption records.
 *
 * Business rules:
 *  - Delta: current cumulative − previous cumulative.
 *  - Hourly bucketing: assign delta to the earlier reading's hour.
 *  - Gap handling: distribute consumption evenly across missing hourly buckets.
 *  - Counter reset: if current < previous, delta = current value.
 *
 * Assumptions (per spec): input is pre-sorted by timestamp; duplicates are discarded.
 */
export function processReadings(readings: RawReading[]): ProcessedRecord[] {
  const byMeter = groupByMeter(readings);

  const allRecords = Object.values(byMeter).flatMap(processMeter);

  // Deterministic output: sort by hour, then meterId
  return allRecords.sort(
    (a, b) => a.hour.localeCompare(b.hour) || a.meterId.localeCompare(b.meterId)
  );
}
