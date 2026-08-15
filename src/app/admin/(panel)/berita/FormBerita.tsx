"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import {
  AreaTeks,
  Bagian,
  Centang,
  GalatKotak,
  Medan,
  TombolUtama,
} from "@/components/admin/ui";
import EditorBlok from "@/components/admin/EditorBlok";
import type { BlokIsi } from "@/lib/tipe";
import { simpanBerita } from "./aksi";
import type { HasilAksi } from "@/lib/admin/jaga";

const AWAL: HasilAksi = {};

export type NilaiBerita = {
  id: string;
  judul: string;
  ringkas: string;
  gambar: string | null;
  gambarAlt: string | null;
  sumber: string;
  tanggal: string;
  aktif: boolean;
  isi: BlokIsi[];
};

export default function FormBerita({ nilai }: { nilai?: NilaiBerita }) {
  const [hasil, kirim, sedang] = useActionState(simpanBerita, AWAL);
  const hariIni = new Date().toISOString().slice(0, 10);

  return (
    <form action={kirim}>
      <GalatKotak pesan={hasil.galat} />
      {hasil.pesan ? (
        <p className="mb-5 rounded-dalam border border-peduli/30 bg-peduli-lembut p-3 text-kecil font-bold text-peduli">
          {hasil.pesan}
        </p>
      ) : null}

      <input name="idLama" type="hidden" value={nilai?.id ?? ""} />

      <Bagian judul="Judul & ringkasan" keterangan="Yang tampil di kartu halaman depan.">
        <Medan label="Judul" maks={220} nama="judul" nilai={nilai?.judul} wajib />
        <AreaTeks
          baris={3}
          label="Ringkasan"
          nama="ringkas"
          nilai={nilai?.ringkas}
          petunjuk="Dua sampai tiga kalimat. Ini yang dibaca orang sebelum memutuskan membuka beritanya."
          wajib
        />
      </Bagian>

      <Bagian
        judul="Tanggal & sumber"
        keterangan="Keduanya wajib. Berita terikat waktu — tanpa tanggal dan sumber, pembaca tidak punya cara menilai kabarnya masih berlaku atau tidak."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-kecil font-bold text-tinta">
              Tanggal terbit<span className="text-waspada"> *</span>
            </span>
            <input
              className="h-11 w-full rounded-dalam border border-garis bg-white px-3 text-isi text-tinta"
              defaultValue={nilai?.tanggal ?? hariIni}
              name="tanggal"
              required
              type="date"
            />
            <span className="mt-1 block text-kecil text-tinta-55">
              Menentukan urutan tampil — terbaru lebih dulu.
            </span>
          </label>
          <Medan
            label="Sumber"
            maks={255}
            nama="sumber"
            nilai={nilai?.sumber ?? "Kantor Perwakilan Bank Indonesia Provinsi Sulawesi Tenggara"}
            petunjuk="Dicantumkan di bawah berita."
            wajib
          />
        </div>
      </Bagian>

      <Bagian
        judul="Gambar sampul"
        keterangan="Opsional. Tampil di kartu halaman depan dan di atas isi berita. Tanpa gambar, kartunya memakai ikon polos."
      >
        <input name="gambarLama" type="hidden" value={nilai?.gambar ?? ""} />

        {nilai?.gambar ? (
          <img
            alt=""
            className="max-h-56 rounded-dalam border border-garis"
            src={`/gambar/${nilai.gambar}`}
          />
        ) : null}

        <label className="block">
          <span className="mb-1.5 block text-kecil font-bold text-tinta">
            {nilai?.gambar ? "Ganti sampul" : "Pilih sampul"}
          </span>
          <input
            accept="image/jpeg,image/png,image/webp"
            className="block w-full text-kecil text-tinta-70 file:mr-3 file:rounded-tombol file:border-0 file:bg-adukan-lembut file:px-4 file:py-2 file:text-kecil file:font-bold file:text-adukan"
            name="gambar"
            type="file"
          />
          <span className="mt-1 block text-kecil text-tinta-55">
            JPG, PNG, atau WEBP. Maksimal 2 MB.
            {nilai?.gambar ? " Biarkan kosong kalau sampulnya tidak diganti." : ""}
          </span>
        </label>

        <Medan
          label="Teks alternatif"
          maks={255}
          nama="gambarAlt"
          nilai={nilai?.gambarAlt}
          petunjuk="Menjelaskan isi gambar untuk pembaca layar."
        />

        {nilai?.gambar ? (
          <Centang label="Hapus sampul" nama="hapusGambar" petunjuk="Kartu kembali memakai ikon." />
        ) : null}
      </Bagian>

      <EditorBlok awal={nilai?.isi ?? []} />

      <Bagian judul="Status">
        <Centang
          label="Terbitkan"
          nama="aktif"
          nilai={nilai?.aktif ?? true}
          petunjuk="Kalau dimatikan, berita jadi draf — tersimpan tapi tidak tampil di halaman depan."
        />
      </Bagian>

      <TombolUtama sedang={sedang}>
        <Save className="size-4" aria-hidden />
        {sedang ? "Menyimpan…" : "Simpan berita"}
      </TombolUtama>
    </form>
  );
}
