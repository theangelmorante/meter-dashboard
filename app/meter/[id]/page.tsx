import MeterDetail from "@/components/MeterDetail";
import { meterIds } from "@/lib/data";

export function generateStaticParams() {
  return meterIds.map((id) => ({ id }));
}

interface MeterDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MeterDetailPage({ params }: MeterDetailPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <MeterDetail meterId={id} />
    </main>
  );
}
