"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";
import AppShell from "@/components/AppShell";
import Ilustrasi from "@/components/Ilustrasi";
import { Anak, Berurutan, Sentuh, motion } from "@/components/gerak";
import { ambilIkon } from "@/components/ikon";
import { BarProgres, Chip, Halaman, Judul, warnaTeks } from "@/components/ui";
import { modul } from "@/lib/konten";
import { langgan, progresModul, snapshot, snapshotServer } from "@/lib/skor";

type Saring = "semua" | "selesai" | "belum";

const TAB: { id: Saring; label: string }[] = [
  { id: "semua", label: "Semua modul" },
  { id: "belum", label: "Belum selesai" },
  { id: "selesai", label: "Selesai" },
];

export default function DaftarMateri() {
  const sesi = useSyncExternalStore(langgan, snapshot, snapshotServer);
  const [saring, setSaring] = useState<Saring>("semua");

  const tampil = modul.filter((m) => {
    const p = progresModul(sesi, m.id);
    if (saring === "selesai") return p === 100;
    if (saring === "belum") return p < 100;
    return true;
  });

  return (
    <AppShell>
      <Halaman>
        <Judul sub={`${modul.length} modul, masing-masing dengan materi singkat dan kuis.`}>
          Materi &amp; Kuis
        </Judul>

        <div className="mb-5 inline-flex rounded-tombol bg-kertas-tua p-1">
          {TAB.map((t) => (
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
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Satu kolom di ponsel, dua di tablet, tiga di desktop lebar.
            Kartu muncul berurutan supaya mata terbawa dari modul 01 ke bawah. */}
        <Berurutan className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3" key={saring}>
          {tampil.map((m) => {
            const Ikon = ambilIkon(m.ikon);
            const p = progresModul(sesi, m.id);
            const hasil = sesi.kuis[m.id];
            return (
              <Anak key={m.id}>
              <Sentuh>
              <Link
                className="flex h-full items-start gap-4 rounded-kartu border border-garis bg-white p-4 shadow-kartu"
                href={`/materi/${m.id}`}
              >
                <span className="relative">
                  <Chip Ikon={Ikon} besar warna={m.warna} />
                  <span className="absolute -left-1 -top-1 grid size-6 place-content-center rounded-md bg-institusi font-mono text-[10px] font-semibold text-white">
                    {m.nomor}
                  </span>
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-kecil font-bold text-tinta">{m.judul}</span>
                    {p === 100 ? (
                      <CheckCircle2 className="size-5 shrink-0 text-peduli" aria-hidden />
                    ) : (
                      <ChevronRight className="size-5 shrink-0 text-tinta-55" aria-hidden />
                    )}
                  </span>
                  <span className="mt-0.5 block text-kecil text-tinta-55">{m.ringkas}</span>

                  <span className="mt-3 flex items-center gap-3">
                    <span className="flex-1">
                      <BarProgres nilai={p} warna={m.warna} />
                    </span>
                    <span className={`font-mono text-data ${warnaTeks(m.warna)}`}>{p}%</span>
                  </span>

                  {hasil ? (
                    <span className="mt-2 block font-mono text-data uppercase text-tinta-55">
                      Kuis {hasil.skor}% &middot; {hasil.benar}/{hasil.total} benar
                    </span>
                  ) : null}
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
            <p className="text-isi text-tinta-70">
              {saring === "selesai"
                ? "Belum ada modul yang selesai. Mulai dari modul 01."
                : "Semua modul sudah selesai. Lanjut ke simulasi."}
            </p>
          </div>
        ) : null}
      </Halaman>
    </AppShell>
  );
}
