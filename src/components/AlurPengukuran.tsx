"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Penunjuk alur pengukuran.
 *
 * Rangkaian persetujuan → cek awal → belajar → cek akhir → penilaian → hasil
 * memakan waktu, dan orang berhak tahu sedang di mana serta tinggal berapa
 * langkah lagi. Tanpa ini, alurnya terasa seperti formulir tak berujung —
 * dan orang berhenti di tengah, yang berarti data penelitian tidak lengkap.
 *
 * Di ponsel hanya langkah aktif yang bertuliskan penuh; sisanya jadi titik.
 * Ruang layar kecil lebih baik dipakai untuk isinya.
 */

export type Langkah = "persetujuan" | "awal" | "belajar" | "akhir" | "penilaian" | "hasil";

const URUTAN: { id: Langkah; label: string; href?: string }[] = [
  { id: "persetujuan", label: "Persetujuan" },
  { id: "awal", label: "Cek awal" },
  { id: "belajar", label: "Belajar", href: "/materi" },
  { id: "akhir", label: "Cek akhir" },
  { id: "penilaian", label: "Penilaian" },
  { id: "hasil", label: "Hasil" },
];

export default function AlurPengukuran({ kini }: { kini: Langkah }) {
  const hemat = useReducedMotion();
  const indeksKini = URUTAN.findIndex((l) => l.id === kini);

  return (
    <nav aria-label="Tahap pengukuran" className="mb-6">
      <ol className="flex items-center gap-1.5 sm:gap-2">
        {URUTAN.map((l, i) => {
          const lewat = i < indeksKini;
          const aktif = i === indeksKini;

          const isi = (
            <span
              className={`relative flex items-center gap-2 rounded-full px-2.5 py-1.5 transition-colors sm:px-3 ${
                aktif
                  ? "text-white"
                  : lewat
                    ? "text-peduli"
                    : "text-tinta-55"
              }`}
            >
              {aktif ? (
                <motion.span
                  className="absolute inset-0 rounded-full bg-adukan"
                  layoutId="penanda-alur"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              ) : null}

              <span className="relative z-10 flex items-center gap-1.5">
                {lewat ? (
                  <Check className="size-3.5" aria-hidden />
                ) : (
                  <span
                    aria-hidden
                    className={`size-1.5 rounded-full ${aktif ? "bg-white" : "bg-current opacity-50"}`}
                  />
                )}
                <span className={aktif ? "text-xs font-bold" : "hidden text-xs font-bold sm:inline"}>
                  {l.label}
                </span>
              </span>
            </span>
          );

          return (
            <li className="flex items-center gap-1.5 sm:gap-2" key={l.id}>
              {lewat && l.href ? (
                <Link href={l.href}>{isi}</Link>
              ) : (
                <span aria-current={aktif ? "step" : undefined}>{isi}</span>
              )}
              {i < URUTAN.length - 1 ? (
                <motion.span
                  animate={{ scaleX: 1 }}
                  aria-hidden
                  className={`h-px w-2 origin-left sm:w-4 ${lewat ? "bg-peduli" : "bg-tinta/15"}`}
                  initial={hemat ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: hemat ? 0 : 0.3, delay: hemat ? 0 : i * 0.05 }}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
