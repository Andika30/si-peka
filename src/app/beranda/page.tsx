"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Gamepad2, Gavel, MessageSquare, Trophy } from "lucide-react";
import AppShell from "@/components/AppShell";
import { ambilIkon } from "@/components/ikon";
import Ilustrasi, { ilustrasiModul } from "@/components/Ilustrasi";
import { Anak, Angka, Berurutan, Muncul, Sentuh } from "@/components/gerak";
import { BarProgres, Chip, Halaman, Kartu, KotakStat, Tombol, warnaTeks } from "@/components/ui";
import { modul, skenario } from "@/lib/konten";
import {
  jumlahLencana,
  langgan,
  modulBerikutnya,
  modulSelesai,
  progresKeseluruhan,
  progresModul,
  snapshot,
  snapshotServer,
  totalPoin,
} from "@/lib/skor";

const MENU = [
  { href: "/materi", label: "Materi & Kuis", Ikon: BookOpen, warna: "adukan" as const },
  { href: "/simulasi", label: "Simulasi", Ikon: Gamepad2, warna: "peduli" as const },
  { href: "/adukan", label: "Adukan", Ikon: Gavel, warna: "kenali" as const },
  { href: "/feedback", label: "Feedback", Ikon: MessageSquare, warna: "ungu" as const },
];

export default function Beranda() {
  const sesi = useSyncExternalStore(langgan, snapshot, snapshotServer);

  const progres = progresKeseluruhan(sesi);
  const selesai = modulSelesai(sesi);
  const lanjut = modulBerikutnya(sesi);
  const IkonLanjut = ambilIkon(lanjut.ikon);

  return (
    <AppShell>
      <Halaman>
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-kecil text-tinta-55">Hai, selamat datang</p>
            <h1 className="text-display text-tinta">{sesi.nama}</h1>
          </div>
          <Link
            className="hidden shrink-0 items-center gap-2 rounded-tombol border border-garis bg-white px-4 py-2.5 text-kecil font-bold text-tinta transition-colors hover:bg-kertas sm:flex"
            href="/pencapaian"
          >
            <Trophy className="size-4 text-emas" aria-hidden />
            {totalPoin(sesi)} poin
          </Link>
        </header>

        {/* Baris atas: progres + lanjutkan. Di desktop berdampingan, di ponsel bertumpuk. */}
        <Muncul className="mb-6 grid gap-4 lg:grid-cols-5">
          <Kartu className="lg:col-span-2">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-subjudul text-tinta">Progres belajar</p>
                <p className="mt-0.5 text-kecil text-tinta-55">
                  {selesai} dari {modul.length} modul selesai
                </p>
              </div>
              <Trophy className="size-8 shrink-0 text-emas" aria-hidden />
            </div>
            <p className="mb-2 text-display text-adukan"><Angka nilai={progres} akhiran="%" /></p>
            <BarProgres nilai={progres} />

            <div className="mt-5 grid grid-cols-3 gap-2 rounded-dalam bg-kertas p-2">
              <KotakStat label="Modul" nilai={<Angka nilai={selesai} />} warna="adukan" />
              <KotakStat label="Simulasi" nilai={<Angka nilai={sesi.simulasi.length} />} warna="peduli" />
              <KotakStat label="Lencana" nilai={<Angka nilai={jumlahLencana(sesi)} />} warna="emas" />
            </div>
          </Kartu>

          <Kartu className="flex flex-col lg:col-span-3">
            <p className="mb-4 text-subjudul text-tinta">
              {progres === 100 ? "Semua modul selesai" : "Lanjutkan materi"}
            </p>
            <div className="flex flex-1 items-start gap-4">
              {/* Ilustrasi menggantikan chip mulai sm — di ponsel ia memakan
                  ruang yang lebih berguna untuk judul dan bar progres. */}
              <Ilustrasi
                className="hidden w-28 shrink-0 sm:block lg:w-36"
                nama={ilustrasiModul(lanjut.ikon)}
                warna={lanjut.warna}
              />
              <span className="sm:hidden">
                <Chip Ikon={IkonLanjut} besar warna={lanjut.warna} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-data uppercase text-tinta-55">Modul {lanjut.nomor}</p>
                <p className="mt-1 text-subjudul text-tinta">{lanjut.judul}</p>
                <p className="mt-1 text-kecil text-tinta-70">{lanjut.ringkas}</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1">
                    <BarProgres nilai={progresModul(sesi, lanjut.id)} warna={lanjut.warna} />
                  </div>
                  <span className={`font-mono text-data ${warnaTeks(lanjut.warna)}`}>
                    {progresModul(sesi, lanjut.id)}%
                  </span>
                </div>
              </div>
            </div>
            <Tombol className="mt-5 self-start" href={`/materi/${lanjut.id}`}>
              {progresModul(sesi, lanjut.id) > 0 ? "Lanjutkan" : "Mulai belajar"}
              <ArrowRight className="size-4" aria-hidden />
            </Tombol>
          </Kartu>
        </Muncul>

        {/* Menu utama — di ponsel inilah satu-satunya jalan ke fitur, karena
            bilah bawah dipakai untuk Beranda/Riwayat/Pencapaian/Profil. */}
        <h2 className="mb-3 text-subjudul text-tinta">Menu utama</h2>
        <Berurutan className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {MENU.map(({ href, label, Ikon, warna }) => (
            <Anak key={href}>
              <Sentuh>
                <Link
                  className="flex items-center gap-3 rounded-kartu border border-garis bg-white p-4 shadow-kartu"
                  href={href}
                >
                  <Chip Ikon={Ikon} warna={warna} />
                  <span className="text-kecil font-bold text-tinta">{label}</span>
                </Link>
              </Sentuh>
            </Anak>
          ))}
        </Berurutan>

        <div className="flex items-center justify-between">
          <h2 className="text-subjudul text-tinta">Modul terbaru</h2>
          <Link className="text-kecil font-bold text-adukan" href="/materi">
            Lihat semua
          </Link>
        </div>

        <Berurutan className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {modul.slice(0, 3).map((m) => {
            const Ikon = ambilIkon(m.ikon);
            const p = progresModul(sesi, m.id);
            return (
              <Anak key={m.id}>
                <Sentuh>
                  <Link
                    className="flex items-start gap-4 rounded-kartu border border-garis bg-white p-4 shadow-kartu"
                    href={`/materi/${m.id}`}
                  >
                    <Chip Ikon={Ikon} warna={m.warna} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-data uppercase text-tinta-55">
                        Modul {m.nomor}
                      </span>
                      <span className="mt-0.5 block text-kecil font-bold text-tinta">{m.judul}</span>
                      <span className="mt-3 block">
                        <BarProgres nilai={p} warna={m.warna} />
                      </span>
                    </span>
                  </Link>
                </Sentuh>
              </Anak>
            );
          })}
        </Berurutan>

        <p className="mt-8 text-center text-kecil text-tinta-55">
          {skenario.length} skenario simulasi tersedia &middot; PeKA tidak menerima laporan dan tidak
          pernah meminta PIN, password, atau OTP.
        </p>
      </Halaman>
    </AppShell>
  );
}
