"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";
import AppShell from "@/components/AppShell";
import Ilustrasi from "@/components/Ilustrasi";
import { Anak, Berurutan, Sentuh, motion } from "@/components/gerak";
import { ambilIkon } from "@/components/ikon";
import { Chip, Eyebrow, Halaman, Judul, warnaTeks } from "@/components/ui";
import type { Kategori, Topik } from "@/lib/tipe";
import { langgan, snapshot, snapshotServer, sudahBaca } from "@/lib/skor";

/**
 * Materi dikelompokkan menurut jenis layanan dan topik keamanan — bukan
 * menurut PeKA. Penyaring memakai kategori itu, bukan urutan modul, karena
 * pengguna datang dengan pertanyaan ("QRIS ini aman tidak?"), bukan dengan
 * niat menamatkan kurikulum.
 */

export default function LayarMateri({
  kategori,
  topik,
}: {
  kategori: Kategori[];
  topik: Topik[];
}) {
  const sesi = useSyncExternalStore(langgan, snapshot, snapshotServer);
  const [saring, setSaring] = useState<string>("semua");

  const tampil = saring === "semua" ? topik : topik.filter((t) => t.kategori === saring);
  const tab = [{ id: "semua", nama: "Semua" }, ...kategori];

  return (
    <AppShell>
      <Halaman>
        <Judul
          sub={`${topik.length} materi singkat tentang layanan pembayaran digital dan cara mengamankannya. Tiap materi punya kuisnya sendiri di akhir halaman.`}
        >
          Materi &amp; Kuis
        </Judul>

        <div className="mb-5 inline-flex flex-wrap rounded-tombol bg-kertas-tua p-1">
          {tab.map((t) => (
            <button
              className={`relative rounded-[0.625rem] px-4 py-2 text-kecil font-bold transition-colors ${
                saring === t.id ? "text-institusi" : "text-tinta-55 hover:text-tinta"
              }`}
              key={t.id}
              onClick={() => setSaring(t.id)}
              type="button"
            >
              {saring === t.id ? (
                <motion.span
                  className="absolute inset-0 rounded-[0.625rem] bg-white shadow-kartu"
                  layoutId="pil-materi"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              ) : null}
              <span className="relative z-10">{t.nama}</span>
            </button>
          ))}
        </div>

        {saring !== "semua" ? (
          <p className="mb-4 text-isi text-tinta-70">
            {kategori.find((k) => k.id === saring)?.ringkas}
          </p>
        ) : null}

        {/* Satu kolom di ponsel, dua di tablet, tiga di desktop lebar. */}
        <Berurutan className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3" key={saring}>
          {tampil.map((t) => {
            const Ikon = ambilIkon(t.ikon);
            const selesai = sudahBaca(sesi, t.id);
            const hasil = sesi.kuis[t.kuisTerkait];
            return (
              <Anak key={t.id}>
                <Sentuh>
                  <Link
                    className="flex h-full items-start gap-4 rounded-kartu border border-garis bg-white p-4 shadow-kartu"
                    href={`/materi/${t.id}`}
                  >
                    <Chip Ikon={Ikon} besar warna={t.warna} />

                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className="text-kecil font-bold text-tinta">{t.judul}</span>
                        {selesai ? (
                          <CheckCircle2 className="size-5 shrink-0 text-peduli" aria-hidden />
                        ) : (
                          <ChevronRight className="size-5 shrink-0 text-tinta-55" aria-hidden />
                        )}
                      </span>
                      <span className="mt-0.5 block text-kecil text-tinta-55">{t.ringkas}</span>

                      <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-data uppercase">
                        <span className={warnaTeks(t.warna)}>
                          {kategori.find((k) => k.id === t.kategori)?.nama}
                        </span>
                        {hasil ? (
                          <span className="text-tinta-55">
                            Kuis {hasil.skor}% &middot; {hasil.benar}/{hasil.total}
                          </span>
                        ) : null}
                      </span>
                    </span>
                  </Link>
                </Sentuh>
              </Anak>
            );
          })}
        </Berurutan>

        {tampil.length === 0 ? (
          <div className="rounded-kartu border border-dashed border-garis p-10 text-center">
            <Ilustrasi className="mx-auto mb-2 w-44" nama="kosong" warna="adukan" />
            <p className="text-isi text-tinta-70">Belum ada materi di kategori ini.</p>
          </div>
        ) : null}

        <div className="mt-8">
          <Eyebrow>Sumber</Eyebrow>
          <p className="mt-2 text-kecil text-tinta-55">
            Seluruh materi disusun dari publikasi resmi Bank Indonesia. Sumber tiap materi
            dicantumkan di halamannya masing-masing.
          </p>
        </div>
      </Halaman>
    </AppShell>
  );
}
