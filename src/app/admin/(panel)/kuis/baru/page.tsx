import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { asc, eq } from "drizzle-orm";
import { db, skema } from "@/db";
import FormKuis from "../FormKuis";

export default async function KuisBaru({
  searchParams,
}: {
  searchParams: Promise<{ topik?: string }>;
}) {
  const { topik: topikTerpilih } = await searchParams;

  const [semuaTopik, sudahBerkuis] = await Promise.all([
    db.query.topik.findMany({
      orderBy: [asc(skema.topik.urutan)],
      columns: { id: true, judul: true },
    }),
    db.query.kuis.findMany({ columns: { topikId: true } }),
  ]);

  // Materi yang sudah punya kuis tidak ditawarkan lagi — satu materi satu kuis.
  const terpakai = new Set(sudahBerkuis.map((k) => k.topikId));
  const tersedia = semuaTopik.filter((t) => !terpakai.has(t.id));

  const t = topikTerpilih
    ? await db.query.topik.findFirst({
        where: eq(skema.topik.id, topikTerpilih),
        columns: { judul: true },
      })
    : null;

  return (
    <>
      <Link
        className="mb-4 inline-flex items-center gap-2 text-kecil font-bold text-tinta-55 hover:text-institusi"
        href="/admin/kuis"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Kuis
      </Link>
      <h1 className="mb-6 text-display text-tinta">Kuis baru</h1>

      {tersedia.length === 0 ? (
        <p className="rounded-kartu border border-garis bg-white p-6 text-isi text-tinta-70">
          Semua materi sudah punya kuis. Buat materi baru dulu, atau sunting kuis yang sudah ada.
        </p>
      ) : (
        <FormKuis
          topik={tersedia}
          nilai={{
            id: "",
            judul: t ? `Kuis: ${t.judul}` : "",
            topikId: topikTerpilih ?? tersedia[0].id,
            urutan: 0,
            aktif: true,
            soal: [{ pertanyaan: "", opsi: ["", "", "", ""], kunci: 0, pembahasan: "" }],
          }}
        />
      )}
    </>
  );
}
