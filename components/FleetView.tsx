"use client";

import { useEffect, useRef, useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useFleetFilters } from "@/hooks/useFleetFilters";
import FleetStatCards from "@/components/FleetStatCards";
import FleetFilterBar from "@/components/FleetFilterBar";
import FleetMeterCards from "@/components/FleetMeterCards";
import FleetSkeleton from "@/components/FleetSkeleton";
import EmptyState from "@/components/EmptyState";

const LOADING_MS = 240;

export default function FleetView() {
  const { fleet } = useData();
  const [loading, setLoading] = useState(true);
  const loadingDone = useRef(false);

  const { filtered, filters, setFilters, sortField, sortDir, toggleSort, resetFilters } =
    useFleetFilters(fleet);

  useEffect(() => {
    if (loadingDone.current) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    const t = setTimeout(() => {
      if (!cancelled) {
        loadingDone.current = true;
        setLoading(false);
      }
    }, LOADING_MS);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);


  if (loading) {
    return <FleetSkeleton />;
  }

  if (fleet.length === 0) {
    return (
      <EmptyState
        title="No meters found"
        message="The dataset has no meter readings. Add data to data/readings.json to see the fleet overview."
      />
    );
  }

  const listKey = `${sortField}-${sortDir}-${filters.search}-${filters.status}`;

  return (
    <div className="animate-fade-in">
      <FleetStatCards />

      <FleetFilterBar
        filters={filters}
        setFilters={setFilters}
        sortField={sortField}
        sortDir={sortDir}
        onToggleSort={toggleSort}
        onReset={resetFilters}
      />

      <FleetMeterCards fleet={filtered} listKey={listKey} />
    </div>
  );
}
