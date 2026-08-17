import Link from "next/link";
import { Newspaper, Plus } from "lucide-react";
import { desc } from "drizzle-orm";
import { db, skema } from "@/db";
import { Lencana, Panel } from "@/components/admin/ui";

const tanggalID = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default async function DaftarBeritaAdmin() {
  const berita = await db.query.berita.findMany({
    orderBy: [desc(skema.berita.tanggal)],
    with: { isi: { columns: { id: true } } },
  });

  const draf = berita.filter((b) => !b.aktif).length;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-display text-tinta">Berita</h2>
          <p className="mt-1 text-isi text-tinta-70">
            {berita.length} berita{draf > 0 ? `, ${draf} masih draf` : ""}. Tiga terbaru tampil di
            halaman depan.
          </p>
        </div>
        <Link
          className="flex h-11 items-center gap-2 rounded-tombol bg-adukan px-5 text-sm font-bold text-white hover:bg-adukan-tua"
          href="/admin/berita/baru"
        >
          <Plus className="size-4" aria-hidden />
          Tambah Berita 
        </Link>
      </div>

      <Panel>
        {berita.map((b) => (
          <Link
            className="flex items-center gap-4 border-b border-garis p-4 transition-colors last:border-b-0 hover:bg-kertas"
            href={`/admin/berita/${b.id}`}
            key={b.id}
          >
            {b.gambar ? (
              <img
                alt=""
                className="size-16 shrink-0 rounded-dalam border border-garis object-cover"
                src={`/gambar/${b.gambar}`}
              />
            ) : (
              <span className="grid size-16 shrink-0 place-content-center rounded-dalam bg-adukan-lembut">
                <Newspaper className="size-6 text-adukan/50" aria-hidden />
              </span>
            )}

            <span className="min-w-0 flex-1">
              <span className="block font-mono text-data uppercase text-tinta-55">
                {tanggalID(b.tanggal)}
              </span>
              <span className="mt-0.5 block truncate text-isi font-bold text-tinta">{b.judul}</span>
              <span className="block truncate text-kecil text-tinta-55">{b.ringkas}</span>
            </span>

            <Lencana aktif={b.aktif} />
          </Link>
        ))}

        {berita.length === 0 ? (
          <p className="px-4 py-12 text-center text-isi text-tinta-55">
            Belum ada berita. Bagian berita di halaman depan disembunyikan selama masih kosong.
          </p>
        ) : null}
      </Panel>
    </>
  );
}
