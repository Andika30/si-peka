"use client";

import { useSyncExternalStore } from "react";
import { Lock } from "lucide-react";
import AppShell from "@/components/AppShell";
import Ilustrasi from "@/components/Ilustrasi";
import { Anak, Angka, Berurutan, Muncul } from "@/components/gerak";
import { ambilIkon } from "@/components/ikon";
import { Chip, Halaman, Judul, Kartu, KotakStat } from "@/components/ui";
import { checklist, lencana, modul, skenario } from "@/lib/konten";
import {
  jumlahLencana,
  langgan,
  lencanaDidapat,
  modulSelesai,
  rerataKuis,
  snapshot,
  snapshotServer,
  totalPoin,
} from "@/lib/skor";

export default function Pencapaian() {
  const sesi = useSyncExternalStore(langgan, snapshot, snapshotServer);

  return (
    <AppShell>
      <Halaman>
        <Judul sub="Poin dan lencana hanya menghitung modul dan simulasi — cek awal dan cek akhir sengaja tidak berpoin.">
          Pencapaian
        </Judul>

        <Muncul className="mb-6 grid gap-4 lg:grid-cols-3">
          <div className="overflow-hidden rounded-kartu gradien-merek p-6 text-white lg:col-span-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-data uppercase text-white/70">Total poin</p>
                <p className="mt-1 text-5xl font-extrabold"><Angka durasi={1.1} nilai={totalPoin(sesi)} /></p>
              </div>
              <Ilustrasi className="w-24 shrink-0 opacity-90" nama="piala" warna="emas" />
            </div>
            <p className="mt-4 text-kecil text-white/75">
              {jumlahLencana(sesi)} dari {lencana.length} lencana terkumpul
            </p>
          </div>

          <Kartu className="lg:col-span-2">
            <h2 className="mb-4 text-subjudul text-tinta">Statistik</h2>
            <div className="grid grid-cols-2 gap-2 rounded-dalam bg-kertas p-2 sm:grid-cols-4">
              <KotakStat label={`dari ${modul.length} modul`} nilai={<Angka nilai={modulSelesai(sesi)} />} warna="adukan" />
              <KotakStat
                label={`dari ${skenario.length} simulasi`}
                nilai={<Angka nilai={sesi.simulasi.length} />}
                warna="peduli"
              />
              <KotakStat label="rerata kuis" nilai={<Angka akhiran="%" nilai={rerataKuis(sesi)} />} warna="kenali" />
              <KotakStat
                label={`dari ${checklist.length} checklist`}
                nilai={<Angka nilai={sesi.checklist.length} />}
                warna="ungu"
              />
            </div>
          </Kartu>
        </Muncul>

        <h2 className="mb-3 text-subjudul text-tinta">Lencana</h2>
        <Berurutan className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {lencana.map((l) => {
            const punya = lencanaDidapat(sesi, l);
            const Ikon = punya ? ambilIkon(l.ikon) : Lock;
            return (
              <Anak key={l.id}>
              <div
                className={`h-full rounded-kartu border p-4 text-center transition-colors ${
                  punya ? "border-garis bg-white shadow-kartu" : "border-dashed border-garis bg-transparent"
                }`}
              >
                <div className={`mx-auto mb-3 w-fit ${punya ? "" : "opacity-40 grayscale"}`}>
                  <Chip Ikon={Ikon} besar warna={l.warna} />
                </div>
                <p className={`text-kecil font-bold ${punya ? "text-tinta" : "text-tinta-55"}`}>
                  {l.nama}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-tinta-55">{l.syarat}</p>
              </div>
              </Anak>
            );
          })}
        </Berurutan>
      </Halaman>
    </AppShell>
  );
}
