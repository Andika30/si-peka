"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Finder, Halaman, KartuPilihan, Tombol } from "@/components/dasar";
import { DIMENSI, soal, type Dimensi } from "@/lib/konten";
import { simpanJawaban, type Fase } from "@/lib/skor";

const LABEL: Record<Dimensi, string> = { peduli: "Peduli", kenali: "Kenali", adukan: "Adukan" };

export default function Kuis({ fase }: { fase: Fase }) {
  const router = useRouter();
  const [ke, setKe] = useState(0);
  const [dipilih, setDipilih] = useState<number | null>(null);

  const s = soal[ke];
  const terakhir = ke === soal.length - 1;
  const warnaDimensi = DIMENSI.find((d) => d.id === s.dimensi)!.warna;

  // Cek awal tidak pernah memperlihatkan pembahasan. Kalau diperlihatkan,
  // peserta belajar dari pretest dan kenaikan di posttest tidak lagi murni
  // berasal dari medianya.
  const bukaPembahasan = fase === "akhir" && dipilih !== null;

  function jawab(i: number) {
    setDipilih(i);
    simpanJawaban(fase, s.id, i);
    if (fase === "awal") lanjut(i);
  }

  function lanjut(_pilihan?: number) {
    void _pilihan;
    if (terakhir) {
      router.push(fase === "awal" ? "/belajar" : "/kuesioner");
      return;
    }
    setKe((n) => n + 1);
    setDipilih(null);
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-center bg-institusi px-5">
        <span className="text-judul tracking-tight text-white">PeKA</span>
      </header>

      <Halaman sempit>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex gap-1.5">
            {soal.map((_, i) => (
              <Finder
                key={i}
                status={i < ke ? "selesai" : i === ke ? "berjalan" : "kosong"}
                warna={i <= ke ? "adukan" : undefined}
              />
            ))}
          </div>
          <span className="shrink-0 font-mono text-data uppercase text-tinta-55">
            Soal {ke + 1} dari {soal.length}
          </span>
        </div>

        <div className="mb-6 flex items-center gap-2">
          <span aria-hidden className="size-2 rounded-full" style={{ background: warnaDimensi }} />
          <span className="font-mono text-data uppercase" style={{ color: warnaDimensi }}>
            {LABEL[s.dimensi]}
          </span>
        </div>

        {/* Soal awal dan akhir paralel: indikator sama, konteks berbeda.
            Itu yang menjaga N-Gain tetap sahih tanpa terasa mengulang. */}
        <h1 className="mb-6 text-judul text-tinta">{fase === "awal" ? s.awal : s.akhir}</h1>

        <div className="mb-6 flex flex-col gap-2">
          {s.opsi.map((o, i) => {
            const keadaan =
              dipilih === null || fase === "awal"
                ? "netral"
                : i === s.kunci
                  ? "benar"
                  : dipilih === i
                    ? "salah"
                    : "redup";
            return (
              <KartuPilihan
                disabled={dipilih !== null}
                keadaan={keadaan}
                key={o}
                onClick={() => jawab(i)}
              >
                <span className="text-isi text-tinta">{o}</span>
              </KartuPilihan>
            );
          })}
        </div>

        {bukaPembahasan ? (
          <div className="mb-6 rounded-kartu border border-garis border-l-4 border-l-peduli bg-white p-5 shadow-kartu">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="size-5 text-peduli" aria-hidden />
              <span className="font-mono text-data uppercase text-peduli">Pembahasan</span>
            </div>
            <p className="text-isi text-tinta">{s.pembahasan}</p>
          </div>
        ) : null}

        {fase === "akhir" && dipilih !== null ? (
          <Tombol onClick={() => lanjut()}>
            {terakhir ? "Lanjut ke penilaian aplikasi" : "Soal berikutnya"}
          </Tombol>
        ) : null}

        {fase === "awal" ? (
          <button
            className="w-full py-3 text-kecil text-tinta-70 underline underline-offset-4"
            onClick={() => lanjut()}
            type="button"
          >
            Lewati soal ini
          </button>
        ) : null}
      </Halaman>
    </>
  );
}
