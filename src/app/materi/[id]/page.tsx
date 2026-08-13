import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import IsiModul from "@/components/IsiModul";
import { modul } from "@/lib/konten";

export function generateStaticParams() {
  return modul.map((m) => ({ id: m.id }));
}

export default async function HalamanModul({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const i = modul.findIndex((m) => m.id === id);
  if (i === -1) notFound();

  return (
    <AppShell>
      <IsiModul
        m={modul[i]}
        nomorUrut={i + 1}
        sebelum={modul[i - 1] && { id: modul[i - 1].id, judul: modul[i - 1].judul }}
        sesudah={modul[i + 1] && { id: modul[i + 1].id, judul: modul[i + 1].judul }}
        total={modul.length}
      />
    </AppShell>
  );
}
