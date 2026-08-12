"use client";

import { useSyncExternalStore } from "react";
import Nav from "@/components/Nav";
import { BarSkor, PekaMark } from "@/components/Hasil";
import { Halaman, Kartu, Tombol } from "@/components/dasar";
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
    judul: "Pelajari lagi materi Peduli",
    isi: "Kamu akan mengulang apa saja yang perlu diperiksa sebelum membayar.",
    href: "/belajar",
  },
  kenali: {
    judul: "Ulangi simulasi Kenali",
    isi: "Kamu akan berlatih mengenali tanda-tanda transaksi yang berisiko.",
    href: "/simulasi",
  },
  adukan: {
    judul: "Pelajari lagi materi Adukan",
    isi: "Kamu akan berlatih menentukan kanal resmi yang sesuai dengan jenis masalahmu.",
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

  return (
    <>
      <Nav />
      <Halaman>
        <h1 className="mb-6 text-center text-display text-tinta">Seberapa PeKA kamu?</h1>

        <PekaMark skor={akhir} />
        <p className="mb-10 mt-6 text-center font-mono text-data uppercase text-tinta-55">
          Skor akhir &middot; sesi {sesi.id}
        </p>

        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-12">
          <section className="mb-10">
            <h2 className="mb-4 text-subjudul">Sebelum dan sesudah</h2>
            <div className="flex flex-col gap-4">
              {DIMENSI.map((d) => (
                <BarSkor
                  akhir={akhir[d.id]}
                  awal={awal[d.id]}
                  dimensi={d.id}
                  key={d.id}
                  label={d.label}
                />
              ))}
            </div>

            {/* N-Gain (Hake): berapa bagian dari ruang perbaikan yang tertutup. */}
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-garis pt-4">
              <div>
                <span className="block font-mono text-data uppercase text-tinta-55">N-Gain</span>
                <span className="text-subjudul text-tinta">
                  {gain === null ? "—" : gain.toFixed(2)}{" "}
                  <span className="text-kecil font-normal text-tinta-70">{tafsirNGain(gain)}</span>
                </span>
              </div>
              <div>
                <span className="block font-mono text-data uppercase text-tinta-55">Skor SUS</span>
                <span className="text-subjudul text-tinta">
                  {sus ?? "—"}{" "}
                  <span className="text-kecil font-normal text-tinta-70">
                    {sus === null ? "belum diisi" : sus >= 68 ? "di atas rata-rata" : "di bawah rata-rata"}
                  </span>
                </span>
              </div>
            </div>
          </section>

          <section>
            <Kartu className="mb-4">
              <p className="text-isi text-tinta">
                {rerataAkhir > rerataAwal
                  ? `Pemahamanmu naik dari ${rerataAwal}% ke ${rerataAkhir}%. Yang masih perlu diperkuat: ${DIMENSI.find((d) => d.id === terlemah)!.label}.`
                  : "Selesaikan cek awal dan cek akhir untuk melihat perbandingan skormu."}
              </p>
            </Kartu>

            {/* Rekomendasi selalu mengarah ke dimensi dengan skor terendah —
                supaya skor tidak berhenti sebagai angka. */}
            <div
              className="mb-6 rounded-kartu p-5 text-white"
              style={{ background: `var(--color-${terlemah})` }}
            >
              <span className="font-mono text-data uppercase text-white/80">Skor terendah</span>
              <h2 className="mb-2 mt-2 text-judul">{saran.judul}</h2>
              <p className="mb-5 text-isi text-white/90">{saran.isi}</p>
              <Tombol
                className="!bg-white"
                href={saran.href}
              >
                <span style={{ color: `var(--color-${terlemah})` }}>Mulai belajar</span>
              </Tombol>
            </div>

            <div className="flex flex-col gap-2">
              <Tombol href="/simulasi" jenis="garis">
                Ulangi simulasi
              </Tombol>
              <Tombol href="/belajar/checklist" jenis="teks">
                Simpan checklist
              </Tombol>
            </div>
          </section>
        </div>
      </Halaman>
    </>
  );
}
