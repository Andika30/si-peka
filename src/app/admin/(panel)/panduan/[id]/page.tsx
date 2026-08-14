import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { asc, eq } from "drizzle-orm";
import { db, skema } from "@/db";
import FormMasalah from "../FormMasalah";
import { hapusMasalah } from "../aksi";

export default async function SuntingMasalah({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [m, topik] = await Promise.all([
    db.query.masalah.findFirst({
      where: eq(skema.masalah.id, id),
      with: { langkah: { orderBy: [asc(skema.langkahMasalah.urutan)] } },
    }),
    db.query.topik.findMany({
      orderBy: [asc(skema.topik.urutan)],
      columns: { id: true, judul: true },
    }),
  ]);

  if (!m) notFound();

  return (
    <>
      <Link
        className="mb-4 inline-flex items-center gap-2 text-kecil font-bold text-tinta-55 hover:text-institusi"
        href="/admin/panduan"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Panduan Pengaduan
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-display text-tinta">{m.label}</h1>
        <Link
          className="flex h-11 items-center gap-2 rounded-tombol border border-garis bg-white px-4 text-kecil font-bold text-tinta hover:bg-kertas"
          href={`/panduan/hasil/${m.id}`}
          target="_blank"
        >
          <ExternalLink className="size-4" aria-hidden />
          Lihat di aplikasi
        </Link>
      </div>

      <FormMasalah
        topik={topik}
        nilai={{
          id: m.id,
          label: m.label,
          ringkas: m.ringkas,
          judul: m.judul,
          pembuka: m.pembuka,
          segera: m.segera,
          peringatanUtama: m.peringatanUtama,
          pihak: m.pihak,
          eskalasiBI: m.eskalasiBi,
          topikId: m.topikId,
          sumber: m.sumber,
          urutan: m.urutan,
          aktif: m.aktif,
          langkah: m.langkah.map((l) => l.teks),
        }}
      />

      <div className="mt-10 rounded-kartu border border-waspada/25 bg-waspada-lembut/50 p-5">
        <h2 className="text-subjudul text-tinta">Hapus permanen</h2>
        <p className="mb-4 mt-1 text-kecil text-tinta-70">
          Panduan beserta seluruh langkahnya hilang. Untuk menyembunyikannya saja, matikan
          &ldquo;Aktif&rdquo; di atas.
        </p>
        <form action={hapusMasalah}>
          <input name="id" type="hidden" value={m.id} />
          <button
            className="flex h-11 items-center gap-2 rounded-tombol bg-waspada px-5 text-sm font-bold text-white hover:opacity-90"
            type="submit"
          >
            <Trash2 className="size-4" aria-hidden />
            Hapus panduan ini
          </button>
        </form>
      </div>
    </>
  );
}
