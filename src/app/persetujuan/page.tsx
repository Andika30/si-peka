"use client";

import { useRouter } from "next/navigation";
import { Ban, CheckCircle2, Info } from "lucide-react";
import { Halaman, Judul, Kartu, Tombol } from "@/components/dasar";
import { setujui } from "@/lib/skor";

const DISIMPAN = [
  "Skor cek awal dan cek akhir kamu",
  "Penilaian kamu tentang kemudahan pemakaian aplikasi",
];

// Daftar ini bukan basa-basi. Ia menuliskan batasan proyek jadi janji yang
// bisa ditagih pengguna — dan menjaga kami tetap di dalamnya.
const TIDAK_DIMINTA = [
  "Nama, nomor telepon, atau alamat surel",
  "Nomor rekening, nominal, atau data transaksi",
  "PIN, password, atau OTP",
];

export default function Persetujuan() {
  const router = useRouter();

  return (
    <Halaman sempit>
      <Judul
        sub="PeKA dikembangkan sebagai media edukasi pada kegiatan magang di Kantor Perwakilan Bank Indonesia Provinsi Sulawesi Tenggara. Jawabanmu dipakai untuk mengukur apakah media ini membantu."
      >
        Sebelum mulai
      </Judul>

      <Kartu className="mb-4">
        <h2 className="mb-4 text-subjudul">Yang kami simpan</h2>
        <ul className="flex flex-col gap-3">
          {DISIMPAN.map((t) => (
            <li className="flex gap-3 text-isi" key={t}>
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-peduli" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </Kartu>

      <Kartu className="mb-6">
        <h2 className="mb-4 text-subjudul">Yang tidak pernah kami minta</h2>
        <ul className="flex flex-col gap-3">
          {TIDAK_DIMINTA.map((t) => (
            <li className="flex gap-3 text-isi" key={t}>
              <Ban className="mt-0.5 size-5 shrink-0 text-waspada" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </Kartu>

      <div className="mb-6 flex items-start gap-3 rounded-tombol border border-garis bg-white/60 p-4">
        <Info className="mt-0.5 size-5 shrink-0 text-adukan" aria-hidden />
        <p className="text-kecil text-tinta-70">
          Kamu boleh berhenti kapan saja. Kalau berhenti, jawaban yang sudah masuk tidak dipakai.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row-reverse">
        <Tombol
          className="sm:flex-1"
          onClick={() => {
            setujui();
            router.push("/cek/awal");
          }}
        >
          Saya mengerti, mulai
        </Tombol>
        <Tombol href="/" jenis="teks">
          Nanti saja
        </Tombol>
      </div>
    </Halaman>
  );
}
