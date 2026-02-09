"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ProcessedRecord } from "@/lib/types";

interface ConsumptionChartProps {
  records: ProcessedRecord[];
}

const FLAG_COLORS: Record<string, string> = {
  normal: "#0d9488",        // teal-600
  gap_estimated: "#f59e0b", // amber-500
  counter_reset: "#ef4444", // red-500
  overflow: "#8b5cf6",     // violet-500
};

/**
 * Bar chart showing hourly consumption for a single meter.
 * Bars are color-coded by flag type.
 */
export default function ConsumptionChart({ records }: ConsumptionChartProps) {
  const data = records.map((r) => ({
    hour: r.hour.replace("T", " ").replace("Z", ""),
    consumption: Number(r.consumption.toFixed(2)),
    flag: r.flag,
  }));

  return (
    <div>
      {/* Color legend */}
      <div className="mb-3 flex gap-4 text-xs text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: FLAG_COLORS.normal }} />
          Normal
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: FLAG_COLORS.gap_estimated }} />
          Gap Estimated
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: FLAG_COLORS.counter_reset }} />
          Counter Reset
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: FLAG_COLORS.overflow }} />
          Overflow (32-bit)
        </span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 10, fill: "#64748b" }}
            tickFormatter={(v: string) => v.slice(11, 16)}
          />
          <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
          <Tooltip />
          <Bar dataKey="consumption" name="Consumption (gal)" radius={[3, 3, 0, 0]}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={FLAG_COLORS[entry.flag] ?? FLAG_COLORS.normal} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
