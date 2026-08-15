import Link from "next/link";
import { ChevronDown, ChevronRight, ChevronUp, Plus } from "lucide-react";
import { asc, count } from "drizzle-orm";
import { db, skema } from "@/db";
import { Lencana, Panel } from "@/components/admin/ui";
import { geserKategori } from "./aksi";

export default async function KelolaKategori() {
  const kategori = await db.query.kategori.findMany({ orderBy: [asc(skema.kategori.urutan)] });

  const pemakaian = await db
    .select({ id: skema.topik.kategoriId, n: count() })
    .from(skema.topik)
    .groupBy(skema.topik.kategoriId);
  const jumlah = new Map(pemakaian.map((p) => [p.id, p.n]));

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-display text-tinta">Kategori materi</h2>
          <p className="mt-1 text-isi text-tinta-70">
            Pengelompokan materi menurut jenis layanan dan topik keamanan. Tampil sebagai penyaring
            di daftar materi.
          </p>
        </div>
        <Link
          className="flex h-11 items-center gap-2 rounded-tombol bg-adukan px-5 text-sm font-bold text-white hover:bg-adukan-tua"
          href="/admin/kategori/baru"
        >
          <Plus className="size-4" aria-hidden />
          Kategori baru
        </Link>
      </div>

      <Panel>
        {kategori.map((k, i) => (
          <div
            className="flex items-center gap-3 border-b border-garis px-4 py-3 last:border-b-0"
            key={k.id}
          >
            <div className="flex shrink-0 flex-col">
              <form action={geserKategori}>
                <input name="id" type="hidden" value={k.id} />
                <input name="arah" type="hidden" value="naik" />
                <button
                  aria-label={`Naikkan ${k.nama}`}
                  className="grid size-6 place-content-center rounded text-tinta-55 hover:bg-kertas hover:text-institusi disabled:opacity-25"
                  disabled={i === 0}
                  type="submit"
                >
                  <ChevronUp className="size-4" aria-hidden />
                </button>
              </form>
              <form action={geserKategori}>
                <input name="id" type="hidden" value={k.id} />
                <input name="arah" type="hidden" value="turun" />
                <button
                  aria-label={`Turunkan ${k.nama}`}
                  className="grid size-6 place-content-center rounded text-tinta-55 hover:bg-kertas hover:text-institusi disabled:opacity-25"
                  disabled={i === kategori.length - 1}
                  type="submit"
                >
                  <ChevronDown className="size-4" aria-hidden />
                </button>
              </form>
            </div>

            <Link className="min-w-0 flex-1" href={`/admin/kategori/${k.id}`}>
              <span className="block truncate text-isi font-bold text-tinta">{k.nama}</span>
              <span className="block truncate text-kecil text-tinta-55">{k.ringkas}</span>
              <span className="mt-0.5 block font-mono text-data uppercase text-tinta-55">
                {jumlah.get(k.id) ?? 0} materi
              </span>
            </Link>

            <Lencana aktif={k.aktif} />
            <ChevronRight className="size-5 shrink-0 text-tinta-55" aria-hidden />
          </div>
        ))}

        {kategori.length === 0 ? (
          <p className="px-4 py-10 text-center text-isi text-tinta-55">
            Belum ada kategori. Materi baru tidak bisa dibuat tanpa kategori.
          </p>
        ) : null}
      </Panel>
    </>
  );
}
