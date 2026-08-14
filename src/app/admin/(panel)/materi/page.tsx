import Link from "next/link";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { asc } from "drizzle-orm";
import { db, skema } from "@/db";
import { Lencana, Panel } from "@/components/admin/ui";
import { geserTopik } from "./aksi";

export default async function DaftarTopikAdmin() {
  const [topik, kategori] = await Promise.all([
    db.query.topik.findMany({
      orderBy: [asc(skema.topik.urutan)],
      with: { isi: { columns: { id: true } }, kuis: { columns: { id: true } } },
    }),
    db.query.kategori.findMany(),
  ]);

  const namaKategori = new Map(kategori.map((k) => [k.id, k.nama]));

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-display text-tinta">Materi</h1>
          <p className="mt-1 text-isi text-tinta-70">
            {topik.length} materi. Urutan di sini menentukan urutan tampil di aplikasi.
          </p>
        </div>
        <Link
          className="flex h-11 items-center gap-2 rounded-tombol bg-adukan px-5 text-sm font-bold text-white hover:bg-adukan-tua"
          href="/admin/materi/baru"
        >
          <Plus className="size-4" aria-hidden />
          Materi baru
        </Link>
      </div>

      <Panel>
        {topik.map((t, i) => (
          <div className="flex items-center gap-3 border-b border-garis px-4 py-3 last:border-b-0" key={t.id}>
            {/* Tombol geser dipisah dari tautan supaya mengurutkan tidak
                berarti membuka halamannya lebih dulu. */}
            <div className="flex shrink-0 flex-col">
              <form action={geserTopik}>
                <input name="id" type="hidden" value={t.id} />
                <input name="arah" type="hidden" value="naik" />
                <button
                  aria-label={`Naikkan ${t.judul}`}
                  className="grid size-6 place-content-center rounded text-tinta-55 hover:bg-kertas hover:text-institusi disabled:opacity-25"
                  disabled={i === 0}
                  type="submit"
                >
                  <ChevronUp className="size-4" aria-hidden />
                </button>
              </form>
              <form action={geserTopik}>
                <input name="id" type="hidden" value={t.id} />
                <input name="arah" type="hidden" value="turun" />
                <button
                  aria-label={`Turunkan ${t.judul}`}
                  className="grid size-6 place-content-center rounded text-tinta-55 hover:bg-kertas hover:text-institusi disabled:opacity-25"
                  disabled={i === topik.length - 1}
                  type="submit"
                >
                  <ChevronDown className="size-4" aria-hidden />
                </button>
              </form>
            </div>

            <Link className="min-w-0 flex-1" href={`/admin/materi/${t.id}`}>
              <span className="block truncate text-isi font-bold text-tinta">{t.judul}</span>
              <span className="block truncate text-kecil text-tinta-55">{t.ringkas}</span>
              <span className="mt-0.5 block font-mono text-data uppercase text-tinta-55">
                {namaKategori.get(t.kategoriId) ?? t.kategoriId} &middot; {t.isi.length} butir isi
                &middot; {t.kuis.length > 0 ? "ada kuis" : "belum ada kuis"}
              </span>
            </Link>

            <Lencana aktif={t.aktif} />
          </div>
        ))}

        {topik.length === 0 ? (
          <p className="px-4 py-10 text-center text-isi text-tinta-55">
            Belum ada materi. Mulai dari tombol &ldquo;Materi baru&rdquo;.
          </p>
        ) : null}
      </Panel>
    </>
  );
}
