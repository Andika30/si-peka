import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { eq } from "drizzle-orm";
import { db, skema } from "@/db";
import FormPenyelenggara from "../FormPenyelenggara";
import { hapusPenyelenggara } from "../aksi";

export default async function SuntingPenyelenggara({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await db.query.penyelenggara.findFirst({
    where: eq(skema.penyelenggara.id, id),
  });
  if (!p) notFound();

  return (
    <>
      <Link
        className="mb-4 inline-flex items-center gap-2 text-kecil font-bold text-tinta-55 hover:text-institusi"
        href="/admin/kanal"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Kanal pengaduan
      </Link>
      <h2 className="mb-6 text-display text-tinta">{p.nama}</h2>

      <FormPenyelenggara nilai={p} />

      <div className="mt-10 rounded-kartu border border-waspada/25 bg-waspada-lembut/50 p-5">
        <h3 className="text-subjudul text-tinta">Hapus permanen</h3>
        <p className="mb-4 mt-1 text-kecil text-tinta-70">
          Penyelenggara ini hilang dari pilihan peserta dan datanya tidak bisa dikembalikan. Untuk
          sekadar menyembunyikannya, matikan &ldquo;Aktif&rdquo; di atas.
        </p>
        <form action={hapusPenyelenggara}>
          <input name="id" type="hidden" value={p.id} />
          <button
            className="flex h-11 items-center gap-2 rounded-tombol bg-waspada px-5 text-sm font-bold text-white hover:opacity-90"
            type="submit"
          >
            <Trash2 className="size-4" aria-hidden />
            Hapus penyelenggara ini
          </button>
        </form>
      </div>
    </>
  );
}
