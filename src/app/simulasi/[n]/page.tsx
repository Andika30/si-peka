import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import Simulasi from "@/components/Simulasi";
import { ambilSkenario } from "@/lib/konten";

export default async function HalamanSimulasi({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const skenario = await ambilSkenario();
  const nomor = Number(n);
  if (!Number.isInteger(nomor) || nomor < 1 || nomor > skenario.length) notFound();

  return (
    <AppShell>
      <Simulasi nomor={nomor} skenario={skenario[nomor - 1]} total={skenario.length} />
    </AppShell>
  );
}
