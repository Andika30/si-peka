"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { AreaTeks, Centang, GalatKotak, Medan, TombolUtama } from "@/components/admin/ui";
import { simpanInfoAwal } from "./aksi";
import type { HasilAksi } from "@/lib/admin/jaga";

const AWAL: HasilAksi = {};

export type NilaiInfoAwal = {
  id: string;
  judul: string;
  keterangan: string | null;
  urutan: number;
  aktif: boolean;
};

export default function FormInfoAwal({ nilai }: { nilai?: NilaiInfoAwal }) {
  const [hasil, kirim, sedang] = useActionState(simpanInfoAwal, AWAL);

  return (
    <form action={kirim}>
      <GalatKotak pesan={hasil.galat} />
      {hasil.pesan ? (
        <p className="mb-5 rounded-dalam border border-peduli/30 bg-peduli-lembut p-3 text-kecil font-bold text-peduli">
          {hasil.pesan}
        </p>
      ) : null}

      <input name="idLama" type="hidden" value={nilai?.id ?? ""} />

      <div className="mb-6 flex flex-col gap-4 rounded-kartu border border-garis bg-kertas-tua/40 p-5">
        <Medan
          label="Judul"
          maks={160}
          nama="judul"
          nilai={nilai?.judul}
          petunjuk="Butir checklist itu sendiri, misalnya: Simpan bukti transaksi."
          wajib
        />
        <AreaTeks
          baris={3}
          label="Keterangan"
          maks={500}
          nama="keterangan"
          nilai={nilai?.keterangan}
          petunjuk="Opsional. Penjelasan singkat di bawah judul — kalau ada beberapa hal yang perlu disiapkan, gabungkan jadi satu kalimat."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Medan jenis="number" label="Urutan tampil" nama="urutan" nilai={nilai?.urutan} />
          <Centang
            label="Aktif"
            nama="aktif"
            nilai={nilai?.aktif ?? true}
            petunjuk="Kalau dimatikan, butir ini hilang dari halaman panduan."
          />
        </div>
      </div>

      <TombolUtama sedang={sedang}>
        <Save className="size-4" aria-hidden />
        {sedang ? "Menyimpan…" : "Simpan"}
      </TombolUtama>
    </form>
  );
}
