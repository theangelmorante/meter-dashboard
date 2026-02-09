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

## Project Structure

```
├── app/
│   ├── layout.tsx               # Root layout (Header + DataProvider)
│   ├── page.tsx                 # Fleet Overview (landing page)
│   └── meter/[id]/
│       └── page.tsx             # Meter Detail page
├── components/
│   ├── Header.tsx               # Shared header with company name
│   ├── FleetView.tsx            # Fleet overview with cards and filters
│   ├── MeterDetail.tsx          # Meter detail (2-col: chart + table)
│   └── ConsumptionChart.tsx     # Recharts bar chart
├── contexts/
│   └── DataContext.tsx           # React context (no external deps)
├── hooks/
│   ├── useFleetFilters.ts       # Fleet filtering/sorting logic
│   └── useMeterDetailFilters.ts # Detail filtering/sorting logic
├── lib/
│   ├── processor.ts             # Core processing logic (pure function)
│   ├── fleet.ts                 # Fleet summary builder
│   ├── types.ts                 # TypeScript interfaces
│   └── data.ts                  # Single source of truth (avoids reprocessing)
├── data/
│   └── readings.json            # Provided sample data
├── tests/
│   └── processor.test.ts        # Unit tests (4 cases)
└── README.md
```

## Processing Logic

The processor (`lib/processor.ts`) is a **pure function** with no React or Next.js dependencies. It handles:

| Case              | Rule                                                                 | Flag             |
|-------------------|----------------------------------------------------------------------|------------------|
| Normal delta      | `current - previous` cumulative volume                               | `normal`         |
| Hourly bucketing  | Delta assigned to the earlier reading's hour                         | —                |
| Gap handling      | Distribute consumption evenly across all missing hourly buckets      | `gap_estimated`  |
| Counter reset     | If current < previous, delta = current value                         | `counter_reset`  |

## Architecture Decisions

- **No reprocessing**: Raw data is processed once in `lib/data.ts` at module level. A native React context (`DataProvider`) distributes the result to all client components — no data is recomputed across pages.
- **Logic outside components**: Filtering and sorting live in custom hooks (`useFleetFilters`, `useMeterDetailFilters`), keeping components focused on presentation.

## Tradeoff / Assumption

I chose to compute the number of gap buckets based on the **hour-bucket difference** (i.e., the truncated start-of-hour of each reading) rather than the raw time difference divided by 3600. This means two readings like `10:07` and `14:02` produce exactly 4 buckets (10, 11, 12, 13) — matching the spec example — rather than ≈3.9 buckets from raw millisecond math. The tradeoff is that very short intervals near hour boundaries (e.g., `10:59` → `11:01`) are always treated as adjacent-hour normal deltas even though only 2 minutes apart, which seemed like the most intuitive behavior for an hourly dashboard.
