import { notFound } from "next/navigation";
import Simulasi from "@/components/Simulasi";
import { skenario } from "@/lib/konten";

export function generateStaticParams() {
  return skenario.map((_, i) => ({ n: String(i + 1) }));
}

export default async function HalamanSimulasi({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const nomor = Number(n);
  if (!Number.isInteger(nomor) || nomor < 1 || nomor > skenario.length) notFound();

  return <Simulasi nomor={nomor} skenario={skenario[nomor - 1]} total={skenario.length} />;
}
