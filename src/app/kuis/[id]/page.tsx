import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import KuisModul from "@/components/KuisModul";
import { cariKuis, cariTopik } from "@/lib/konten";

export default async function HalamanKuis({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const k = await cariKuis(id);
  const t = k && (await cariTopik(k.materiTerkait));
  if (!k || !t) notFound();

  return (
    <AppShell>
      <KuisModul k={k} t={t} />
    </AppShell>
  );
}
