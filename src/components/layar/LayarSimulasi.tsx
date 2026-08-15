"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Gamepad2 } from "lucide-react";
import AppShell from "@/components/AppShell";
import Ilustrasi from "@/components/Ilustrasi";
import { Anak, Berurutan, Sentuh } from "@/components/gerak";
import { Chip, Halaman, Judul, Kartu, Tombol } from "@/components/ui";
import SaringStatus, { type Status } from "@/components/SaringStatus";
import type { Skenario } from "@/lib/tipe";
import { langgan, snapshot, snapshotServer } from "@/lib/skor";

export default function LayarSimulasi({ skenario }: { skenario: Skenario[] }) {
  const sesi = useSyncExternalStore(langgan, snapshot, snapshotServer);
  const [status, setStatus] = useState<Status>("semua");

  const berikut = skenario.findIndex((_, i) => !sesi.simulasi.includes(i + 1));
  const lanjutKe = berikut === -1 ? 1 : berikut + 1;

  const bernomor = skenario.map((s, i) => ({
    s,
    nomor: i + 1,
    selesai: sesi.simulasi.includes(i + 1),
  }));

  const jumlah: Record<Status, number> = {
    semua: bernomor.length,
    belum: bernomor.filter((x) => !x.selesai).length,
    selesai: bernomor.filter((x) => x.selesai).length,
  };

  const tampil =
    status === "semua"
      ? bernomor
      : bernomor.filter((x) => x.selesai === (status === "selesai"));

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

        {/* Nomor skenario dilekatkan sebelum disaring — nomor itu dipakai di
            alamat halaman, jadi tidak boleh ikut berubah saat daftar dipersempit. */}
        <div className="mb-5">
          <SaringStatus
            jumlah={jumlah}
            label={{ belum: "Belum dicoba", selesai: "Sudah dicoba" }}
            nilai={status}
            penanda="pil-status-simulasi"
            ubah={setStatus}
          />
        </div>

        <Berurutan className="grid gap-3 lg:grid-cols-2" key={status}>
          {tampil.map(({ s, nomor, selesai }) => {
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

        {tampil.length === 0 ? (
          <div className="rounded-kartu border border-dashed border-garis p-10 text-center">
            <p className="text-isi text-tinta-70">
              {status === "selesai"
                ? "Belum ada skenario yang kamu coba."
                : "Semua skenario sudah kamu coba."}
            </p>
          </div>
        ) : null}
      </Halaman>
    </AppShell>
  );
}
