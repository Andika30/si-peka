import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { asc } from "drizzle-orm";
import { db, skema } from "@/db";
import FormSkenario from "../FormSkenario";
import { hapusSkenario } from "../aksi";

export default async function SuntingSkenario({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const semua = await db.query.skenario.findMany({
    orderBy: [asc(skema.skenario.urutan)],
    with: {
      konteks: { orderBy: [asc(skema.konteksSkenario.urutan)] },
      opsi: { orderBy: [asc(skema.opsiSkenario.urutan)] },
    },
  });

  const s = semua.find((x) => x.id === id);
  if (!s) notFound();

  // Alamat halaman peserta memakai nomor urut, bukan id.
  const nomor = semua.filter((x) => x.aktif).findIndex((x) => x.id === id) + 1;

  return (
    <>
      <Link
        className="mb-4 inline-flex items-center gap-2 text-kecil font-bold text-tinta-55 hover:text-institusi"
        href="/admin/simulasi"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Simulasi
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <h1 className="max-w-2xl text-display text-tinta">{s.situasi.slice(0, 80)}</h1>
        {nomor > 0 ? (
          <Link
            className="flex h-11 items-center gap-2 rounded-tombol border border-garis bg-white px-4 text-kecil font-bold text-tinta hover:bg-kertas"
            href={`/simulasi/${nomor}`}
            target="_blank"
          >
            <ExternalLink className="size-4" aria-hidden />
            Coba di aplikasi
          </Link>
        ) : null}
      </div>

      <FormSkenario
        nilai={{
          id: s.id,
          situasi: s.situasi,
          alasan: s.alasan,
          urutan: s.urutan,
          aktif: s.aktif,
          konteks: s.konteks.map((k) => ({ label: k.label, nilai: k.nilai })),
          opsi: s.opsi.map((o) => ({
            teks: o.teks,
            aman: o.aman,
            konsekuensi: o.konsekuensi,
          })),
        }}
      />

      <div className="mt-10 rounded-kartu border border-waspada/25 bg-waspada-lembut/50 p-5">
        <h2 className="text-subjudul text-tinta">Hapus permanen</h2>
        <p className="mb-4 mt-1 text-kecil text-tinta-70">
          Menghapus skenario menggeser penomoran skenario sesudahnya. Untuk menyembunyikannya
          saja, matikan &ldquo;Aktif&rdquo; di atas.
        </p>
        <form action={hapusSkenario}>
          <input name="id" type="hidden" value={s.id} />
          <button
            className="flex h-11 items-center gap-2 rounded-tombol bg-waspada px-5 text-sm font-bold text-white hover:opacity-90"
            type="submit"
          >
            <Trash2 className="size-4" aria-hidden />
            Hapus skenario ini
          </button>
        </form>
      </div>
    </>
  );
}
