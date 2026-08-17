import Link from "next/link";
import { ChevronDown, ChevronRight, ChevronUp, Plus } from "lucide-react";
import { asc } from "drizzle-orm";
import { db, skema } from "@/db";
import { Lencana, Panel } from "@/components/admin/ui";
import { geserInfoAwal } from "./aksi";

export default async function KelolaInfoAwal() {
  const daftar = await db.query.infoAwal.findMany({ orderBy: [asc(skema.infoAwal.urutan)] });

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-display text-tinta">Info penanganan awal</h2>
          <p className="mt-1 text-isi text-tinta-70">
            Checklist yang tampil sebelum peserta memilih jenis masalah. {daftar.length} butir.
          </p>
        </div>
        <Link
          className="flex h-11 items-center gap-2 rounded-tombol bg-adukan px-5 text-sm font-bold text-white hover:bg-adukan-tua"
          href="/admin/awal/baru"
        >
          <Plus className="size-4" aria-hidden />
          Butir baru
        </Link>
      </div>

      <Panel>
        {daftar.map((i, idx) => (
          <div
            className="flex items-center gap-3 border-b border-garis px-4 py-3 last:border-b-0"
            key={i.id}
          >
            <div className="flex shrink-0 flex-col">
              <form action={geserInfoAwal}>
                <input name="id" type="hidden" value={i.id} />
                <input name="arah" type="hidden" value="naik" />
                <button
                  aria-label={`Naikkan ${i.judul}`}
                  className="grid size-6 place-content-center rounded text-tinta-55 hover:bg-kertas hover:text-institusi disabled:opacity-25"
                  disabled={idx === 0}
                  type="submit"
                >
                  <ChevronUp className="size-4" aria-hidden />
                </button>
              </form>
              <form action={geserInfoAwal}>
                <input name="id" type="hidden" value={i.id} />
                <input name="arah" type="hidden" value="turun" />
                <button
                  aria-label={`Turunkan ${i.judul}`}
                  className="grid size-6 place-content-center rounded text-tinta-55 hover:bg-kertas hover:text-institusi disabled:opacity-25"
                  disabled={idx === daftar.length - 1}
                  type="submit"
                >
                  <ChevronDown className="size-4" aria-hidden />
                </button>
              </form>
            </div>

            <Link className="min-w-0 flex-1" href={`/admin/awal/${i.id}`}>
              <span className="block truncate text-isi font-bold text-tinta">{i.judul}</span>
              {i.keterangan ? (
                <span className="block truncate text-kecil text-tinta-55">{i.keterangan}</span>
              ) : null}
            </Link>

            <Lencana aktif={i.aktif} />
            <ChevronRight className="size-5 shrink-0 text-tinta-55" aria-hidden />
          </div>
        ))}

        {daftar.length === 0 ? (
          <p className="px-4 py-10 text-center text-isi text-tinta-55">
            Belum ada butir. Tanpa ini, halaman panduan langsung menampilkan pilihan masalah tanpa
            checklist pembuka.
          </p>
        ) : null}
      </Panel>
    </>
  );
}
