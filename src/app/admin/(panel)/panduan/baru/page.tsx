import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { asc } from "drizzle-orm";
import { db, skema } from "@/db";
import FormMasalah from "../FormMasalah";

export default async function MasalahBaru() {
  const topik = await db.query.topik.findMany({
    orderBy: [asc(skema.topik.urutan)],
    columns: { id: true, judul: true },
  });

  return (
    <>
      <Link
        className="mb-4 inline-flex items-center gap-2 text-kecil font-bold text-tinta-55 hover:text-institusi"
        href="/admin/panduan"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Panduan Pengaduan
      </Link>
      <h1 className="mb-6 text-display text-tinta">Jenis masalah baru</h1>
      <FormMasalah topik={topik} />
    </>
  );
}
