import { Info } from "lucide-react";
import { asc } from "drizzle-orm";
import { db, skema } from "@/db";
import { Panel } from "@/components/admin/ui";
import type { BankIndonesia } from "@/lib/tipe";
import { FormBankIndonesia, FormKategori, FormPenyelenggara } from "./Formulir";

export default async function KelolaKanal() {
  const [penyelenggara, kategori, pengaturanBI] = await Promise.all([
    db.query.penyelenggara.findMany({ orderBy: [asc(skema.penyelenggara.urutan)] }),
    db.query.kategori.findMany({ orderBy: [asc(skema.kategori.urutan)] }),
    db.query.pengaturan.findFirst({ where: (p, { eq }) => eq(p.kunci, "bank_indonesia") }),
  ]);

  const bi = pengaturanBI
    ? (JSON.parse(pengaturanBI.nilai) as BankIndonesia)
    : { nama: "", telepon: "", situs: "", situsLabel: "", diverifikasi: "" };

  return (
    <>
      <h1 className="mb-1 text-display text-tinta">Kanal &amp; kategori</h1>
      <p className="mb-6 text-isi text-tinta-70">
        Isi yang jarang bertambah tapi sering diperbarui, jadi disunting langsung di sini.
      </p>

      <div className="mb-6 flex items-start gap-3 rounded-dalam border border-garis bg-white p-4">
        <Info className="mt-0.5 size-5 shrink-0 text-adukan" aria-hidden />
        <p className="text-kecil text-tinta-70">
          Nomor dan tautan kanal resmi berubah. Tanggal &ldquo;diverifikasi terakhir&rdquo; tampil
          apa adanya ke peserta — itu yang membuat data basi kelihatan, bukan tersembunyi. Perbarui
          tanggalnya setiap kali kamu benar-benar mengeceknya.
        </p>
      </div>

      <h2 className="mb-3 text-subjudul text-tinta">Kanal Bank Indonesia</h2>
      <div className="mb-8">
        <Panel>
          <FormBankIndonesia bi={bi} />
        </Panel>
      </div>

      <h2 className="mb-1 text-subjudul text-tinta">Penyelenggara jasa pembayaran</h2>
      <p className="mb-3 text-kecil text-tinta-55">
        Bank Indonesia sengaja tidak ada di daftar ini — BI bukan tempat mengadukan transaksi
        sehari-hari. Jalur ke BI hanya terbuka lewat layar eskalasi.
      </p>
      <div className="mb-8">
        <Panel>
          {penyelenggara.map((p) => (
            <FormPenyelenggara key={p.id} p={p} />
          ))}
        </Panel>
      </div>

      <h2 className="mb-3 text-subjudul text-tinta">Kategori materi</h2>
      <Panel>
        {kategori.map((k) => (
          <FormKategori k={k} key={k.id} />
        ))}
      </Panel>
    </>
  );
}
