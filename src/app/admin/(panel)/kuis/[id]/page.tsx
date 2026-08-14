import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { asc, eq } from "drizzle-orm";
import { db, skema } from "@/db";
import FormKuis from "../FormKuis";
import { hapusKuis } from "../aksi";

export default async function SuntingKuis({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const k = await db.query.kuis.findFirst({
    where: eq(skema.kuis.id, id),
    with: {
      soal: {
        orderBy: [asc(skema.soal.urutan)],
        with: { opsi: { orderBy: [asc(skema.opsiSoal.urutan)] } },
      },
    },
  });
  if (!k) notFound();

  const [semuaTopik, sudahBerkuis] = await Promise.all([
    db.query.topik.findMany({
      orderBy: [asc(skema.topik.urutan)],
      columns: { id: true, judul: true },
    }),
    db.query.kuis.findMany({ columns: { topikId: true, id: true } }),
  ]);

  // Materi milik kuis ini tetap ditawarkan; milik kuis lain tidak.
  const terpakaiLain = new Set(
    sudahBerkuis.filter((x) => x.id !== k.id).map((x) => x.topikId),
  );
  const tersedia = semuaTopik.filter((t) => !terpakaiLain.has(t.id));

  return (
    <>
      <Link
        className="mb-4 inline-flex items-center gap-2 text-kecil font-bold text-tinta-55 hover:text-institusi"
        href="/admin/kuis"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Kuis
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-display text-tinta">{k.judul}</h1>
        <Link
          className="flex h-11 items-center gap-2 rounded-tombol border border-garis bg-white px-4 text-kecil font-bold text-tinta hover:bg-kertas"
          href={`/kuis/${k.id}`}
          target="_blank"
        >
          <ExternalLink className="size-4" aria-hidden />
          Coba di aplikasi
        </Link>
      </div>

      <FormKuis
        topik={tersedia}
        nilai={{
          id: k.id,
          judul: k.judul,
          topikId: k.topikId,
          urutan: k.urutan,
          aktif: k.aktif,
          soal: k.soal.map((s) => ({
            pertanyaan: s.pertanyaan,
            opsi: s.opsi.map((o) => o.teks),
            kunci: s.kunci,
            pembahasan: s.pembahasan,
          })),
        }}
      />

      <div className="mt-10 rounded-kartu border border-waspada/25 bg-waspada-lembut/50 p-5">
        <h2 className="text-subjudul text-tinta">Hapus permanen</h2>
        <p className="mb-4 mt-1 text-kecil text-tinta-70">
          Kuis beserta seluruh soal dan pilihannya hilang. Untuk sekadar menyembunyikannya,
          matikan &ldquo;Aktif&rdquo; di atas.
        </p>
        <form action={hapusKuis}>
          <input name="id" type="hidden" value={k.id} />
          <button
            className="flex h-11 items-center gap-2 rounded-tombol bg-waspada px-5 text-sm font-bold text-white hover:opacity-90"
            type="submit"
          >
            <Trash2 className="size-4" aria-hidden />
            Hapus kuis ini
          </button>
        </form>
      </div>
    </>
  );
}
