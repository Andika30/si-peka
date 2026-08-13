import { notFound } from "next/navigation";
import KuisModul from "@/components/KuisModul";
import { cariModul, modul } from "@/lib/konten";

export function generateStaticParams() {
  return modul.map((m) => ({ id: m.id }));
}

export default async function HalamanKuis({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = cariModul(id);
  if (!m) notFound();

  return <KuisModul m={m} />;
}
