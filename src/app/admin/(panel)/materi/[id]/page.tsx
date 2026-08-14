import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { asc, eq } from "drizzle-orm";
import { db, skema } from "@/db";
import { GalatKotak } from "@/components/admin/ui";
import FormTopik from "../FormTopik";
import { hapusTopik } from "../aksi";

export default async function SuntingMateri({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ galat?: string }>;
}) {
  const { id } = await params;
  const { galat } = await searchParams;

  const [t, kategori] = await Promise.all([
    db.query.topik.findFirst({
      where: eq(skema.topik.id, id),
      with: { isi: { orderBy: [asc(skema.isiTopik.urutan)] }, kuis: true },
    }),
    db.query.kategori.findMany({ orderBy: [asc(skema.kategori.urutan)] }),
  ]);

  if (!t) notFound();

  return (
    <>
      <Link
        className="mb-4 inline-flex items-center gap-2 text-kecil font-bold text-tinta-55 hover:text-institusi"
        href="/admin/materi"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Materi
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-display text-tinta">{t.judul}</h1>
        <div className="flex gap-2">
          <Link
            className="flex h-11 items-center gap-2 rounded-tombol border border-garis bg-white px-4 text-kecil font-bold text-tinta hover:bg-kertas"
            href={`/materi/${t.id}`}
            target="_blank"
          >
            <ExternalLink className="size-4" aria-hidden />
            Lihat di aplikasi
          </Link>
          {t.kuis.length > 0 ? (
            <Link
              className="flex h-11 items-center rounded-tombol border border-garis bg-white px-4 text-kecil font-bold text-tinta hover:bg-kertas"
              href={`/admin/kuis/${t.kuis[0].id}`}
            >
              Kuisnya
            </Link>
          ) : (
            <Link
              className="flex h-11 items-center rounded-tombol border border-garis bg-white px-4 text-kecil font-bold text-adukan hover:bg-kertas"
              href={`/admin/kuis/baru?topik=${t.id}`}
            >
              Buat kuis
            </Link>
          )}
        </div>
      </div>

      <GalatKotak pesan={galat} />

      <FormTopik
        kategori={kategori}
        nilai={{
          id: t.id,
          kategoriId: t.kategoriId,
          judul: t.judul,
          ringkas: t.ringkas,
          ikon: t.ikon,
          warna: t.warna,
          peringatan: t.peringatan,
          sumber: t.sumber,
          urutan: t.urutan,
          aktif: t.aktif,
          paragraf: t.isi.filter((i) => i.jenis === "paragraf").map((i) => i.teks),
          poin: t.isi.filter((i) => i.jenis === "poin").map((i) => i.teks),
        }}
      />

      {/* Menghapus jarang benar-benar dibutuhkan — menonaktifkan hampir selalu
          pilihan yang lebih baik, dan bisa dibatalkan. */}
      <div className="mt-10 rounded-kartu border border-waspada/25 bg-waspada-lembut/50 p-5">
        <h2 className="text-subjudul text-tinta">Hapus permanen</h2>
        <p className="mb-4 mt-1 text-kecil text-tinta-70">
          Materi beserta seluruh paragraf dan poinnya hilang dan tidak bisa dikembalikan. Untuk
          sekadar menyembunyikannya dari peserta, matikan &ldquo;Aktif&rdquo; di atas.
        </p>
        <form action={hapusTopik}>
          <input name="id" type="hidden" value={t.id} />
          <button
            className="flex h-11 items-center gap-2 rounded-tombol bg-waspada px-5 text-sm font-bold text-white hover:opacity-90"
            type="submit"
          >
            <Trash2 className="size-4" aria-hidden />
            Hapus materi ini
          </button>
        </form>
      </div>
    </>
  );
}
