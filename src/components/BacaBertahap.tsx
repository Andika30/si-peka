"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import IsiBlok from "@/components/IsiBlok";
import { Tukar } from "@/components/gerak";
import { BarProgres, warnaTeks } from "@/components/ui";
import type { BlokIsi, Warna } from "@/lib/tipe";

/**
 * Membaca materi per bagian.
 *
 * Bagian ditentukan blok bertipe `subjudul`: setiap subjudul memulai bagian
 * baru, dan blok sesudahnya jadi isinya. Bentuk ini dipilih daripada tabel
 * sub-materi tersendiri karena di sisi pengelola isinya tetap SATU daftar blok
 * yang bisa digeser bebas — subjudul cuma salah satu jenis blok, bukan lapisan
 * baru yang harus diurus terpisah.
 *
 * Materi tanpa subjudul sama sekali tampil utuh seperti biasa. Memecah materi
 * pendek jadi satu bagian bernomor "1 dari 1" hanya menambah tombol tanpa
 * menambah arti.
 */

export type Bagian = { judul: string; isi: BlokIsi[] };

export function pecahBagian(isi: BlokIsi[]): Bagian[] {
  const bagian: Bagian[] = [];

  for (const b of isi) {
    if (b.jenis === "subjudul") {
      bagian.push({ judul: b.teks, isi: [] });
      continue;
    }
    // Blok sebelum subjudul pertama jadi bagian pembuka tanpa judul.
    if (bagian.length === 0) bagian.push({ judul: "", isi: [] });
    bagian[bagian.length - 1].isi.push(b);
  }

  return bagian.filter((x) => x.isi.length > 0 || x.judul);
}

export default function BacaBertahap({
  isi,
  warna,
  selesai,
}: {
  isi: BlokIsi[];
  warna: Warna;
  /** Ditampilkan setelah bagian terakhir — tombol kuis, panduan, dan sumber. */
  selesai: React.ReactNode;
}) {
  const bagian = pecahBagian(isi);
  const [ke, setKe] = useState(0);

  if (bagian.length <= 1) {
    return (
      <>
        <div className="mb-6">
          <IsiBlok isi={isi} warna={warna} />
        </div>
        {selesai}
      </>
    );
  }

  const b = bagian[ke];
  const diUjung = ke === bagian.length - 1;

  return (
    <>
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between gap-4">
          <span className={`font-mono text-data uppercase ${warnaTeks(warna)}`}>
            Bagian {ke + 1} dari {bagian.length}
          </span>
          <span className="font-mono text-data uppercase text-tinta-55">
            {Math.round(((ke + 1) / bagian.length) * 100)}%
          </span>
        </div>
        <BarProgres nilai={((ke + 1) / bagian.length) * 100} warna={warna} />
      </div>

      {/* Daftar bagian dibiarkan terlihat semua supaya pembaca bisa melompat
          ke bagian yang dicarinya, bukan hanya maju-mundur satu per satu. */}
      <nav aria-label="Bagian materi" className="mb-6 flex flex-wrap gap-2">
        {bagian.map((x, i) => (
          <button
            aria-current={i === ke ? "step" : undefined}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-kecil transition-colors ${
              i === ke
                ? "border-transparent bg-institusi font-bold text-white"
                : i < ke
                  ? "border-garis bg-white text-tinta-70 hover:border-adukan"
                  : "border-garis bg-white text-tinta-55 hover:border-adukan"
            }`}
            key={i}
            onClick={() => setKe(i)}
            type="button"
          >
            {i < ke ? <Check className="size-3.5 shrink-0" aria-hidden /> : null}
            {x.judul || `Bagian ${i + 1}`}
          </button>
        ))}
      </nav>

      <Tukar arah="mendatar" kunci={ke}>
        <div className="mb-6">
          {b.judul ? <h2 className="mb-4 text-judul text-tinta">{b.judul}</h2> : null}
          <IsiBlok isi={b.isi} warna={warna} />
        </div>
      </Tukar>

      <div className="mb-8 flex items-center justify-between gap-3 border-t border-garis pt-5">
        <button
          className="flex h-11 items-center gap-2 rounded-tombol border border-garis bg-white px-4 text-kecil font-bold text-tinta transition-colors hover:bg-kertas disabled:opacity-40"
          disabled={ke === 0}
          onClick={() => setKe((n) => n - 1)}
          type="button"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Sebelumnya
        </button>

        {!diUjung ? (
          <button
            className="flex h-11 items-center gap-2 rounded-tombol bg-adukan px-5 text-sm font-bold text-white transition-colors hover:bg-adukan-tua"
            onClick={() => setKe((n) => n + 1)}
            type="button"
          >
            Bagian berikutnya
            <ArrowRight className="size-4" aria-hidden />
          </button>
        ) : (
          <span className="font-mono text-data uppercase text-peduli">Bagian terakhir</span>
        )}
      </div>

      {/* Tombol kuis dan panduan hanya muncul di bagian terakhir — kalau tampil
          sejak awal, pembaca akan mengerjakan kuis sebelum selesai membaca. */}
      {diUjung ? selesai : null}
    </>
  );
}
