"use client";

import { useSyncExternalStore } from "react";
import { ArrowRight, RotateCcw, ShieldCheck } from "lucide-react";
import AlurPengukuran from "@/components/AlurPengukuran";
import AppShell from "@/components/AppShell";
import { BarSkor, PekaMark } from "@/components/Hasil";
import Ilustrasi from "@/components/Ilustrasi";
import { Anak, Angka, Berurutan, Muncul, Rayakan } from "@/components/gerak";
import { Chip, Halaman, Kartu, Tombol, warnaTeks } from "@/components/ui";
import { DIMENSI, type Dimensi } from "@/lib/konten";
import {
  dimensiTerlemah,
  langgan,
  nGain,
  skorDimensi,
  skorSus,
  snapshot,
  snapshotServer,
  tafsirNGain,
} from "@/lib/skor";

const TINDAK_LANJUT: Record<Dimensi, { judul: string; isi: string; href: string }> = {
  peduli: {
    judul: "Perkuat Peduli",
    isi: "Ulangi apa saja yang perlu diperiksa sebelum menekan tombol bayar.",
    href: "/materi",
  },
  kenali: {
    judul: "Perkuat Kenali",
    isi: "Berlatih lagi mengenali tanda-tanda transaksi yang berisiko.",
    href: "/simulasi",
  },
  adukan: {
    judul: "Perkuat Adukan",
    isi: "Berlatih menentukan kanal resmi yang sesuai dengan jenis masalahmu.",
    href: "/adukan",
  },
};

export default function Hasil() {
  const sesi = useSyncExternalStore(langgan, snapshot, snapshotServer);

  const awal = skorDimensi(sesi, "awal");
  const akhir = skorDimensi(sesi, "akhir");
  const terlemah = dimensiTerlemah(akhir);
  const saran = TINDAK_LANJUT[terlemah];
  const sus = skorSus(sesi.sus);

  const rerataAwal = Math.round((awal.peduli + awal.kenali + awal.adukan) / 3);
  const rerataAkhir = Math.round((akhir.peduli + akhir.kenali + akhir.adukan) / 3);
  const gain = nGain(rerataAwal, rerataAkhir);
  const adaData = rerataAkhir > 0 || rerataAwal > 0;

  return (
    <AppShell>
      <Halaman>
        <AlurPengukuran kini="hasil" />

        {/* Tanda hasil jadi pusat halaman — tiga finder pattern yang terisi
            setinggi skor tiap dimensi. Ini satu-satunya perayaan di sini. */}
        <Muncul className="mb-10 text-center">
          <h1 className="mb-6 text-display text-tinta">Seberapa PeKA kamu?</h1>
          <Rayakan>
            <PekaMark skor={akhir} />
          </Rayakan>
          <p className="mt-6 font-mono text-data uppercase text-tinta-55">
            Sesi {sesi.id}
            {adaData ? ` · rata-rata ${rerataAkhir}%` : " · belum ada data"}
          </p>
        </Muncul>

        <div className="lg:grid lg:grid-cols-5 lg:items-start lg:gap-10">
          <section className="mb-8 lg:col-span-3">
            <h2 className="mb-4 text-subjudul text-tinta">Sebelum dan sesudah</h2>
            <Berurutan className="flex flex-col gap-4">
              {DIMENSI.map((d) => (
                <Anak key={d.id}>
                  <BarSkor akhir={akhir[d.id]} awal={awal[d.id]} dimensi={d.id} label={d.label} />
                </Anak>
              ))}
            </Berurutan>

            {/* Dua angka yang akan masuk BAB V laporan. */}
            <div className="mt-6 grid gap-3 border-t border-garis pt-5 sm:grid-cols-2">
              <div className="rounded-dalam bg-white p-4">
                <span className="block font-mono text-data uppercase text-tinta-55">N-Gain</span>
                <span className="text-judul text-tinta">
                  {gain === null ? "—" : gain.toFixed(2)}
                </span>
                <span className="mt-0.5 block text-kecil text-tinta-70">{tafsirNGain(gain)}</span>
              </div>
              <div className="rounded-dalam bg-white p-4">
                <span className="block font-mono text-data uppercase text-tinta-55">Skor SUS</span>
                <span className="text-judul text-tinta">
                  {sus === null ? "—" : <Angka nilai={sus} />}
                </span>
                <span className="mt-0.5 block text-kecil text-tinta-70">
                  {sus === null
                    ? "Belum diisi"
                    : sus >= 68
                      ? "Di atas rata-rata acuan (68)"
                      : "Di bawah rata-rata acuan (68)"}
                </span>
              </div>
            </div>
          </section>

          <section className="lg:col-span-2">
            <Kartu className="mb-4">
              <p className="text-isi text-tinta">
                {adaData && rerataAkhir > rerataAwal
                  ? `Pemahamanmu naik dari ${rerataAwal}% ke ${rerataAkhir}%. Yang masih perlu diperkuat: ${DIMENSI.find((d) => d.id === terlemah)!.label}.`
                  : "Selesaikan cek awal dan cek akhir untuk melihat perbandingan skormu di sini."}
              </p>
            </Kartu>

            {/* Rekomendasi selalu mengarah ke dimensi dengan skor terendah —
                supaya skor tidak berhenti sebagai angka. */}
            <Muncul>
              <div className={`mb-4 overflow-hidden rounded-kartu ${
                terlemah === "peduli" ? "bg-peduli" : terlemah === "kenali" ? "bg-kenali" : "bg-adukan"
              }`}>
                <div className="flex items-start gap-4 p-5">
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-data uppercase text-white/75">
                      Skor terendah
                    </span>
                    <h2 className="mt-1 text-judul text-white">{saran.judul}</h2>
                    <p className="mt-1 text-isi text-white/90">{saran.isi}</p>
                  </div>
                  <Ilustrasi
                    className="hidden w-24 shrink-0 opacity-90 sm:block"
                    nama={terlemah === "kenali" ? "simulasi" : terlemah === "adukan" ? "adukan" : "perisai"}
                    warna={terlemah}
                  />
                </div>
                <div className="px-5 pb-5">
                  <Tombol className="w-full" href={saran.href} jenis="putih">
                    Mulai belajar
                    <ArrowRight className="size-4" aria-hidden />
                  </Tombol>
                </div>
              </div>
            </Muncul>

            <Kartu className="mb-4">
              <div className="mb-3 flex items-center gap-3">
                <Chip Ikon={ShieldCheck} warna="peduli" />
                <p className="text-subjudul text-tinta">Bawa pulang satu hal</p>
              </div>
              <p className="text-isi text-tinta-70">
                Checklist Sebelum Bayar bisa kamu buka kapan saja di kasir — lima pemeriksaan yang
                mencegah sebagian besar masalah.
              </p>
              <Tombol className="mt-4 w-full" href="/checklist" jenis="garis">
                Buka Checklist Sebelum Bayar
              </Tombol>
            </Kartu>

            <Tombol className="w-full" href="/simulasi" jenis="teks">
              <RotateCcw className="size-4" aria-hidden />
              Ulangi simulasi
            </Tombol>
          </section>
        </div>

        <p className={`mt-10 text-center text-kecil ${warnaTeks("adukan")}`}>
          Terima kasih sudah menyelesaikan seluruh tahap.
        </p>
      </Halaman>
    </AppShell>
  );
}
