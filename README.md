# ION Energy Solutions — Meter Telemetry Dashboard

A Next.js (App Router) application that processes raw water-meter telemetry readings into hourly consumption records and displays them in a dashboard.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Charting**: Recharts
- **Testing**: Vitest

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the Fleet Overview.

## Running Tests

```bash
# Run tests once
npm run test:run

# Run tests in watch mode
npm test
```

## What the App Does (per spec)

- **Fleet Overview** (landing): Stat cards (total meters, consumption, incidents), search/sort filters, and meter cards showing **ID**, **latest reading** (timestamp + volume), **total consumption**, and **status** — *active* if the meter reported in the last 2 hours.
- **Meter Detail** (`/meter/[id]`): Hourly **bar chart** (Recharts) and **data table** with optional filter by flag (normal, gap estimated, counter reset).

## Project Structure

```
├── app/
│   ├── layout.tsx               # Root layout (Header + DataProvider)
│   ├── page.tsx                 # Fleet Overview (landing page)
│   └── meter/[id]/
│       └── page.tsx             # Meter Detail page
├── components/
│   ├── Header.tsx               # Shared header
│   ├── FleetView.tsx            # Fleet overview container
│   ├── FleetStatCards.tsx       # Total meters, consumption, incidents
│   ├── FleetFilterBar.tsx       # Search + sort
│   ├── FleetMeterCards.tsx      # Meter cards (ID, latest, consumption, status)
│   ├── FleetSkeleton.tsx        # Loading skeleton
│   ├── EmptyState.tsx           # "No meters found" state
│   ├── MeterDetail.tsx           # Detail layout (chart + table)
│   ├── ConsumptionChart.tsx    # Recharts hourly bar chart
│   ├── MeterDetailFilterBar.tsx # Flag filter for table
│   └── MeterDetailTable.tsx     # Hourly data table
├── contexts/
│   └── DataContext.tsx          # Processed data + fleet summary (no reprocessing)
├── hooks/
│   ├── useFleetFilters.ts       # Fleet search/sort
│   ├── useFleetStats.ts         # Fleet-wide stats
│   └── useMeterDetailFilters.ts # Detail flag filter
├── lib/
│   ├── processor.ts             # Core processing (pure function, no React)
│   ├── fleet.ts                 # Fleet summary + stats
│   ├── types.ts                 # RawReading, ProcessedRecord
│   └── data.ts                  # Single source of truth (readings → processed)
├── data/
│   └── readings.json            # Sample raw readings
├── tests/
│   └── processor.test.ts        # Unit tests (6 cases)
└── README.md
```

## Processing Logic

The processor (`lib/processor.ts`) is a **pure function** with no React or Next.js dependencies. It uses three flags (per spec):

| Case              | Rule                                                                 | Flag             |
|-------------------|----------------------------------------------------------------------|------------------|
| Normal delta      | `current - previous` cumulative volume                               | `normal`         |
| Hourly bucketing  | Delta assigned to the earlier reading's hour                         | —                |
| Gap handling      | Distribute consumption evenly across all missing hourly buckets      | `gap_estimated`  |
| Counter reset     | If current < previous: **physical reset** → delta = current volume   | `counter_reset`  |
| 32-bit overflow   | If current < previous and previous ≥ 2³¹: delta = (MAX_32 − prev) + current; still flagged `counter_reset` | `counter_reset`  |

So only **normal**, **gap_estimated**, and **counter_reset** appear in the UI; overflow is handled for correct consumption but not as a separate flag.

## Architecture Decisions

- **No reprocessing**: Raw data is processed once in `lib/data.ts` at module level. A React context (`DataProvider`) distributes processed data and fleet summary to all client components.
- **Logic outside components**: Filtering and sorting live in custom hooks (`useFleetFilters`, `useMeterDetailFilters`), keeping components focused on presentation.

## Tradeoff / Assumption

Gap bucket count is based on the **hour-bucket difference** (truncated start-of-hour of each reading), not raw time ÷ 3600. So e.g. `10:07` and `14:02` yield 4 buckets (10, 11, 12, 13). Very short spans across an hour boundary (e.g. `10:59` → `11:01`) are treated as one normal delta, which fits an hourly dashboard.
