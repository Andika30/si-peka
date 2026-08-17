"use client";

import { useState } from "react";
import { warnaIsi, warnaTeks } from "@/components/ui";
import type { Warna } from "@/lib/tipe";

/**
 * Blok kartu-flip di dalam isi materi. Beda dari kartu navigasi daftar
 * materi (yang balik lewat hover mouse): ini bisa jadi satu-satunya tempat
 * sebuah info muncul, jadi di layar sentuh — yang tidak punya hover buat
 * memicu balik otomatis — kartunya jadi tombol: ketuk buat balik, ketuk lagi
 * buat balik ke muka. Lihat `.kartu-flip--aktif` di globals.css.
 */
export default function KartuFlipKonten({
  teks,
  keterangan,
  warna,
}: {
  teks: string;
  keterangan?: string;
  warna: Warna;
}) {
  const [aktif, setAktif] = useState(false);

  return (
    <div
      aria-expanded={aktif}
      className={`kartu-flip kartu-flip--konten block ${aktif ? "kartu-flip--aktif" : ""}`}
      onClick={() => setAktif((a) => !a)}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        setAktif((a) => !a);
      }}
      role="button"
      tabIndex={0}
    >
      <div className="kartu-flip__dalam block">
        <div className="kartu-flip__muka flex min-h-32 flex-col justify-center gap-1.5 rounded-kartu border border-garis bg-white p-5 shadow-kartu">
          <span className={`hanya-hover font-mono text-data uppercase ${warnaTeks(warna)}`}>
            Arahkan kursor untuk detailnya
          </span>
          <span className={`hanya-sentuh font-mono text-data uppercase ${warnaTeks(warna)}`}>
            Ketuk untuk detailnya
          </span>
          <span className="text-subjudul text-tinta">{teks}</span>
        </div>
        <div
          className={`kartu-flip__belakang flex min-h-32 flex-col justify-center gap-1.5 rounded-kartu p-5 text-white shadow-angkat ${warnaIsi(warna)}`}
        >
          <span className="text-isi leading-relaxed">{keterangan}</span>
        </div>
      </div>
    </div>
  );
}
