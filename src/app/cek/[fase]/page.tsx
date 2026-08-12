import { notFound } from "next/navigation";
import Kuis from "@/components/Kuis";
import type { Fase } from "@/lib/skor";

export function generateStaticParams() {
  return [{ fase: "awal" }, { fase: "akhir" }];
}

export default async function HalamanCek({ params }: { params: Promise<{ fase: string }> }) {
  const { fase } = await params;
  if (fase !== "awal" && fase !== "akhir") notFound();

  return <Kuis fase={fase as Fase} />;
}
