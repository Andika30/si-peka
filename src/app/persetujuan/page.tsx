"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Ban, BookOpen, CheckCircle2, ClipboardCheck, LineChart } from "lucide-react";
import AlurPengukuran from "@/components/AlurPengukuran";
import Ilustrasi from "@/components/Ilustrasi";
import { Anak, Berurutan, Muncul } from "@/components/gerak";
import { Chip, Halaman, Kartu, Tombol } from "@/components/ui";
import { modul, skenario, soal, sus } from "@/lib/konten";
import { setujui } from "@/lib/skor";

/* Menuliskan apa yang akan terjadi lebih dulu. Orang berhenti di tengah bukan
   karena malas, tapi karena tidak tahu ini akan berapa lama. */
const TAHAP = [
  {
    Ikon: ClipboardCheck,
    warna: "adukan" as const,
    judul: "Cek awal",
    isi: `${soal.length} pertanyaan singkat, tanpa nilai benar-salah yang diperlihatkan`,
  },
  {
    Ikon: BookOpen,
    warna: "peduli" as const,
    judul: "Belajar & berlatih",
    isi: `${modul.length} modul dan ${skenario.length} skenario simulasi, bisa dijeda kapan saja`,
  },
  {
    Ikon: LineChart,
    warna: "kenali" as const,
    judul: "Cek akhir & hasil",
    isi: `${soal.length} pertanyaan serupa, lalu ${sus.length} pernyataan penilaian aplikasi`,
  },
];

const DISIMPAN = [
  "Skor cek awal dan cek akhir kamu",
  "Penilaian kamu tentang kemudahan pemakaian aplikasi",
];

/* Daftar ini bukan basa-basi. Ia menuliskan batasan proyek jadi janji yang
   bisa ditagih pengguna — dan menjaga kami tetap di dalamnya. */
const TIDAK_DIMINTA = [
  "Nama, nomor telepon, atau alamat surel",
  "Nomor rekening, nominal, atau data transaksi",
  "PIN, password, atau OTP",
];

export default function Persetujuan() {
  const router = useRouter();

  return (
    <Halaman sempit>
      <AlurPengukuran kini="persetujuan" />

      {/* Ilustrasi memimpin, judul menyusul — halaman ini soal kepercayaan,
          jadi nada bukanya harus tenang, bukan seperti formulir. */}
      <Muncul className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <Ilustrasi className="w-40 shrink-0 sm:w-44" nama="perisai" warna="peduli" />
        <div>
          <span className="font-mono text-data uppercase text-tinta-55">Sebelum mulai</span>
          <h1 className="mt-1 text-display text-tinta">Belajar tanpa menyerahkan data pribadi</h1>
          <p className="mt-2 text-isi text-tinta-70">
            PeKA dikembangkan pada kegiatan magang di Kantor Perwakilan Bank Indonesia Provinsi
            Sulawesi Tenggara. Jawabanmu dipakai untuk mengukur apakah media ini benar-benar
            membantu.
          </p>
        </div>
      </Muncul>

      <h2 className="mb-3 text-subjudul text-tinta">Yang akan kamu lalui</h2>
      <Berurutan className="mb-8 grid gap-3 sm:grid-cols-3">
        {TAHAP.map(({ Ikon, warna, judul, isi }, i) => (
          <Anak key={judul}>
            <Kartu className="h-full">
              <div className="mb-3 flex items-center gap-3">
                <Chip Ikon={Ikon} warna={warna} />
                <span className="font-mono text-data uppercase text-tinta-55">Tahap {i + 1}</span>
              </div>
              <p className="text-subjudul text-tinta">{judul}</p>
              <p className="mt-1 text-kecil text-tinta-70">{isi}</p>
            </Kartu>
          </Anak>
        ))}
      </Berurutan>

      <Berurutan className="mb-8 grid gap-3 sm:grid-cols-2">
        <Anak>
          <Kartu aksen="peduli" className="h-full">
            <h2 className="mb-4 text-subjudul text-tinta">Yang kami simpan</h2>
            <ul className="flex flex-col gap-3">
              {DISIMPAN.map((t) => (
                <li className="flex gap-3 text-isi text-tinta" key={t}>
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-peduli" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-garis pt-3 text-kecil text-tinta-55">
              Tersimpan di peramban perangkat ini, dengan ID sesi acak.
            </p>
          </Kartu>
        </Anak>

        <Anak>
          <Kartu aksen="waspada" className="h-full">
            <h2 className="mb-4 text-subjudul text-tinta">Yang tidak pernah kami minta</h2>
            <ul className="flex flex-col gap-3">
              {TIDAK_DIMINTA.map((t) => (
                <li className="flex gap-3 text-isi text-tinta" key={t}>
                  <Ban className="mt-0.5 size-5 shrink-0 text-waspada" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-garis pt-3 text-kecil text-tinta-55">
              Kalau ada yang memintanya mengatasnamakan PeKA, itu bukan kami.
            </p>
          </Kartu>
        </Anak>
      </Berurutan>

      <Muncul>
        <Kartu className="mb-6" nada="adukan">
          <p className="text-isi text-tinta">
            Kamu boleh berhenti kapan saja. Kalau berhenti di tengah, jawaban yang sudah masuk
            tidak dipakai — dan seluruh datanya bisa kamu hapus lewat halaman Profil.
          </p>
        </Kartu>

        <div className="flex flex-col gap-2 sm:flex-row-reverse">
          <Tombol
            className="sm:flex-1"
            onClick={() => {
              setujui();
              router.push("/cek/awal");
            }}
          >
            Saya mengerti, mulai cek awal
            <ArrowRight className="size-4" aria-hidden />
          </Tombol>
          <Tombol href="/beranda" jenis="teks">
            Nanti saja
          </Tombol>
        </div>
      </Muncul>
    </Halaman>
  );
}
