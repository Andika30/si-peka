"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import {
  AreaTeks,
  Bagian,
  Centang,
  GalatKotak,
  Medan,
  Pilih,
  TombolUtama,
} from "@/components/admin/ui";
import EditorBlok from "@/components/admin/EditorBlok";
import type { BlokIsi } from "@/lib/tipe";
import { simpanTopik } from "./aksi";
import type { HasilAksi } from "@/lib/admin/jaga";

const AWAL: HasilAksi = {};

const WARNA = [
  { nilai: "adukan", label: "Biru — pembayaran digital" },
  { nilai: "waspada", label: "Merah — keamanan transaksi" },
  { nilai: "peduli", label: "Hijau" },
  { nilai: "kenali", label: "Oranye" },
  { nilai: "ungu", label: "Ungu" },
  { nilai: "institusi", label: "Navy" },
  { nilai: "emas", label: "Emas" },
];

const IKON = [
  "kartu",
  "qr",
  "pindai",
  "transfer",
  "dompet",
  "ponsel",
  "kunci",
  "waspada",
  "tautan",
  "lonceng",
  "perisai",
  "peka",
].map((n) => ({ nilai: n, label: n }));

export type NilaiTopik = {
  id: string;
  kategoriId: string;
  judul: string;
  ringkas: string;
  ikon: string;
  warna: string;
  peringatan: string | null;
  sumber: string;
  urutan: number;
  aktif: boolean;
  isi: BlokIsi[];
};

export default function FormTopik({
  nilai,
  kategori,
}: {
  nilai?: NilaiTopik;
  kategori: { id: string; nama: string }[];
}) {
  const [hasil, kirim, sedang] = useActionState(simpanTopik, AWAL);

  return (
    <form action={kirim}>
      <GalatKotak pesan={hasil.galat} />
      {hasil.pesan ? (
        <p className="mb-5 rounded-dalam border border-peduli/30 bg-peduli-lembut p-3 text-kecil font-bold text-peduli">
          {hasil.pesan}
        </p>
      ) : null}

      <input name="idLama" type="hidden" value={nilai?.id ?? ""} />

      <Bagian judul="Identitas" keterangan="Yang tampil di daftar materi dan kartu beranda.">
        <Medan
          label="Judul"
          maks={200}
          nama="judul"
          nilai={nilai?.judul}
          petunjuk={
            nilai
              ? `Alamat halaman: /materi/${nilai.id} — tidak ikut berubah agar tautan lama tetap hidup.`
              : "Alamat halaman dibuat otomatis dari judul, dan setelah itu tidak berubah."
          }
          wajib
        />
        <Medan
          label="Ringkasan satu baris"
          maks={255}
          nama="ringkas"
          nilai={nilai?.ringkas}
          petunjuk="Muncul di bawah judul pada daftar materi."
          wajib
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Pilih
            label="Kategori"
            nama="kategoriId"
            nilai={nilai?.kategoriId}
            opsi={kategori.map((k) => ({ nilai: k.id, label: k.nama }))}
          />
          <Pilih label="Warna" nama="warna" nilai={nilai?.warna} opsi={WARNA} />
          <Pilih label="Ikon" nama="ikon" nilai={nilai?.ikon} opsi={IKON} />
          <Medan
            jenis="number"
            label="Urutan tampil"
            nama="urutan"
            nilai={nilai?.urutan}
            petunjuk="Makin kecil makin atas."
          />
        </div>
      </Bagian>

      <EditorBlok awal={nilai?.isi ?? []} />

      <Bagian judul="Peringatan">
        <AreaTeks
          baris={2}
          label="Peringatan (opsional)"
          nama="peringatan"
          nilai={nilai?.peringatan}
          petunjuk="Tampil sebagai kotak merah di bawah isi. Kosongkan kalau materi ini tidak memerlukannya — merah kehilangan arti kalau dipakai di mana-mana."
        />
      </Bagian>

      <Bagian judul="Sumber & status">
        <Medan
          label="Sumber"
          maks={255}
          nama="sumber"
          nilai={nilai?.sumber ?? "Bank Indonesia"}
          petunjuk="Dicantumkan di bawah materi. Isi dengan publikasi resmi yang jadi rujukan."
          wajib
        />
        <Centang
          label="Aktif"
          nama="aktif"
          nilai={nilai?.aktif ?? true}
          petunjuk="Kalau dimatikan, materi hilang dari aplikasi tapi datanya tetap tersimpan."
        />
      </Bagian>

      <TombolUtama sedang={sedang}>
        <Save className="size-4" aria-hidden />
        {sedang ? "Menyimpan…" : "Simpan materi"}
      </TombolUtama>
    </form>
  );
}
