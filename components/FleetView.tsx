"use client";

import { useData } from "@/contexts/DataContext";
import { useFleetFilters } from "@/hooks/useFleetFilters";
import FleetStatCards from "@/components/FleetStatCards";
import FleetFilterBar from "@/components/FleetFilterBar";
import FleetMeterCards from "@/components/FleetMeterCards";

export default function FleetView() {
  const { fleet } = useData();
  const { filtered, filters, setFilters, sortField, sortDir, toggleSort, resetFilters } =
    useFleetFilters(fleet);

  return (
    <div>
      <FleetStatCards />

      <FleetFilterBar
        filters={filters}
        setFilters={setFilters}
        sortField={sortField}
        sortDir={sortDir}
        onToggleSort={toggleSort}
        onReset={resetFilters}
      />

      <FleetMeterCards fleet={filtered} />
    </div>
  );
}
