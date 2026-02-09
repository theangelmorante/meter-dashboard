"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-teal-700 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          {/* Simple bolt icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span className="text-lg font-bold tracking-tight">ION Energy Solutions</span>
        </Link>
        <span className="hidden sm:block text-teal-200 text-sm">Meter Telemetry Dashboard</span>
      </div>
    </header>
  );
}
