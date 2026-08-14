"use client";

import { useState, useSyncExternalStore } from "react";
import { BookOpen, Gamepad2, ListChecks } from "lucide-react";
import AppShell from "@/components/AppShell";
import Ilustrasi from "@/components/Ilustrasi";
import { Anak, Berurutan, motion } from "@/components/gerak";
import { Chip, Halaman, Judul, warnaTeks } from "@/components/ui";
import type { LucideIcon } from "lucide-react";
import type { RingkasKonten, Warna } from "@/lib/tipe";
import { langgan, riwayat, snapshot, snapshotServer, type ButirRiwayat } from "@/lib/skor";

type Saring = "semua" | ButirRiwayat["jenis"];

const TAB: { id: Saring; label: string }[] = [
  { id: "semua", label: "Semua" },
  { id: "materi", label: "Materi" },
  { id: "kuis", label: "Kuis" },
  { id: "simulasi", label: "Simulasi" },
];

const IKON: Record<ButirRiwayat["jenis"], LucideIcon> = {
  materi: BookOpen,
  kuis: ListChecks,
  simulasi: Gamepad2,
};

const tanggalID = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

export default function LayarRiwayat({ konten }: { konten: RingkasKonten }) {
  const sesi = useSyncExternalStore(langgan, snapshot, snapshotServer);
  const [saring, setSaring] = useState<Saring>("semua");

  const semua = riwayat(sesi, konten);
  const tampil = saring === "semua" ? semua : semua.filter((b) => b.jenis === saring);

  return (
    <AppShell>
      <Halaman>
        <Judul sub="Catatan belajarmu tersimpan di perangkat ini, bukan di server kami.">
          Riwayat Belajar
        </Judul>

        <div className="mb-5 flex flex-wrap gap-1 rounded-tombol bg-kertas-tua p-1 sm:inline-flex">
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
                  layoutId="pil-riwayat"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              ) : null}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>

        {tampil.length === 0 ? (
          <div className="rounded-kartu border border-dashed border-garis p-12 text-center">
            <Ilustrasi className="mx-auto mb-2 w-48" nama="kosong" warna="adukan" />
            <p className="text-isi text-tinta-70">
              Belum ada aktivitas di kategori ini. Mulai dari materi mana pun untuk mengisi riwayat.
            </p>
          </div>
        ) : (
          <Berurutan className="grid gap-3 lg:grid-cols-2" key={saring}>
            {tampil.map((b, i) => {
              const Ikon = IKON[b.jenis];
              return (
                <Anak key={`${b.judul}-${i}`}>
                <div className="flex h-full items-center gap-4 rounded-kartu border border-garis bg-white p-4 shadow-kartu">
                  <Chip Ikon={Ikon} warna={b.warna as Warna} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-kecil font-bold text-tinta">{b.judul}</p>
                    <p className="truncate text-kecil text-tinta-55">{b.ringkas}</p>
                    <p className="mt-0.5 font-mono text-data uppercase text-tinta-55">
                      {tanggalID(b.tanggal)}
                    </p>
                  </div>
                  <span className={`shrink-0 text-subjudul ${warnaTeks(b.warna as Warna)}`}>
                    {b.nilai}
                  </span>
                </div>
                </Anak>
              );
            })}
          </Berurutan>
        )}
      </Halaman>
    </AppShell>
  );
}
