"use client";

import { motion } from "@/components/gerak";

/**
 * Penyaring "sudah selesai / belum".
 *
 * Sengaja terpisah dari penyaring kategori, bukan digabung jadi satu deretan.
 * Keduanya pertanyaan yang berbeda — "topik apa" dan "sudah saya baca belum" —
 * dan menggabungkannya berarti memilih yang satu membatalkan yang lain.
 *
 * Jumlahnya ditulis di setiap pilihan supaya tidak perlu menekan dulu untuk
 * tahu isinya ada atau tidak.
 */

export type Status = "semua" | "belum" | "selesai";

export default function SaringStatus({
  nilai,
  ubah,
  jumlah,
  label = { belum: "Belum dibaca", selesai: "Sudah dibaca" },
  penanda,
}: {
  nilai: Status;
  ubah: (s: Status) => void;
  jumlah: Record<Status, number>;
  label?: { belum: string; selesai: string };
  /** Pembeda layoutId, supaya penanda geser di dua daftar tidak saling tarik. */
  penanda: string;
}) {
  const pilihan: { id: Status; teks: string }[] = [
    { id: "semua", teks: "Semua" },
    { id: "belum", teks: label.belum },
    { id: "selesai", teks: label.selesai },
  ];

  return (
    <div className="inline-flex flex-wrap rounded-tombol bg-kertas-tua p-1">
      {pilihan.map((p) => (
        <button
          className={`relative rounded-[0.625rem] px-3.5 py-2 text-kecil font-bold transition-colors ${
            nilai === p.id ? "text-institusi" : "text-tinta-55 hover:text-tinta"
          }`}
          key={p.id}
          onClick={() => ubah(p.id)}
          type="button"
        >
          {nilai === p.id ? (
            <motion.span
              className="absolute inset-0 rounded-[0.625rem] bg-white shadow-kartu"
              layoutId={penanda}
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
            />
          ) : null}
          <span className="relative z-10">
            {p.teks}
            <span
              className={`ml-1.5 font-mono text-data ${
                nilai === p.id ? "text-tinta-55" : "text-tinta-55/70"
              }`}
            >
              {jumlah[p.id]}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
