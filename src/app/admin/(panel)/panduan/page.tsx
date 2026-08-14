import Link from "next/link";
import { Plus } from "lucide-react";
import { asc } from "drizzle-orm";
import { db, skema } from "@/db";
import { BarisDaftar, Panel } from "@/components/admin/ui";

export default async function DaftarMasalahAdmin() {
  const masalah = await db.query.masalah.findMany({
    orderBy: [asc(skema.masalah.urutan)],
    with: { langkah: { columns: { urutan: true } } },
  });

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-display text-tinta">Panduan Pengaduan</h1>
          <p className="mt-1 text-isi text-tinta-70">
            Yang dikelola di sini adalah jawabannya — langkah dan kanal resmi. Aplikasi ini tidak
            menerima laporan.
          </p>
        </div>
        <Link
          className="flex h-11 items-center gap-2 rounded-tombol bg-adukan px-5 text-sm font-bold text-white hover:bg-adukan-tua"
          href="/admin/panduan/baru"
        >
          <Plus className="size-4" aria-hidden />
          Jenis masalah baru
        </Link>
      </div>

      <Panel>
        {masalah.map((m) => (
          <BarisDaftar
            aktif={m.aktif}
            href={`/admin/panduan/${m.id}`}
            judul={m.label}
            key={m.id}
            meta={`${m.langkah.length} langkah${m.eskalasiBi ? " · membuka jalur BI" : ""}`}
            ringkas={m.ringkas}
          />
        ))}
        {masalah.length === 0 ? (
          <p className="px-4 py-10 text-center text-isi text-tinta-55">Belum ada panduan.</p>
        ) : null}
      </Panel>
    </>
  );
}
