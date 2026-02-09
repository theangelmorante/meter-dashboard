import FleetView from "@/components/FleetView";

export default function FleetOverviewPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-1 text-2xl font-bold text-slate-800">Fleet Overview</h1>
      <p className="mb-5 text-sm text-slate-500">
        Summary of all meters. Click a card to see the hourly detail view.
      </p>
      <FleetView />
    </main>
  );
}
