import Link from "next/link";
import { ChevronDown, ChevronRight, ChevronUp, Info, Landmark, Plus } from "lucide-react";
import { asc, eq } from "drizzle-orm";
import { db, skema } from "@/db";
import { Lencana, Panel } from "@/components/admin/ui";
import type { BankIndonesia } from "@/lib/tipe";
import FormBankIndonesia from "./FormBankIndonesia";
import { geserPenyelenggara } from "./aksi";

export default async function KelolaKanal() {
  const [penyelenggara, pengaturanBI] = await Promise.all([
    db.query.penyelenggara.findMany({ orderBy: [asc(skema.penyelenggara.urutan)] }),
    db.query.pengaturan.findFirst({ where: eq(skema.pengaturan.kunci, "bank_indonesia") }),
  ]);

  const bi = pengaturanBI
    ? (JSON.parse(pengaturanBI.nilai) as BankIndonesia)
    : { nama: "", telepon: "", situs: "", situsLabel: "", diverifikasi: "" };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-display text-tinta">Kanal pengaduan</h2>
          <p className="mt-1 text-isi text-tinta-70">
            Ke mana peserta diarahkan saat mengalami masalah. {penyelenggara.length} penyelenggara.
          </p>
        </div>
        <Link
          className="flex h-11 items-center gap-2 rounded-tombol bg-adukan px-5 text-sm font-bold text-white hover:bg-adukan-tua"
          href="/admin/kanal/baru"
        >
          <Plus className="size-4" aria-hidden />
          Penyelenggara baru
        </Link>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-kartu border border-garis bg-white p-4">
        <Info className="mt-0.5 size-5 shrink-0 text-adukan" aria-hidden />
        <p className="text-kecil text-tinta-70">
          Nomor dan tautan kanal resmi berubah dari waktu ke waktu. Tanggal &ldquo;diverifikasi
          terakhir&rdquo; tampil apa adanya ke peserta — itu yang membuat data basi kelihatan, bukan
          tersembunyi. Perbarui tanggalnya setiap kali kamu benar-benar mengeceknya.
        </p>
      </div>

      <h3 className="mb-1 text-subjudul text-tinta">Penyelenggara jasa pembayaran</h3>
      <p className="mb-3 text-kecil text-tinta-55">
        Urutan di sini menentukan urutan pilihan yang dilihat peserta.
      </p>

      <div className="mb-8">
        <Panel>
          {penyelenggara.map((p, i) => (
            <div
              className="flex items-center gap-3 border-b border-garis px-4 py-3 last:border-b-0"
              key={p.id}
            >
              <div className="flex shrink-0 flex-col">
                <form action={geserPenyelenggara}>
                  <input name="id" type="hidden" value={p.id} />
                  <input name="arah" type="hidden" value="naik" />
                  <button
                    aria-label={`Naikkan ${p.nama}`}
                    className="grid size-6 place-content-center rounded text-tinta-55 hover:bg-kertas hover:text-institusi disabled:opacity-25"
                    disabled={i === 0}
                    type="submit"
                  >
                    <ChevronUp className="size-4" aria-hidden />
                  </button>
                </form>
                <form action={geserPenyelenggara}>
                  <input name="id" type="hidden" value={p.id} />
                  <input name="arah" type="hidden" value="turun" />
                  <button
                    aria-label={`Turunkan ${p.nama}`}
                    className="grid size-6 place-content-center rounded text-tinta-55 hover:bg-kertas hover:text-institusi disabled:opacity-25"
                    disabled={i === penyelenggara.length - 1}
                    type="submit"
                  >
                    <ChevronDown className="size-4" aria-hidden />
                  </button>
                </form>
              </div>

              <Link className="min-w-0 flex-1" href={`/admin/kanal/${p.id}`}>
                <span className="block truncate text-isi font-bold text-tinta">{p.nama}</span>
                <span className="block truncate text-kecil text-tinta-55">
                  {p.jenis} &middot; {p.telepon}
                </span>
                <span className="mt-0.5 block font-mono text-data uppercase text-tinta-55">
                  Diverifikasi {p.diverifikasi}
                </span>
              </Link>

              <Lencana aktif={p.aktif} />
              <ChevronRight className="size-5 shrink-0 text-tinta-55" aria-hidden />
            </div>
          ))}

          {penyelenggara.length === 0 ? (
            <p className="px-4 py-10 text-center text-isi text-tinta-55">
              Belum ada penyelenggara. Tanpa ini, halaman panduan tidak punya kanal untuk
              ditunjukkan.
            </p>
          ) : null}
        </Panel>
      </div>

      <div className="mb-2 flex items-center gap-2">
        <Landmark className="size-5 text-institusi" aria-hidden />
        <h3 className="text-subjudul text-tinta">Kanal Bank Indonesia</h3>
      </div>
      <p className="mb-3 text-kecil text-tinta-55">
        Sengaja terpisah dari daftar di atas. Bank Indonesia bukan tempat mengadukan transaksi
        sehari-hari — jalur ke sini hanya terbuka lewat layar eskalasi, setelah penyelenggara tidak
        menyelesaikan.
      </p>
      <Panel>
        <FormBankIndonesia bi={bi} />
      </Panel>
    </>
  );
}
