/**
 * Raw meter reading as received from the meter.
 */
export interface RawReading {
  meterId: string;
  timestamp: string; // ISO 8601
  cumulativeVolume: number;
}

/**
 * Processed hourly consumption record.
 * The flag field indicates:
 *  - "normal"         — standard delta between consecutive readings
 *  - "gap_estimated"  — consumption distributed across missing hourly buckets
 *  - "counter_reset"  — meter counter reset detected (current < previous)
 */
export interface ProcessedRecord {
  meterId: string;
  hour: string; // ISO 8601 hour start (e.g. "2025-02-05T10:00:00Z")
  consumption: number;
  flag: "normal" | "gap_estimated" | "counter_reset";
}
