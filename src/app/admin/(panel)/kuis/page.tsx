import Link from "next/link";
import { Plus } from "lucide-react";
import { asc } from "drizzle-orm";
import { db, skema } from "@/db";
import { BarisDaftar, Panel } from "@/components/admin/ui";

export default async function DaftarKuisAdmin() {
  const kuis = await db.query.kuis.findMany({
    orderBy: [asc(skema.kuis.urutan)],
    with: { soal: { columns: { id: true } }, topik: { columns: { judul: true } } },
  });

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-display text-tinta">Kelola Kuis</h1>
          <p className="mt-1 text-isi text-tinta-70">
            Setiap kuis menempel pada satu materi
          </p>
        </div>
        <Link
          className="flex h-11 items-center gap-2 rounded-tombol bg-adukan px-5 text-sm font-bold text-white hover:bg-adukan-tua"
          href="/admin/kuis/baru"
        >
          <Plus className="size-4" aria-hidden />
          TambahKuis
        </Link>
      </div>

      <Panel>
        {kuis.map((k) => (
          <BarisDaftar
            aktif={k.aktif}
            href={`/admin/kuis/${k.id}`}
            key={k.id}
            meta={`${k.soal.length} soal`}
            judul={k.judul}
          />
        ))}
        {kuis.length === 0 ? (
          <p className="px-4 py-10 text-center text-isi text-tinta-55">Belum ada kuis.</p>
        ) : null}
      </Panel>
    </>
  );
}
