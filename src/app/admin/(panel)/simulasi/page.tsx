import Link from "next/link";
import { Plus } from "lucide-react";
import { asc } from "drizzle-orm";
import { db, skema } from "@/db";
import { BarisDaftar, Panel } from "@/components/admin/ui";

export default async function DaftarSkenarioAdmin() {
  const skenario = await db.query.skenario.findMany({
    orderBy: [asc(skema.skenario.urutan)],
    with: { opsi: true, konteks: true },
  });

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-display text-tinta">Kelola Simulasi</h1>
          <p className="mt-1 text-isi text-tinta-70">
            Urutan di sini menentukan nomor skenario yang dilihat peserta.
          </p>
        </div>
        <Link
          className="flex h-11 items-center gap-2 rounded-tombol bg-adukan px-5 text-sm font-bold text-white hover:bg-adukan-tua"
          href="/admin/simulasi/baru"
        >
          <Plus className="size-4" aria-hidden />
          TambahSkenario
        </Link>
      </div>

      <Panel>
        {skenario.map((s, i) => (
          <BarisDaftar
            aktif={s.aktif}
            href={`/admin/simulasi/${s.id}`}
            judul={`${i + 1}. ${s.situasi.slice(0, 90)}${s.situasi.length > 90 ? "…" : ""}`}
            key={s.id}
            meta={`${s.opsi.length} pilihan · ${s.konteks.length} baris konteks`}
          />
        ))}
        {skenario.length === 0 ? (
          <p className="px-4 py-10 text-center text-isi text-tinta-55">Belum ada skenario.</p>
        ) : null}
      </Panel>
    </>
  );
}
