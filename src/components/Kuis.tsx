"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import AlurPengukuran from "@/components/AlurPengukuran";
import { Getar, Muncul, Tukar } from "@/components/gerak";
import {
  BarProgres,
  Finder,
  Halaman,
  KartuPilihan,
  Tombol,
  warnaIsi,
  warnaTeks,
} from "@/components/ui";
import { soal, type Dimensi } from "@/lib/konten";
import { simpanJawaban, type Fase } from "@/lib/skor";

const LABEL: Record<Dimensi, string> = { peduli: "Peduli", kenali: "Kenali", adukan: "Adukan" };
const HURUF = ["A", "B", "C", "D", "E"];

export default function Kuis({ fase }: { fase: Fase }) {
  const router = useRouter();
  const [ke, setKe] = useState(0);
  const [dipilih, setDipilih] = useState<number | null>(null);

  const s = soal[ke];
  const terakhir = ke === soal.length - 1;
  const judulFase = fase === "awal" ? "Cek Awal" : "Cek Akhir";

  // Cek awal tidak pernah memperlihatkan pembahasan. Kalau diperlihatkan,
  // peserta belajar dari pretest dan kenaikan di posttest tidak lagi murni
  // berasal dari medianya.
  const bukaPembahasan = fase === "akhir" && dipilih !== null;

  function jawab(i: number) {
    setDipilih(i);
    simpanJawaban(fase, s.id, i);
    if (fase === "awal") lanjut();
  }

  function lanjut() {
    if (terakhir) {
      router.push(fase === "awal" ? "/materi" : "/kuesioner");
      return;
    }
    setKe((n) => n + 1);
    setDipilih(null);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-garis bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-kecil font-bold text-tinta">{judulFase}</p>
            <p className="font-mono text-data uppercase text-tinta-55">
              Soal {ke + 1} dari {soal.length}
            </p>
          </div>
          <Link
            aria-label="Keluar dari pengukuran"
            className="grid size-10 shrink-0 place-content-center rounded-tombol text-tinta-55 transition-colors hover:bg-kertas"
            href="/beranda"
          >
            <X className="size-5" aria-hidden />
          </Link>
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-3 sm:px-6">
          <BarProgres nilai={((ke + (dipilih === null ? 0 : 1)) / soal.length) * 100} />
        </div>
      </header>

      <Halaman sempit>
        <AlurPengukuran kini={fase} />

        {/* Penanda per soal memakai motif finder — sama seperti tanda hasil,
            supaya pengukuran terbaca sebagai satu rangkaian yang sama. */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {soal.map((_, i) => (
              <Finder
                key={i}
                status={i < ke ? "selesai" : i === ke ? "berjalan" : "kosong"}
                warna={i <= ke ? "adukan" : undefined}
              />
            ))}
          </div>
          <span className="flex items-center gap-2">
            <span aria-hidden className={`size-2 rounded-full ${warnaIsi(s.dimensi)}`} />
            <span className={`font-mono text-data uppercase ${warnaTeks(s.dimensi)}`}>
              {LABEL[s.dimensi]}
            </span>
          </span>
        </div>

        {/* Soal awal dan akhir paralel: indikator sama, konteks berbeda.
            Itu yang menjaga N-Gain tetap sahih tanpa terasa mengulang. */}
        <Tukar arah="mendatar" kunci={ke}>
          <h1 className="mb-6 text-judul text-tinta">{fase === "awal" ? s.awal : s.akhir}</h1>
        </Tukar>

        <div className="mb-6 flex flex-col gap-2.5">
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
              // Cek awal tidak pernah menandai benar/salah, jadi tidak pernah
              // bergetar juga — getaran akan membocorkan kuncinya.
              <Getar aktif={fase === "akhir" && dipilih === i && i !== s.kunci} key={o}>
                <KartuPilihan
                  disabled={dipilih !== null}
                  huruf={HURUF[i]}
                  keadaan={keadaan}
                  onClick={() => jawab(i)}
                >
                  <span className="text-isi text-tinta">{o}</span>
                </KartuPilihan>
              </Getar>
            );
          })}
        </div>

        {bukaPembahasan ? (
          <Muncul
            className="mb-6 rounded-kartu border border-garis border-l-4 border-l-peduli bg-white p-5 shadow-kartu"
            jarak={8}
          >
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="size-5 text-peduli" aria-hidden />
              <span className="font-mono text-data uppercase text-peduli">Pembahasan</span>
            </div>
            <p className="text-isi text-tinta">{s.pembahasan}</p>
          </Muncul>
        ) : null}

        {fase === "akhir" && dipilih !== null ? (
          <Tombol className="w-full sm:w-auto" onClick={lanjut}>
            {terakhir ? "Lanjut ke penilaian aplikasi" : "Soal berikutnya"}
            <ArrowRight className="size-4" aria-hidden />
          </Tombol>
        ) : null}

        {fase === "awal" ? (
          <div className="flex flex-col items-center gap-3">
            <button
              className="text-kecil text-tinta-55 underline underline-offset-4 transition-colors hover:text-tinta"
              onClick={lanjut}
              type="button"
            >
              Lewati soal ini
            </button>
            {/* Menjelaskan kenapa tidak ada umpan balik, supaya tidak terasa
                seperti aplikasi yang rusak. */}
            <p className="text-center text-kecil text-tinta-55">
              Jawaban benar sengaja belum diperlihatkan di cek awal — pembahasannya dibuka nanti
              di cek akhir.
            </p>
          </div>
        ) : null}
      </Halaman>
    </>
  );
}
