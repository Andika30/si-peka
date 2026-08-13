import { notFound } from "next/navigation";
import HasilKuis from "@/components/HasilKuis";
import { cariModul, modul } from "@/lib/konten";

export function generateStaticParams() {
  return modul.map((m) => ({ id: m.id }));
}

export default async function HalamanHasilKuis({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = cariModul(id);
  if (!m) notFound();

  return <HasilKuis m={m} />;
}
