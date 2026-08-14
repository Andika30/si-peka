"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import AppShell from "@/components/AppShell";
import Ilustrasi from "@/components/Ilustrasi";
import { Anak, Angka, Berurutan, Muncul } from "@/components/gerak";
import { BarProgres, Halaman, Kartu, KotakStat, Tombol } from "@/components/ui";
import type { ButirSus } from "@/lib/tipe";
import { simpanSus, skorSus } from "@/lib/skor";

/**
 * Penilaian usability aplikasi (System Usability Scale).
 *
 * Sesuai blok konsep, ini mengukur KEMUDAHAN PEMAKAIAN APLIKASI — bukan
 * literasi penggunanya. Tidak ada pretest, posttest, maupun N-Gain di sini.
 */

const SKALA = [1, 2, 3, 4, 5];

export default function LayarKuesioner({ sus }: { sus: ButirSus[] }) {
  const [jawaban, setJawaban] = useState<Record<number, number>>({});
  const [terkirim, setTerkirim] = useState(false);

  const terisi = sus.filter((_, i) => typeof jawaban[i] === "number").length;
  const lengkap = terisi === sus.length;

  function pilih(butir: number, nilai: number) {
    setJawaban((j) => ({ ...j, [butir]: nilai }));
    simpanSus(butir, nilai);
  }

  return (
    <AppShell>
      {/* Halaman biasa di dalam dashboard, bukan layar terkunci. Ia dicapai
          dari Profil, jadi mengambil alih seluruh layar dengan tombol tutup
          akan terasa seperti keluar dari aplikasi. */}
      <Halaman sempit>
        <Link
          className="mb-4 inline-flex items-center gap-2 text-kecil font-bold text-tinta-55 hover:text-institusi"
          href="/profil"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Profil
        </Link>

        <Muncul className="mb-6 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Ilustrasi className="w-36 shrink-0 sm:w-40" nama="feedback" warna="ungu" />
          <div>
            <span className="font-mono text-data uppercase text-tinta-55">Penilaian aplikasi</span>
            <h1 className="mt-1 text-display text-tinta">Bagaimana rasanya memakai aplikasi ini?</h1>
            <p className="mt-2 text-isi text-tinta-70">
              Tidak ada jawaban benar atau salah. Pilih angka yang paling menggambarkan
              pendapatmu — yang dinilai aplikasinya, bukan kamu.
            </p>
          </div>
        </Muncul>

        {/* Kemajuan pengisian: sepuluh pernyataan terasa panjang kalau tidak
            kelihatan tinggal berapa lagi. */}
        <Kartu className="mb-6" nada={lengkap ? "peduli" : "ungu"}>
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="font-mono text-data uppercase text-tinta-55">
              <Angka durasi={0.3} nilai={terisi} /> dari {sus.length} terisi
            </p>
            <p className={`text-kecil font-bold ${lengkap ? "text-peduli" : "text-ungu"}`}>
              {lengkap ? "Siap disimpan" : `${sus.length - terisi} lagi`}
            </p>
          </div>
          <BarProgres nilai={(terisi / sus.length) * 100} warna={lengkap ? "peduli" : "ungu"} />
        </Kartu>

        <div className="mb-4 flex justify-between font-mono text-data uppercase text-tinta-55">
          <span>1 &middot; Sangat tidak setuju</span>
          <span>5 &middot; Sangat setuju</span>
        </div>

        <Berurutan className="flex flex-col gap-3">
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

          {terkirim ? (
            <Kartu aksen="peduli">
              <h2 className="text-subjudul text-tinta">Terima kasih, penilaianmu tersimpan</h2>
              <p className="mt-1 text-kecil text-tinta-70">
                Skor SUS bukan persentase. Rata-rata acuan Brooke adalah 68 — di atas itu berarti
                aplikasinya tergolong mudah dipakai.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 rounded-dalam bg-kertas p-2">
                <KotakStat label="Skor SUS aplikasi" nilai={skorSus(jawaban, sus) ?? 0} warna="ungu" />
                <KotakStat label="Rata-rata acuan" nilai={68} warna="institusi" />
              </div>
              <p className="mt-4 text-kecil text-tinta-55">
                Tersimpan di perangkat ini saja, tidak dikirim ke mana pun.
              </p>
            </Kartu>
          ) : (
            <Tombol className="w-full sm:w-auto" disabled={!lengkap} onClick={() => setTerkirim(true)}>
              {lengkap ? "Simpan penilaian" : `Isi ${sus.length - terisi} pernyataan lagi`}
            </Tombol>
          )}
        </Muncul>
      </Halaman>
    </AppShell>
  );
}
