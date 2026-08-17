import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { eq } from "drizzle-orm";
import { db, skema } from "@/db";
import FormInfoAwal from "../FormInfoAwal";
import { hapusInfoAwal } from "../aksi";

export default async function SuntingInfoAwal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const i = await db.query.infoAwal.findFirst({ where: eq(skema.infoAwal.id, id) });
  if (!i) notFound();

  return (
    <>
      <Link
        className="mb-4 inline-flex items-center gap-2 text-kecil font-bold text-tinta-55 hover:text-institusi"
        href="/admin/awal"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Info penanganan awal
      </Link>
      <h2 className="mb-6 text-display text-tinta">{i.judul}</h2>

      <FormInfoAwal nilai={i} />

      <div className="mt-10 rounded-kartu border border-waspada/25 bg-waspada-lembut/50 p-5">
        <h3 className="text-subjudul text-tinta">Hapus permanen</h3>
        <p className="mb-4 mt-1 text-kecil text-tinta-70">
          Butir ini hilang dari checklist. Untuk sekadar menyembunyikannya, matikan
          &ldquo;Aktif&rdquo; di atas.
        </p>
        <form action={hapusInfoAwal}>
          <input name="id" type="hidden" value={i.id} />
          <button
            className="flex h-11 items-center gap-2 rounded-tombol bg-waspada px-5 text-sm font-bold text-white hover:opacity-90"
            type="submit"
          >
            <Trash2 className="size-4" aria-hidden />
            Hapus butir ini
          </button>
        </form>
      </div>
    </>
  );
}
