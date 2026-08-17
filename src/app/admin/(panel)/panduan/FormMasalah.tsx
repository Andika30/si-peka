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
import { simpanMasalah } from "./aksi";
import type { HasilAksi } from "@/lib/admin/jaga";

const AWAL: HasilAksi = {};

export type NilaiMasalah = {
  id: string;
  label: string;
  ringkas: string;
  judul: string;
  pembuka: string;
  segera: string | null;
  peringatanUtama: string | null;
  pihak: string;
  perluLayanan: boolean;
  perluPenyelenggara: boolean;
  eskalasiBI: boolean;
  topikId: string | null;
  sumber: string;
  urutan: number;
  aktif: boolean;
  langkah: string[];
};

export default function FormMasalah({
  nilai,
  topik,
}: {
  nilai?: NilaiMasalah;
  topik: { id: string; judul: string }[];
}) {
  const [hasil, kirim, sedang] = useActionState(simpanMasalah, AWAL);

  return (
    <form action={kirim}>
      <GalatKotak pesan={hasil.galat} />
      {hasil.pesan ? (
        <p className="mb-5 rounded-dalam border border-peduli/30 bg-peduli-lembut p-3 text-kecil font-bold text-peduli">
          {hasil.pesan}
        </p>
      ) : null}

      <input name="idLama" type="hidden" value={nilai?.id ?? ""} />

      <Bagian judul="Yang dipilih peserta" keterangan="Tampil sebagai kartu di halaman Panduan Pengaduan.">
        <Medan label="Label masalah" maks={160} nama="label" nilai={nilai?.label} wajib />
        <Medan
          label="Ringkasan satu baris"
          maks={255}
          nama="ringkas"
          nilai={nilai?.ringkas}
          petunjuk="Misalnya: Ada transaksi di riwayat yang tidak kamu lakukan"
          wajib
        />
      </Bagian>

      <Bagian judul="Halaman jawaban">
        <Medan label="Judul" maks={200} nama="judul" nilai={nilai?.judul} wajib />
        <AreaTeks
          baris={3}
          label="Paragraf pembuka"
          nama="pembuka"
          nilai={nilai?.pembuka}
          petunjuk="Menenangkan dan menjelaskan duduk perkaranya sebelum masuk ke langkah."
          wajib
        />
        <AreaTeks
          baris={6}
          label="Langkah"
          nama="langkah"
          nilai={nilai?.langkah.join("\n")}
          petunjuk="Satu langkah per baris, urut. Ditampilkan bernomor."
          wajib
        />
        <Medan
          label="Pihak yang dihubungi"
          maks={255}
          nama="pihak"
          nilai={nilai?.pihak}
          petunjuk="Ditampilkan sebagai jawaban tersendiri. Misalnya: Penyelenggara jasa pembayaran yang kamu gunakan"
          wajib
        />
      </Bagian>

      <Bagian
        judul="Penanda khusus"
        keterangan="Keduanya opsional. Dipakai hemat — kalau semua kasus ditandai mendesak, tidak ada yang terbaca mendesak."
      >
        <AreaTeks
          baris={2}
          label="Kalimat mendesak"
          nama="segera"
          nilai={nilai?.segera}
          petunjuk="Tampil paling atas dengan ikon jam. Hanya untuk kasus yang benar-benar tidak boleh ditunda."
        />
        <AreaTeks
          baris={2}
          label="Peringatan keamanan"
          nama="peringatanUtama"
          nilai={nilai?.peringatanUtama}
          petunjuk="Tampil sebagai kotak merah SEBELUM langkah. Untuk kasus yang penipunya mungkin masih memegang akses."
        />
      </Bagian>

      <Bagian
        judul="Langkah sebelum jawaban"
        keterangan="Yang ditanyakan ke peserta sebelum jawabannya muncul. Matikan yang tidak menentukan apa-apa untuk masalah ini — pertanyaan yang tidak mengubah jawaban hanya menunda orang yang sedang panik."
      >
        <Centang
          label="Tanyakan jenis layanan"
          nama="perluLayanan"
          nilai={nilai?.perluLayanan ?? true}
          petunjuk="Berguna kalau jawabannya bergantung layanan yang dipakai. Jawabannya juga menyempitkan daftar penyelenggara di langkah berikutnya."
        />
        <Centang
          label="Tanyakan penyelenggara"
          nama="perluPenyelenggara"
          nilai={nilai?.perluPenyelenggara ?? true}
          petunjuk="Matikan kalau kanal yang ditampilkan tidak bergantung penyelenggara — misalnya kasus yang berujung ke Bank Indonesia."
        />
      </Bagian>

      <Bagian judul="Keterkaitan & status">
        <Centang
          label="Buka jalur Bank Indonesia"
          nama="eskalasiBI"
          nilai={nilai?.eskalasiBI ?? false}
          petunjuk="Hanya untuk masalah yang sudah melewati penyelenggara. Kalau semua masalah membuka jalur ini, peserta akan mengadu ke BI lebih dulu — dan itu keliru."
        />
        <Pilih
          label="Materi terkait"
          nama="topikId"
          nilai={nilai?.topikId ?? ""}
          opsi={[
            { nilai: "", label: "— tidak ada —" },
            ...topik.map((t) => ({ nilai: t.id, label: t.judul })),
          ]}
          petunjuk="Ditautkan sebagai 'supaya tidak terulang' di bawah langkah."
        />
        <Medan label="Sumber" maks={255} nama="sumber" nilai={nilai?.sumber} wajib />
        <div className="grid gap-4 sm:grid-cols-2">
          <Medan jenis="number" label="Urutan tampil" nama="urutan" nilai={nilai?.urutan} />
          <Centang label="Aktif" nama="aktif" nilai={nilai?.aktif ?? true} />
        </div>
      </Bagian>

      <TombolUtama sedang={sedang}>
        <Save className="size-4" aria-hidden />
        {sedang ? "Menyimpan…" : "Simpan panduan"}
      </TombolUtama>
    </form>
  );
}
