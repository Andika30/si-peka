"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { Bagian, Centang, GalatKotak, Medan, Pilih, TombolUtama } from "@/components/admin/ui";
import { simpanKategori } from "./aksi";
import type { HasilAksi } from "@/lib/admin/jaga";

const AWAL: HasilAksi = {};

const WARNA = [
  { nilai: "adukan", label: "Biru" },
  { nilai: "waspada", label: "Merah" },
  { nilai: "peduli", label: "Hijau" },
  { nilai: "kenali", label: "Oranye" },
  { nilai: "ungu", label: "Ungu" },
  { nilai: "institusi", label: "Navy" },
  { nilai: "emas", label: "Emas" },
];

const IKON = ["kartu", "perisai", "qr", "kunci", "waspada", "dompet", "ponsel", "transfer"].map(
  (n) => ({ nilai: n, label: n }),
);

export type NilaiKategori = {
  id: string;
  nama: string;
  ringkas: string;
  warna: string;
  ikon: string;
  urutan: number;
  aktif: boolean;
};

export default function FormKategori({ nilai }: { nilai?: NilaiKategori }) {
  const [hasil, kirim, sedang] = useActionState(simpanKategori, AWAL);

  return (
    <form action={kirim}>
      <GalatKotak pesan={hasil.galat} />
      {hasil.pesan ? (
        <p className="mb-5 rounded-dalam border border-peduli/30 bg-peduli-lembut p-3 text-kecil font-bold text-peduli">
          {hasil.pesan}
        </p>
      ) : null}

      <input name="idLama" type="hidden" value={nilai?.id ?? ""} />

      <Bagian judul="Identitas" keterangan="Tampil sebagai penyaring di daftar materi.">
        <Medan label="Nama kategori" maks={120} nama="nama" nilai={nilai?.nama} wajib />
        <Medan
          label="Keterangan"
          maks={255}
          nama="ringkas"
          nilai={nilai?.ringkas}
          petunjuk="Satu kalimat yang muncul di bawah penyaring saat kategori ini dipilih."
          wajib
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Pilih label="Warna" nama="warna" nilai={nilai?.warna} opsi={WARNA} />
          <Pilih label="Ikon" nama="ikon" nilai={nilai?.ikon} opsi={IKON} />
          <Medan jenis="number" label="Urutan tampil" nama="urutan" nilai={nilai?.urutan} />
          <Centang label="Aktif" nama="aktif" nilai={nilai?.aktif ?? true} />
        </div>
      </Bagian>

      <TombolUtama sedang={sedang}>
        <Save className="size-4" aria-hidden />
        {sedang ? "Menyimpan…" : "Simpan kategori"}
      </TombolUtama>
    </form>
  );
}
