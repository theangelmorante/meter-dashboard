import { describe, it, expect } from "vitest";
import { processReadings } from "@/lib/processor";
import type { RawReading } from "@/lib/types";

/**
 * Unit tests for the processor (PDF: at least one test per major case —
 * normal delta, gap, counter reset). Tests prove the code works and document
 * expected behavior.
 */
describe("processReadings", () => {
  it("returns empty array when there are no readings or only one reading (no pairs)", () => {
    expect(processReadings([])).toEqual([]);
    expect(
      processReadings([
        { meterId: "M1", timestamp: "2025-02-05T08:00:00Z", cumulativeVolume: 100 },
      ])
    ).toEqual([]);
  });

  it("computes normal delta and assigns it to the earlier reading's hour bucket", () => {
    const readings: RawReading[] = [
      { meterId: "MTR-001", timestamp: "2025-02-05T08:02:00Z", cumulativeVolume: 10000 },
      { meterId: "MTR-001", timestamp: "2025-02-05T09:05:00Z", cumulativeVolume: 10045 },
      { meterId: "MTR-001", timestamp: "2025-02-05T10:03:00Z", cumulativeVolume: 10090 },
    ];
    const result = processReadings(readings);

    expect(result).toHaveLength(2);

    expect(result[0]).toEqual({
      meterId: "MTR-001",
      hour: "2025-02-05T08:00:00Z",
      consumption: 45,
      flag: "normal",
    });

    expect(result[1]).toEqual({
      meterId: "MTR-001",
      hour: "2025-02-05T09:00:00Z",
      consumption: 45,
      flag: "normal",
    });
  });

  it("distributes consumption across gap hours and flags as gap_estimated", () => {
    // MTR-002 has a gap from 10:07 to 14:02 (4 hourly buckets: 10, 11, 12, 13)
    const readings: RawReading[] = [
      { meterId: "MTR-002", timestamp: "2025-02-05T10:07:00Z", cumulativeVolume: 52230 },
      { meterId: "MTR-002", timestamp: "2025-02-05T14:02:00Z", cumulativeVolume: 52530 },
    ];
    const result = processReadings(readings);

    expect(result).toHaveLength(4);

    const perBucket = 300 / 4; // 75
    expect(result[0]).toEqual({
      meterId: "MTR-002",
      hour: "2025-02-05T10:00:00Z",
      consumption: perBucket,
      flag: "gap_estimated",
    });
    expect(result[1]).toEqual({
      meterId: "MTR-002",
      hour: "2025-02-05T11:00:00Z",
      consumption: perBucket,
      flag: "gap_estimated",
    });
    expect(result[2]).toEqual({
      meterId: "MTR-002",
      hour: "2025-02-05T12:00:00Z",
      consumption: perBucket,
      flag: "gap_estimated",
    });
    expect(result[3]).toEqual({
      meterId: "MTR-002",
      hour: "2025-02-05T13:00:00Z",
      consumption: perBucket,
      flag: "gap_estimated",
    });
  });

  it("detects counter reset and flags as counter_reset (delta = current volume)", () => {
    // MTR-003 resets: previous 890410 → current 45
    const readings: RawReading[] = [
      { meterId: "MTR-003", timestamp: "2025-02-05T12:03:00Z", cumulativeVolume: 890410 },
      { meterId: "MTR-003", timestamp: "2025-02-05T13:01:00Z", cumulativeVolume: 45 },
    ];
    const result = processReadings(readings);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      meterId: "MTR-003",
      hour: "2025-02-05T12:00:00Z",
      consumption: 45,
      flag: "counter_reset",
    });
  });

  it("detects 32-bit overflow (wrap-around), computes real delta (MAX − prev) + current, flags as counter_reset", () => {
    // Counter at 4,294,967,290 then wraps to 10. Real consumption = (4,294,967,295 − 4,294,967,290) + 10 = 15
    const readings: RawReading[] = [
      { meterId: "M1", timestamp: "2025-02-05T08:00:00Z", cumulativeVolume: 4_294_967_290 },
      { meterId: "M1", timestamp: "2025-02-05T09:00:00Z", cumulativeVolume: 10 },
    ];
    const result = processReadings(readings);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      meterId: "M1",
      hour: "2025-02-05T08:00:00Z",
      consumption: 15, // (4,294,967,295 - 4,294,967,290) + 10 = 5 + 10
      flag: "counter_reset", // per PDF: only three flags; overflow is handled but flagged as counter_reset
    });
  });

  it("discards duplicate timestamps", () => {
    const readings: RawReading[] = [
      { meterId: "X", timestamp: "2025-01-01T08:00:00Z", cumulativeVolume: 100 },
      { meterId: "X", timestamp: "2025-01-01T08:00:00Z", cumulativeVolume: 100 },
      { meterId: "X", timestamp: "2025-01-01T09:00:00Z", cumulativeVolume: 150 },
    ];
    const result = processReadings(readings);
    expect(result).toHaveLength(1);
    expect(result[0].consumption).toBe(50);
  });
});
