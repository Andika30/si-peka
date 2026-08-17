import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { asc } from "drizzle-orm";
import { db, skema } from "@/db";
import FormPenyelenggara from "../FormPenyelenggara";

export default async function PenyelenggaraBaru() {
  const layanan = await db.query.layanan.findMany({ orderBy: [asc(skema.layanan.urutan)] });

  return (
    <>
      <Link
        className="mb-4 inline-flex items-center gap-2 text-kecil font-bold text-tinta-55 hover:text-institusi"
        href="/admin/kanal"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Kanal pengaduan
      </Link>
      <h2 className="mb-6 text-display text-tinta">Penyelenggara baru</h2>
      <FormPenyelenggara layanan={layanan} />
    </>
  );
}
