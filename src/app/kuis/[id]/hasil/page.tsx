import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import HasilKuis from "@/components/HasilKuis";
import { cariKuis, cariTopik } from "@/lib/konten";

export default async function HalamanHasilKuis({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const k = await cariKuis(id);
  const t = k && (await cariTopik(k.materiTerkait));
  if (!k || !t) notFound();

  return (
    <AppShell>
      <HasilKuis k={k} t={t} />
    </AppShell>
  );
}
