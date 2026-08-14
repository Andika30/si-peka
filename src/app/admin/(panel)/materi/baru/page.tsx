import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { asc } from "drizzle-orm";
import { db, skema } from "@/db";
import FormTopik from "../FormTopik";

export default async function MateriBaru() {
  const kategori = await db.query.kategori.findMany({ orderBy: [asc(skema.kategori.urutan)] });

  return (
    <>
      <Link
        className="mb-4 inline-flex items-center gap-2 text-kecil font-bold text-tinta-55 hover:text-institusi"
        href="/admin/materi"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Materi
      </Link>
      <h1 className="mb-6 text-display text-tinta">Materi baru</h1>

      <FormTopik kategori={kategori} />
    </>
  );
}
