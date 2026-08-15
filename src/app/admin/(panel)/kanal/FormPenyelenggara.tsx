"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { Bagian, Centang, GalatKotak, Medan, TombolUtama } from "@/components/admin/ui";
import { simpanPenyelenggara } from "./aksi";
import type { HasilAksi } from "@/lib/admin/jaga";

const AWAL: HasilAksi = {};

export type NilaiPenyelenggara = {
  id: string;
  nama: string;
  jenis: string;
  telepon: string;
  aplikasi: string;
  situs: string;
  diverifikasi: string;
  urutan: number;
  aktif: boolean;
};

export default function FormPenyelenggara({ nilai }: { nilai?: NilaiPenyelenggara }) {
  const [hasil, kirim, sedang] = useActionState(simpanPenyelenggara, AWAL);

  return (
    <form action={kirim}>
      <GalatKotak pesan={hasil.galat} />
      {hasil.pesan ? (
        <p className="mb-5 rounded-dalam border border-peduli/30 bg-peduli-lembut p-3 text-kecil font-bold text-peduli">
          {hasil.pesan}
        </p>
      ) : null}

      <input name="idLama" type="hidden" value={nilai?.id ?? ""} />

      <Bagian judul="Identitas">
        <Medan label="Nama" maks={160} nama="nama" nilai={nilai?.nama} wajib />
        <Medan
          label="Jenis"
          maks={120}
          nama="jenis"
          nilai={nilai?.jenis ?? "Bank umum"}
          petunjuk="Misalnya: Bank umum, Uang elektronik, Dompet digital."
          wajib
        />
      </Bagian>

      <Bagian
        judul="Kanal resmi"
        keterangan="Yang ditampilkan ke peserta saat mereka perlu menghubungi penyelenggara ini. Pastikan diambil dari sumber resmi, bukan hasil pencarian."
      >
        <Medan
          label="Call center"
          maks={120}
          nama="telepon"
          nilai={nilai?.telepon}
          petunjuk="Misalnya: 14000 (Halo Bank)"
          wajib
        />
        <Medan
          label="Kanal di aplikasi"
          maks={160}
          nama="aplikasi"
          nilai={nilai?.aplikasi}
          petunjuk="Misalnya: Menu Bantuan di aplikasi resminya."
        />
        <Medan label="Situs" maks={255} nama="situs" nilai={nilai?.situs} />
      </Bagian>

      <Bagian judul="Verifikasi & status">
        <Medan
          label="Diverifikasi terakhir"
          maks={64}
          nama="diverifikasi"
          nilai={nilai?.diverifikasi}
          petunjuk="Tampil apa adanya ke peserta. Perbarui setiap kali nomornya benar-benar dicek ulang — tanggal inilah yang membuat data basi kelihatan."
          wajib
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Medan jenis="number" label="Urutan tampil" nama="urutan" nilai={nilai?.urutan} />
          <Centang
            label="Aktif"
            nama="aktif"
            nilai={nilai?.aktif ?? true}
            petunjuk="Kalau dimatikan, penyelenggara ini hilang dari pilihan peserta."
          />
        </div>
      </Bagian>

      <TombolUtama sedang={sedang}>
        <Save className="size-4" aria-hidden />
        {sedang ? "Menyimpan…" : "Simpan penyelenggara"}
      </TombolUtama>
    </form>
  );
}
