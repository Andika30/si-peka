import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import IsiTopik from "@/components/IsiTopik";
import { ambilMasalah, ambilTopik, cariKategori } from "@/lib/konten";

export default async function HalamanMateri({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [topik, masalah] = await Promise.all([ambilTopik(), ambilMasalah()]);

  const i = topik.findIndex((t) => t.id === id);
  if (i === -1) notFound();

  const t = topik[i];
  const panduan = masalah.find((m) => m.materiTerkait === t.id);
  const kategori = await cariKategori(t.kategori);

  return (
    <AppShell>
      <IsiTopik
        kategori={kategori?.nama}
        panduan={panduan && { id: panduan.id, label: panduan.label }}
        sebelum={topik[i - 1] && { id: topik[i - 1].id, judul: topik[i - 1].judul }}
        sesudah={topik[i + 1] && { id: topik[i + 1].id, judul: topik[i + 1].judul }}
        t={t}
      />
    </AppShell>
  );
}
