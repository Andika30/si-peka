import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { asc, eq } from "drizzle-orm";
import { db, skema } from "@/db";
import FormBerita from "../FormBerita";
import { hapusBerita } from "../aksi";

export default async function SuntingBerita({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const b = await db.query.berita.findFirst({
    where: eq(skema.berita.id, id),
    with: { isi: { orderBy: [asc(skema.isiBerita.urutan)] } },
  });
  if (!b) notFound();

  return (
    <>
      <Link
        className="mb-4 inline-flex items-center gap-2 text-kecil font-bold text-tinta-55 hover:text-institusi"
        href="/admin/berita"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Berita
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <h2 className="max-w-2xl text-display text-tinta">{b.judul}</h2>
        <Link
          className="flex h-11 items-center gap-2 rounded-tombol border border-garis bg-white px-4 text-kecil font-bold text-tinta hover:bg-kertas"
          href={`/berita/${b.id}`}
          target="_blank"
        >
          <ExternalLink className="size-4" aria-hidden />
          Lihat di aplikasi
        </Link>
      </div>

      <FormBerita
        nilai={{
          id: b.id,
          judul: b.judul,
          ringkas: b.ringkas,
          gambar: b.gambar,
          gambarAlt: b.gambarAlt,
          sumber: b.sumber,
          tanggal: b.tanggal,
          aktif: b.aktif,
          isi: b.isi.map((i) => ({
            jenis: i.jenis,
            teks: i.teks,
            ...(i.keterangan ? { keterangan: i.keterangan } : {}),
          })),
        }}
      />

      <div className="mt-10 rounded-kartu border border-waspada/25 bg-waspada-lembut/50 p-5">
        <h3 className="text-subjudul text-tinta">Hapus permanen</h3>
        <p className="mb-4 mt-1 text-kecil text-tinta-70">
          Berita beserta isinya dan gambarnya hilang. Untuk menariknya dari halaman depan saja,
          matikan &ldquo;Terbitkan&rdquo; di atas.
        </p>
        <form action={hapusBerita}>
          <input name="id" type="hidden" value={b.id} />
          <button
            className="flex h-11 items-center gap-2 rounded-tombol bg-waspada px-5 text-sm font-bold text-white hover:opacity-90"
            type="submit"
          >
            <Trash2 className="size-4" aria-hidden />
            Hapus berita ini
          </button>
        </form>
      </div>
    </>
  );
}
