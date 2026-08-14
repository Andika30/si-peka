import Link from "next/link";
import { ArrowLeft, Ban } from "lucide-react";
import Ilustrasi from "@/components/Ilustrasi";
import { Anak, Berurutan, Muncul } from "@/components/gerak";
import { Finder, Halaman, Kartu, Peringatan } from "@/components/ui";
import { ambilKuis, ambilMasalah, ambilSkenario, ambilTopik } from "@/lib/konten";

/**
 * Sengaja BUKAN bagian dari dashboard.
 *
 * Halaman ini ditautkan dari halaman depan, jadi bisa dibuka orang yang belum
 * masuk sama sekali. Membungkusnya dengan bilah navigasi aplikasi akan
 * menyiratkan mereka sudah berada di dalam, padahal belum.
 */

const FITUR = [
  {
    warna: "adukan" as const,
    judul: "Materi & Kuis",
    isi: "Materi singkat yang dikelompokkan menurut jenis layanan pembayaran dan topik keamanannya, disusun dari publikasi resmi Bank Indonesia. Tiap materi ditutup kuis — setiap jawaban langsung disertai pembahasan dan rujukan bagian yang perlu dibaca ulang.",
  },
  {
    warna: "kenali" as const,
    judul: "Simulasi",
    isi: "Latihan mengambil keputusan pada situasi transaksi. Pilihan keliru tidak langsung divonis — akibatnya diperlihatkan lebih dulu.",
  },
  {
    warna: "ungu" as const,
    judul: "Panduan Pengaduan",
    isi: "Menjawab dua hal: apa yang harus dilakukan, dan ke mana harus mengadu. Bukan tempat mengirim laporan.",
  },
];

const TIDAK = [
  "Menerima laporan masyarakat",
  "Menyimpan data pengaduan",
  "Meminta data finansial",
  "Meminta OTP atau PIN",
  "Memproses transaksi",
  "Menggantikan kanal resmi Bank Indonesia maupun penyelenggara",
];

export default async function Tentang() {
  const [topik, kuis, skenario, masalah] = await Promise.all([
    ambilTopik(),
    ambilKuis(),
    ambilSkenario(),
    ambilMasalah(),
  ]);

  return (
    <>
      <header className="border-b border-garis bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid size-9 place-content-center rounded-dalam gradien-merek">
              <span className="grid grid-cols-2 gap-0.5" aria-hidden>
                <Finder className="size-2.5" warna="putih" />
                <Finder className="size-2.5" warna="putih" />
                <Finder className="size-2.5" warna="putih" />
                <span className="size-2.5" />
              </span>
            </span>
            <span className="text-subjudul text-institusi">PeKA</span>
          </Link>
          <Link
            className="flex items-center gap-2 text-kecil font-bold text-tinta-55 transition-colors hover:text-institusi"
            href="/"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Halaman depan
          </Link>
        </div>
      </header>

      <Halaman sempit>
        <Muncul className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Ilustrasi className="w-40 shrink-0 sm:w-44" nama="merek" warna="adukan" />
          <div>
            <span className="font-mono text-data uppercase text-tinta-55">Tentang aplikasi</span>
            <h1 className="mt-1 text-display text-tinta">PeKA</h1>
            <p className="mt-2 text-isi text-tinta-70">
              Media edukasi dan simulasi keamanan pembayaran digital untuk masyarakat Sulawesi
              Tenggara.
            </p>
          </div>
        </Muncul>

        <h2 className="mb-3 text-subjudul text-tinta">Tiga kelompok fitur</h2>
        <Berurutan className="mb-8 flex flex-col gap-3">
          {FITUR.map((p) => (
            <Anak key={p.judul}>
              <Kartu aksen={p.warna}>
                <div className="mb-2 flex items-center gap-3">
                  <Finder warna={p.warna} />
                  <p className="text-subjudul text-tinta">{p.judul}</p>
                </div>
                <p className="text-isi text-tinta-70">{p.isi}</p>
              </Kartu>
            </Anak>
          ))}
        </Berurutan>

        <h2 className="mb-3 text-subjudul text-tinta">Isi aplikasi</h2>
        <Kartu className="mb-8">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { n: topik.length, l: "materi singkat" },
              { n: kuis.length, l: "kuis per topik" },
              { n: skenario.length, l: "skenario simulasi" },
              { n: masalah.length, l: "jenis masalah" },
            ].map(({ n, l }) => (
              <div key={l}>
                <dt className="text-judul text-institusi">{n}</dt>
                <dd className="text-kecil text-tinta-70">{l}</dd>
              </div>
            ))}
          </dl>
        </Kartu>

        {/* Batasan proyek ditulis di halaman publik, bukan disembunyikan —
            justru inilah yang membedakannya dari sistem pengaduan. */}
        <h2 className="mb-1 text-subjudul text-tinta">Batasan aplikasi</h2>
        <p className="mb-4 text-isi text-tinta-70">
          Ini <strong className="text-tinta">media pendukung edukasi</strong>, bukan sistem
          pengaduan. Setiap alur panduan selalu berakhir di kanal resmi pihak lain — tidak ada satu
          pun tombol &ldquo;kirim ke kami&rdquo;. Aplikasi ini tidak:
        </p>
        <Berurutan className="mb-8 grid gap-2 sm:grid-cols-2">
          {TIDAK.map((t) => (
            <Anak key={t}>
              <div className="flex h-full items-start gap-3 rounded-dalam border border-garis bg-white p-4">
                <Ban className="mt-0.5 size-5 shrink-0 text-waspada" aria-hidden />
                <span className="text-kecil text-tinta">{t}</span>
              </div>
            </Anak>
          ))}
        </Berurutan>

        <Peringatan>
          Bank Indonesia dan penyelenggara resmi tidak pernah meminta PIN, password, atau OTP kamu.
        </Peringatan>

        <Kartu className="mb-8" nada="adukan">
          <h2 className="mb-2 text-subjudul text-tinta">Data kamu</h2>
          <p className="text-isi leading-relaxed text-tinta-70">
Tidak ada akun dan tidak ada kata sandi. Seluruh progres materi, hasil kuis, dan
            riwayat simulasi tersimpan di peramban perangkatmu sendiri dengan ID sesi acak — tanpa
            nama asli, nomor telepon, nomor rekening, atau data transaksi.
          </p>
        </Kartu>

        <Kartu className="mb-8">
          <h2 className="mb-2 text-subjudul text-tinta">Pengembang</h2>
          <p className="text-isi leading-relaxed text-tinta-70">
            Dikembangkan pada kegiatan magang di Kantor Perwakilan Bank Indonesia Provinsi Sulawesi
            Tenggara, sebagai media pendukung edukasi dan pelindungan konsumen di bidang sistem
            pembayaran.
          </p>
        </Kartu>

      </Halaman>
    </>
  );
}
