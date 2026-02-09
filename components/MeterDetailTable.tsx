"use client";

import type { ProcessedRecord } from "@/lib/types";

const FLAG_BADGE: Record<string, string> = {
  normal: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  gap_estimated: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  counter_reset: "bg-red-50 text-red-700 ring-1 ring-red-200",
  overflow: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
};

interface MeterDetailTableProps {
  records: ProcessedRecord[];
}

export default function MeterDetailTable({ records }: MeterDetailTableProps) {
  return (
    <div className="max-h-[350px] flex-1 overflow-auto rounded-lg border border-slate-100">
      <table className="w-full text-left text-sm">
        <thead className="sticky top-0 bg-slate-50">
          <tr className="border-b border-slate-200">
            <th className="px-3 py-2 font-medium text-slate-600">Hour</th>
            <th className="px-3 py-2 font-medium text-slate-600 text-right">Consumption</th>
            <th className="px-3 py-2 font-medium text-slate-600">Flag</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 && (
            <tr>
              <td colSpan={3} className="px-3 py-6 text-center text-slate-400">
                No records match your filters.
              </td>
            </tr>
          )}
          {records.map((rec, idx) => (
            <tr
              key={idx}
              className="border-b border-slate-50 last:border-0 animate-fade-in"
              style={{ animationDelay: `${idx * 25}ms` }}
            >
              <td className="px-3 py-2 font-mono text-xs text-slate-700">
                {rec.hour.replace("T", " ").replace("Z", "")}
              </td>
              <td className="px-3 py-2 text-right text-slate-800">
                {rec.consumption.toFixed(2)}
              </td>
              <td className="px-3 py-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${FLAG_BADGE[rec.flag] ?? ""}`}
                >
                  {rec.flag}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
