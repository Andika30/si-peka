import Link from "next/link";
import { ArrowRight, Gavel, Gamepad2, ShieldCheck } from "lucide-react";
import Ilustrasi from "@/components/Ilustrasi";
import { Finder } from "@/components/ui";

const PILAR = [
  { Ikon: ShieldCheck, judul: "Peduli", isi: "Pahami risikonya sebelum kamu bayar" },
  { Ikon: Gamepad2, judul: "Kenali", isi: "Hadapi skenario nyata, lihat akibat pilihanmu" },
  { Ikon: Gavel, judul: "Adukan", isi: "Tahu harus ke mana saat transaksi bermasalah" },
];

export default function Landing() {
  return (
    <main className="min-h-screen gradien-merek">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-8 sm:px-8 lg:flex-row lg:items-center lg:gap-16 lg:py-16">
        {/* Kolom merek */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid size-12 place-content-center rounded-dalam bg-white/15 backdrop-blur">
              <span className="grid grid-cols-2 gap-1" aria-hidden>
                <Finder className="size-3.5" warna="putih" />
                <Finder className="size-3.5" warna="putih" />
                <Finder className="size-3.5" warna="putih" />
                <span className="size-3.5" />
              </span>
            </span>
            <span className="text-display text-white">PeKA</span>
          </div>

          <h1 className="max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Edukasi Keamanan Pembayaran Digital
          </h1>

          <p className="mt-3 font-mono text-data uppercase tracking-widest text-white/70">
            Peduli &middot; Kenali &middot; Adukan
          </p>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/85">
            Belajar mengenali risiko transaksi digital, berlatih lewat skenario nyata, dan tahu
            persis ke mana harus mengadu ketika ada yang tidak beres.
          </p>

          <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row lg:w-auto">
            <Link
              className="flex h-13 items-center justify-center gap-2 rounded-tombol bg-white px-8 py-3.5 text-sm font-bold text-institusi transition-colors hover:bg-white/90"
              href="/persetujuan"
            >
              Mulai Belajar
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              className="flex items-center justify-center rounded-tombol border border-white/30 px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
              href="/beranda"
            >
              Saya sudah pernah belajar
            </Link>
          </div>

          <p className="mt-8 max-w-lg text-xs leading-relaxed text-white/60">
            Program edukasi Kantor Perwakilan Bank Indonesia Provinsi Sulawesi Tenggara. PeKA tidak
            menerima laporan dan tidak pernah meminta PIN, password, atau OTP.
          </p>
        </div>

        {/* Ilustrasi memimpin di layar lebar; di ponsel ia mengecil dan
            memberi tempat pada tiga pilar. */}
        <div className="mt-10 flex flex-1 flex-col items-center gap-6 lg:mt-0 lg:max-w-lg">
          <Ilustrasi className="w-56 sm:w-72 lg:w-full" nama="merek" warna="adukan" />

          <div className="grid w-full gap-3 sm:grid-cols-3">
            {PILAR.map(({ Ikon, judul, isi }) => (
              <div
                className="rounded-kartu border border-white/15 bg-white/10 p-4 backdrop-blur"
                key={judul}
              >
                <Ikon className="mb-2 size-5 text-white" aria-hidden />
                <p className="text-subjudul text-white">{judul}</p>
                <p className="mt-1 text-kecil leading-snug text-white/75">{isi}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
