"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Gamepad2, LifeBuoy } from "lucide-react";
import AppShell from "@/components/AppShell";
import { ambilIkon } from "@/components/ikon";
import Ilustrasi, { ilustrasiModul } from "@/components/Ilustrasi";
import { Anak, Angka, Berurutan, Muncul, Sentuh } from "@/components/gerak";
import { BarProgres, Chip, Halaman, Kartu, KotakStat, Tombol, warnaTeks } from "@/components/ui";
import type { Kategori, Masalah, Topik } from "@/lib/tipe";
import {
  kuisDikerjakan,
  langgan,
  materiSelesai,
  progresMateri,
  rerataKuis,
  snapshot,
  snapshotServer,
  topikBerikutnya,
} from "@/lib/skor";

/** Kuis tidak punya menu sendiri — ia melekat pada materinya. */
const MENU = [
  {
    href: "/materi",
    label: "Materi & Kuis",
    ringkas: "Baca materi, lalu uji pemahamanmu",
    Ikon: BookOpen,
    warna: "adukan" as const,
  },
  {
    href: "/simulasi",
    label: "Simulasi",
    ringkas: "Latihan mengambil keputusan",
    Ikon: Gamepad2,
    warna: "kenali" as const,
  },
  {
    href: "/panduan",
    label: "Panduan Pengaduan",
    ringkas: "Apa yang dilakukan, ke mana mengadu",
    Ikon: LifeBuoy,
    warna: "ungu" as const,
  },
];

export default function LayarBeranda({
  kategori,
  topik,
  masalah,
  jumlahKuis,
  jumlahSkenario,
}: {
  kategori: Kategori[];
  topik: Topik[];
  masalah: Masalah[];
  jumlahKuis: number;
  jumlahSkenario: number;
}) {
  const sesi = useSyncExternalStore(langgan, snapshot, snapshotServer);

  const progres = progresMateri(sesi, topik.length);
  const selesai = materiSelesai(sesi);
  const lanjut = topikBerikutnya(sesi, topik);
  const dikerjakan = kuisDikerjakan(sesi);

  // Materi bisa dikosongkan lewat admin; beranda harus tetap tampil.
  if (!lanjut) {
    return (
      <AppShell>
        <Halaman>
          <header className="mb-6">
            <p className="text-kecil text-tinta-55">Hai, selamat datang</p>
            <h1 className="text-display text-tinta">{sesi.nama}</h1>
          </header>
          <Kartu nada="adukan">
            <p className="text-isi text-tinta-70">
              Belum ada materi yang aktif. Isi materinya lebih dulu lewat basis data.
            </p>
          </Kartu>
        </Halaman>
      </AppShell>
    );
  }

  const IkonLanjut = ambilIkon(lanjut.ikon);

  return (
    <AppShell>
      <Halaman>
        <header className="mb-6">
          <p className="text-kecil text-tinta-55">Hai, selamat datang</p>
          <h1 className="text-display text-tinta">{sesi.nama}</h1>
        </header>

        {/* Panel pembuka hanya untuk yang benar-benar baru. Begitu ada satu
            materi yang dibaca, ia hilang sendiri — tidak jadi hiasan permanen. */}
        {selesai === 0 ? (
          <Muncul className="mb-6">
            <Kartu aksen="adukan" className="flex flex-col gap-5 lg:flex-row lg:items-center">
              <Ilustrasi className="w-32 shrink-0 lg:w-40" nama="merek" warna="adukan" />
              <div className="min-w-0 flex-1">
                <span className="font-mono text-data uppercase text-tinta-55">Mulai dari sini</span>
                <h2 className="mt-1 text-judul text-tinta">Baru pertama kali di sini?</h2>
                <p className="mt-1 text-isi text-tinta-70">
                  Mulai dari materi tentang layanan yang paling sering kamu pakai, lalu uji
                  pemahamanmu lewat kuis. Tidak ada urutan wajib — pilih yang kamu butuhkan.
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Tombol href="/materi">
                    Mulai belajar
                    <ArrowRight className="size-4" aria-hidden />
                  </Tombol>
                  <Tombol href={`/kuis/${lanjut.kuisTerkait}`} jenis="garis">
                    Saya sudah pernah belajar
                  </Tombol>
                </div>
              </div>
            </Kartu>
          </Muncul>
        ) : null}

        {/* Baris atas: progres + lanjutkan. Di desktop berdampingan, di ponsel bertumpuk. */}
        <Muncul className="mb-6 grid gap-4 lg:grid-cols-5">
          <Kartu className="lg:col-span-2">
            <div className="mb-4">
              <p className="text-subjudul text-tinta">Progres belajar</p>
              <p className="mt-0.5 text-kecil text-tinta-55">
                {selesai} dari {topik.length} materi sudah dibaca
              </p>
            </div>
            <p className="mb-2 text-display text-adukan">
              <Angka nilai={progres} akhiran="%" />
            </p>
            <BarProgres nilai={progres} />

            <div className="mt-5 grid grid-cols-3 gap-2 rounded-dalam bg-kertas p-2">
              <KotakStat label="Materi" nilai={<Angka nilai={selesai} />} warna="adukan" />
              <KotakStat label="Kuis" nilai={<Angka nilai={dikerjakan} />} warna="peduli" />
              <KotakStat
                label="Simulasi"
                nilai={<Angka nilai={sesi.simulasi.length} />}
                warna="kenali"
              />
            </div>

            {dikerjakan > 0 ? (
              <p className="mt-3 text-center text-kecil text-tinta-55">
                Rata-rata jawaban kuis benar {rerataKuis(sesi)}%
              </p>
            ) : null}
          </Kartu>

          <Kartu className="flex flex-col lg:col-span-3">
            <p className="mb-4 text-subjudul text-tinta">
              {progres === 100 ? "Semua materi sudah dibaca" : "Lanjutkan materi"}
            </p>
            <div className="flex flex-1 items-start gap-4">
              {/* Ilustrasi menggantikan chip mulai sm — di ponsel ia memakan
                  ruang yang lebih berguna untuk judul dan ringkasannya. */}
              <Ilustrasi
                className="hidden w-28 shrink-0 sm:block lg:w-36"
                nama={ilustrasiModul(lanjut.ikon)}
                warna={lanjut.warna}
              />
              <span className="sm:hidden">
                <Chip Ikon={IkonLanjut} besar warna={lanjut.warna} />
              </span>
              <div className="min-w-0 flex-1">
                <p className={`font-mono text-data uppercase ${warnaTeks(lanjut.warna)}`}>
                  {kategori.find((k) => k.id === lanjut.kategori)?.nama}
                </p>
                <p className="mt-1 text-subjudul text-tinta">{lanjut.judul}</p>
                <p className="mt-1 text-kecil text-tinta-70">{lanjut.ringkas}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Tombol href={`/materi/${lanjut.id}`}>
                Baca materi
                <ArrowRight className="size-4" aria-hidden />
              </Tombol>
              <Tombol href={`/kuis/${lanjut.kuisTerkait}`} jenis="garis">
                Langsung kuis
              </Tombol>
            </div>
          </Kartu>
        </Muncul>

        {/* Menu utama — di ponsel inilah satu-satunya jalan ke Kuis dan
            Panduan, karena bilah bawah hanya memuat empat tujuan. */}
        <h2 className="mb-3 text-subjudul text-tinta">Menu utama</h2>
        <Berurutan className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {MENU.map(({ href, label, ringkas, Ikon, warna }) => (
            <Anak key={href}>
              <Sentuh>
                <Link
                  className="flex h-full items-start gap-3 rounded-kartu border border-garis bg-white p-4 shadow-kartu"
                  href={href}
                >
                  <Chip Ikon={Ikon} warna={warna} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-kecil font-bold text-tinta">{label}</span>
                    <span className="mt-0.5 block text-kecil text-tinta-55">{ringkas}</span>
                  </span>
                </Link>
              </Sentuh>
            </Anak>
          ))}
        </Berurutan>

        {/* Pintasan panduan: orang yang sedang panik tidak akan menelusuri
            menu. Tiga masalah tersering dinaikkan ke beranda. */}
        <div className="flex items-center justify-between">
          <h2 className="text-subjudul text-tinta">Sedang mengalami masalah?</h2>
          <Link className="text-kecil font-bold text-adukan" href="/panduan">
            Lihat semua
          </Link>
        </div>

        <Berurutan className="mt-3 grid gap-3 md:grid-cols-3">
          {masalah.slice(0, 3).map((m) => (
            <Anak key={m.id}>
              <Sentuh>
                <Link
                  className="flex h-full items-start gap-3 rounded-kartu border border-garis bg-white p-4 shadow-kartu"
                  href={`/panduan/hasil/${m.id}`}
                >
                  <LifeBuoy className="mt-0.5 size-5 shrink-0 text-adukan" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-kecil font-bold text-tinta">{m.label}</span>
                    <span className="mt-0.5 block text-kecil text-tinta-55">{m.ringkas}</span>
                  </span>
                </Link>
              </Sentuh>
            </Anak>
          ))}
        </Berurutan>

        <p className="mt-8 text-center text-kecil text-tinta-55">
          {topik.length} materi &middot; {jumlahKuis} kuis &middot; {jumlahSkenario} skenario
          simulasi. Aplikasi ini tidak menerima laporan dan tidak pernah meminta PIN, password, atau
          OTP.
        </p>
      </Halaman>
    </AppShell>
  );
}
