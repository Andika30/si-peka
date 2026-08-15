import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { eq } from "drizzle-orm";
import { db, skema } from "@/db";
import { GalatKotak } from "@/components/admin/ui";
import FormKategori from "../FormKategori";
import { hapusKategori } from "../aksi";

export default async function SuntingKategori({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ galat?: string }>;
}) {
  const { id } = await params;
  const { galat } = await searchParams;

  const k = await db.query.kategori.findFirst({ where: eq(skema.kategori.id, id) });
  if (!k) notFound();

  return (
    <>
      <Link
        className="mb-4 inline-flex items-center gap-2 text-kecil font-bold text-tinta-55 hover:text-institusi"
        href="/admin/kategori"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Kategori materi
      </Link>
      <h2 className="mb-6 text-display text-tinta">{k.nama}</h2>

      <GalatKotak pesan={galat} />
      <FormKategori nilai={k} />

      <div className="mt-10 rounded-kartu border border-waspada/25 bg-waspada-lembut/50 p-5">
        <h3 className="text-subjudul text-tinta">Hapus permanen</h3>
        <p className="mb-4 mt-1 text-kecil text-tinta-70">
          Hanya bisa dihapus kalau tidak ada materi yang memakainya. Untuk menyembunyikannya dari
          penyaring, matikan &ldquo;Aktif&rdquo; di atas.
        </p>
        <form action={hapusKategori}>
          <input name="id" type="hidden" value={k.id} />
          <button
            className="flex h-11 items-center gap-2 rounded-tombol bg-waspada px-5 text-sm font-bold text-white hover:opacity-90"
            type="submit"
          >
            <Trash2 className="size-4" aria-hidden />
            Hapus kategori ini
          </button>
        </form>
      </div>
    </>
  );
}