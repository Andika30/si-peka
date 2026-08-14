"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Gamepad2 } from "lucide-react";
import AppShell from "@/components/AppShell";
import Ilustrasi from "@/components/Ilustrasi";
import { Anak, Berurutan, Sentuh } from "@/components/gerak";
import { Chip, Halaman, Judul, Kartu, Tombol } from "@/components/ui";
import type { Skenario } from "@/lib/tipe";
import { langgan, snapshot, snapshotServer } from "@/lib/skor";

export default function LayarSimulasi({ skenario }: { skenario: Skenario[] }) {
  const sesi = useSyncExternalStore(langgan, snapshot, snapshotServer);
  const berikut = skenario.findIndex((_, i) => !sesi.simulasi.includes(i + 1));
  const lanjutKe = berikut === -1 ? 1 : berikut + 1;

  return (
    <AppShell>
      <Halaman>
        <Judul sub="Hadapi situasi yang benar-benar terjadi. Pilihan yang keliru tidak langsung divonis — kamu akan melihat akibatnya lebih dulu.">
          Simulasi Kenali
        </Judul>

        <Kartu aksen="kenali" className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Ilustrasi className="hidden w-32 shrink-0 sm:block" nama="simulasi" warna="kenali" />
          <span className="sm:hidden">
            <Chip Ikon={Gamepad2} besar warna="kenali" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-subjudul text-tinta">
              {sesi.simulasi.length} dari {skenario.length} skenario selesai
            </p>
            <p className="mt-0.5 text-kecil text-tinta-70">
              Setiap skenario memakan waktu kurang dari satu menit.
            </p>
          </div>
          <Tombol className="shrink-0" href={`/simulasi/${lanjutKe}`}>
            {sesi.simulasi.length === 0 ? "Mulai simulasi" : "Lanjutkan"}
          </Tombol>
        </Kartu>

        <Berurutan className="grid gap-3 lg:grid-cols-2">
          {skenario.map((s, i) => {
            const nomor = i + 1;
            const selesai = sesi.simulasi.includes(nomor);
            return (
              <Anak key={s.id}>
              <Sentuh>
              <Link
                className="flex h-full items-center gap-4 rounded-kartu border border-garis bg-white p-4 shadow-kartu"
                href={`/simulasi/${nomor}`}
              >
                <span className="grid size-11 shrink-0 place-content-center rounded-chip bg-kenali-lembut font-mono text-sm font-semibold text-kenali">
                  {String(nomor).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-kecil font-bold text-tinta">
                    {s.konteks[0]?.nilai ?? `Skenario ${nomor}`}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-kecil text-tinta-55">
                    {s.situasi}
                  </span>
                </span>
                {selesai ? (
                  <CheckCircle2 className="size-5 shrink-0 text-peduli" aria-hidden />
                ) : (
                  <ChevronRight className="size-5 shrink-0 text-tinta-55" aria-hidden />
                )}
              </Link>
              </Sentuh>
              </Anak>
            );
          })}
        </Berurutan>
      </Halaman>
    </AppShell>
  );
}
