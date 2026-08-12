"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Halaman, Tombol } from "@/components/dasar";
import { sus } from "@/lib/konten";
import { simpanSus } from "@/lib/skor";

const SKALA = [1, 2, 3, 4, 5];

export default function Kuesioner() {
  const router = useRouter();
  const [jawaban, setJawaban] = useState<Record<number, number>>({});

  const lengkap = sus.every((_, i) => typeof jawaban[i] === "number");

  function pilih(butir: number, nilai: number) {
    setJawaban((j) => ({ ...j, [butir]: nilai }));
    simpanSus(butir, nilai);
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-center bg-institusi px-5">
        <span className="text-judul tracking-tight text-white">PeKA</span>
      </header>

      <Halaman sempit>
        <span className="font-mono text-data uppercase text-tinta-55">
          Langkah terakhir &middot; {sus.length} pernyataan
        </span>
        <h1 className="mb-2 mt-2 text-display text-tinta">Bagaimana rasanya memakai PeKA?</h1>
        <p className="mb-6 text-isi text-tinta-70">
          Tidak ada jawaban benar atau salah. Pilih angka yang paling menggambarkan pendapatmu.
        </p>

        {/* Kunci skala ditempel supaya tetap terbaca sambil menggulir. */}
        <div className="sticky top-16 z-40 mb-4 border-b border-garis bg-kertas py-3">
          <div className="flex justify-between font-mono text-data uppercase text-tinta-55">
            <span>1 &middot; Sangat tidak setuju</span>
            <span>5 &middot; Sangat setuju</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {sus.map((butir, i) => (
            <fieldset
              className="rounded-kartu border border-garis bg-white p-5 md:flex md:items-center md:gap-8"
              key={butir.teks}
            >
              <legend className="sr-only">Pernyataan {i + 1}</legend>
              <p className="mb-4 text-isi text-tinta md:mb-0 md:flex-1">
                <span className="mr-2 font-mono text-data text-tinta-55">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {butir.teks}
              </p>
              <div className="likert flex justify-between md:shrink-0 md:justify-end md:gap-3">
                {SKALA.map((n) => (
                  <span key={n}>
                    <input
                      checked={jawaban[i] === n}
                      id={`q${i}-${n}`}
                      name={`q${i}`}
                      onChange={() => pilih(i, n)}
                      type="radio"
                    />
                    <label htmlFor={`q${i}-${n}`}>{n}</label>
                  </span>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="mt-6">
          <Tombol disabled={!lengkap} onClick={() => router.push("/hasil")}>
            {lengkap
              ? "Kirim dan lihat hasilku"
              : `Isi ${sus.length - Object.keys(jawaban).length} pernyataan lagi`}
          </Tombol>
        </div>
      </Halaman>
    </>
  );
}
