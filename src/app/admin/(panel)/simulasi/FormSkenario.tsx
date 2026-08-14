"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { AreaTeks, Bagian, Centang, GalatKotak, Medan, TombolUtama } from "@/components/admin/ui";
import { simpanSkenario } from "./aksi";
import type { HasilAksi } from "@/lib/admin/jaga";

const AWAL: HasilAksi = {};

export type NilaiSkenario = {
  id: string;
  situasi: string;
  alasan: string;
  urutan: number;
  aktif: boolean;
  konteks: { label: string; nilai: string }[];
  opsi: { teks: string; aman: boolean; konsekuensi: string | null }[];
};

export default function FormSkenario({ nilai }: { nilai?: NilaiSkenario }) {
  const [hasil, kirim, sedang] = useActionState(simpanSkenario, AWAL);
  const amanKe = nilai?.opsi.findIndex((o) => o.aman) ?? -1;

  return (
    <form action={kirim}>
      <GalatKotak pesan={hasil.galat} />
      {hasil.pesan ? (
        <p className="mb-5 rounded-dalam border border-peduli/30 bg-peduli-lembut p-3 text-kecil font-bold text-peduli">
          {hasil.pesan}
        </p>
      ) : null}

      <input name="idLama" type="hidden" value={nilai?.id ?? ""} />

      {!nilai?.id ? (
        <Bagian judul="Nama skenario" keterangan="Dipakai membuat alamat halaman, tidak tampil ke peserta.">
          <Medan label="Nama singkat" maks={60} nama="nama" petunjuk="Misalnya: penipuan otp" wajib />
        </Bagian>
      ) : null}

      <Bagian
        judul="Kartu konteks"
        keterangan="Baris yang tampil di kartu mirip layar konfirmasi pembayaran. Kosongkan baris yang tidak dipakai."
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div className="grid gap-3 sm:grid-cols-[1fr_2fr]" key={i}>
            <input
              className="h-11 rounded-dalam border border-garis bg-white px-3 text-isi text-tinta"
              defaultValue={nilai?.konteks[i]?.label ?? ""}
              name={`konteks.${i}.label`}
              placeholder={i === 0 ? "Label, misalnya: Nama toko" : "Label"}
              type="text"
            />
            <input
              className="h-11 rounded-dalam border border-garis bg-white px-3 text-isi text-tinta"
              defaultValue={nilai?.konteks[i]?.nilai ?? ""}
              name={`konteks.${i}.nilai`}
              placeholder={i === 0 ? "Isi, misalnya: Toko Berkah" : "Isi"}
              type="text"
            />
          </div>
        ))}
      </Bagian>

      <Bagian judul="Situasi">
        <AreaTeks
          baris={3}
          label="Pertanyaan yang dihadapi peserta"
          nama="situasi"
          nilai={nilai?.situasi}
          petunjuk="Akhiri dengan pertanyaan, misalnya: Apa yang kamu lakukan?"
          wajib
        />
      </Bagian>

      <Bagian
        judul="Pilihan tindakan"
        keterangan="Tandai tepat satu pilihan yang aman. Pilihan keliru wajib punya konsekuensi — itu yang diperlihatkan lebih dulu sebelum penjelasan."
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div className="rounded-dalam border border-garis bg-white p-3" key={i}>
            <label className="mb-2 flex items-center gap-3">
              <input
                aria-label={`Tandai pilihan ${i + 1} sebagai aman`}
                className="size-4 shrink-0"
                defaultChecked={amanKe === i}
                name="aman"
                type="radio"
                value={i}
              />
              <span className="w-16 shrink-0 font-mono text-data uppercase text-tinta-55">
                Aman
              </span>
              <input
                className="h-10 flex-1 rounded-dalam border border-garis bg-kertas px-3 text-isi text-tinta"
                defaultValue={nilai?.opsi[i]?.teks ?? ""}
                name={`opsi.${i}.teks`}
                placeholder={`Pilihan ${i + 1}`}
                type="text"
              />
            </label>
            <input
              className="h-10 w-full rounded-dalam border border-garis bg-kertas px-3 text-kecil text-tinta"
              defaultValue={nilai?.opsi[i]?.konsekuensi ?? ""}
              name={`opsi.${i}.konsekuensi`}
              placeholder="Kalau keliru: apa yang terjadi berikutnya?"
              type="text"
            />
          </div>
        ))}
      </Bagian>

      <Bagian judul="Penjelasan & status">
        <AreaTeks
          baris={3}
          label="Langkah yang aman"
          nama="alasan"
          nilai={nilai?.alasan}
          petunjuk="Muncul di akhir, apa pun pilihan peserta. Jelaskan alasannya — bukan sekadar menyatakan mana yang benar."
          wajib
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Medan jenis="number" label="Urutan tampil" nama="urutan" nilai={nilai?.urutan} />
          <Centang label="Aktif" nama="aktif" nilai={nilai?.aktif ?? true} />
        </div>
      </Bagian>

      <TombolUtama sedang={sedang}>
        <Save className="size-4" aria-hidden />
        {sedang ? "Menyimpan…" : "Simpan skenario"}
      </TombolUtama>
    </form>
  );
}
