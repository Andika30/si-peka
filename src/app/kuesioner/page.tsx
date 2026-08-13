"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import AlurPengukuran from "@/components/AlurPengukuran";
import Ilustrasi from "@/components/Ilustrasi";
import { Anak, Angka, Berurutan, Muncul } from "@/components/gerak";
import { BarProgres, Halaman, Kartu, Tombol } from "@/components/ui";
import { sus } from "@/lib/konten";
import { simpanSus } from "@/lib/skor";

const SKALA = [1, 2, 3, 4, 5];

export default function Kuesioner() {
  const router = useRouter();
  const [jawaban, setJawaban] = useState<Record<number, number>>({});

  const terisi = sus.filter((_, i) => typeof jawaban[i] === "number").length;
  const lengkap = terisi === sus.length;

  function pilih(butir: number, nilai: number) {
    setJawaban((j) => ({ ...j, [butir]: nilai }));
    simpanSus(butir, nilai);
  }

  return (
    <>
      {/* Kemajuan pengisian ditempel di atas: sepuluh pernyataan terasa panjang
          kalau tidak kelihatan tinggal berapa lagi. */}
      <header className="sticky top-0 z-40 border-b border-garis bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-kecil font-bold text-tinta">Penilaian aplikasi</p>
            <p className="font-mono text-data uppercase text-tinta-55">
              <Angka durasi={0.3} nilai={terisi} /> dari {sus.length} terisi
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1.5 text-kecil font-bold transition-colors ${
              lengkap ? "bg-peduli-lembut text-peduli" : "bg-kertas-tua text-tinta-55"
            }`}
          >
            {lengkap ? "Siap dikirim" : `${sus.length - terisi} lagi`}
          </span>
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-3 sm:px-6">
          <BarProgres nilai={(terisi / sus.length) * 100} warna={lengkap ? "peduli" : "adukan"} />
        </div>
      </header>

      <Halaman sempit>
        <AlurPengukuran kini="penilaian" />

        <Muncul className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Ilustrasi className="w-36 shrink-0 sm:w-40" nama="feedback" warna="ungu" />
          <div>
            <span className="font-mono text-data uppercase text-tinta-55">Langkah terakhir</span>
            <h1 className="mt-1 text-display text-tinta">Bagaimana rasanya memakai PeKA?</h1>
            <p className="mt-2 text-isi text-tinta-70">
              Tidak ada jawaban benar atau salah. Pilih angka yang paling menggambarkan
              pendapatmu — yang dinilai aplikasinya, bukan kamu.
            </p>
          </div>
        </Muncul>

        <div className="mb-4 flex justify-between font-mono text-data uppercase text-tinta-55">
          <span>1 &middot; Sangat tidak setuju</span>
          <span>5 &middot; Sangat setuju</span>
        </div>

        <Berurutan className="flex flex-col gap-3" jeda={0.04}>
          {sus.map((butir, i) => {
            const dijawab = typeof jawaban[i] === "number";
            return (
              <Anak key={butir.teks}>
                <fieldset
                  className={`rounded-kartu border bg-white p-5 transition-colors md:flex md:items-center md:gap-8 ${
                    dijawab ? "border-peduli/30" : "border-garis"
                  }`}
                >
                  <legend className="sr-only">Pernyataan {i + 1}</legend>
                  <p className="mb-4 flex items-start gap-2 text-isi text-tinta md:mb-0 md:flex-1">
                    <span
                      className={`mt-0.5 grid size-5 shrink-0 place-content-center rounded-md font-mono text-[10px] transition-colors ${
                        dijawab ? "bg-peduli text-white" : "bg-kertas-tua text-tinta-55"
                      }`}
                    >
                      {dijawab ? <Check className="size-3" aria-hidden /> : i + 1}
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
              </Anak>
            );
          })}
        </Berurutan>

        <Muncul className="mt-6">
          <Kartu className="mb-4" nada="adukan">
            <p className="text-kecil text-tinta-70">
              Sepuluh pernyataan ini adalah System Usability Scale, instrumen baku untuk mengukur
              kemudahan pemakaian. Urutan pernyataan positif dan negatif sengaja berselang-seling.
            </p>
          </Kartu>

          <Tombol
            className="w-full sm:w-auto"
            disabled={!lengkap}
            onClick={() => router.push("/hasil")}
          >
            {lengkap ? "Kirim dan lihat hasilku" : `Isi ${sus.length - terisi} pernyataan lagi`}
            {lengkap ? <ArrowRight className="size-4" aria-hidden /> : null}
          </Tombol>
        </Muncul>
      </Halaman>
    </>
  );
}
