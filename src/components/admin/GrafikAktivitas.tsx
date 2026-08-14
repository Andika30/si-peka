"use client";

import { useState } from "react";
import type { DeretHarian } from "@/lib/statistik";

/**
 * Aktivitas harian — tiga deret, satu sumbu.
 *
 * Ketiganya dihitung dengan satuan yang sama (banyaknya kejadian), jadi boleh
 * berbagi satu sumbu. Kalau nanti ada deret bersatuan lain — misalnya
 * persentase — ia TIDAK boleh ditempelkan di sini dengan sumbu kedua;
 * grafik bersumbu ganda membuat dua garis tampak berpotongan padahal tidak.
 *
 * Warnanya dipilih lewat pemeriksaan, bukan selera: ketiganya lolos jarak
 * buta warna dan kontras terhadap latar putih. Oranye sengaja lebih tua dari
 * oranye aplikasi (#d98a0b) yang kontrasnya hanya 2,69:1 di atas putih.
 */
const DERET = [
  { kunci: "materi" as const, label: "Materi dibuka", warna: "#1d6fe0" },
  { kunci: "kuis" as const, label: "Kuis selesai", warna: "#0f8a6a" },
  { kunci: "simulasi" as const, label: "Simulasi selesai", warna: "#b56b06" },
];

const L = 44;
const R = 78;
const A = 18;
const B = 34;
const W = 680;
const H = 260;

const tanggalPendek = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short" });

export default function GrafikAktivitas({ deret }: { deret: DeretHarian[] }) {
  const [sorot, setSorot] = useState<number | null>(null);

  if (deret.length === 0) return null;

  const tertinggi = Math.max(1, ...deret.flatMap((d) => [d.materi, d.kuis, d.simulasi]));
  // Dibulatkan ke atas supaya garis bantu jatuh di angka bulat, bukan 37,4.
  const atas = Math.max(4, Math.ceil(tertinggi / 4) * 4);

  const x = (i: number) =>
    deret.length === 1 ? L + (W - L - R) / 2 : L + (i * (W - L - R)) / (deret.length - 1);
  const y = (n: number) => A + (1 - n / atas) * (H - A - B);

  const garisBantu = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(atas * f));

  return (
    <div className="relative">
      <ul className="mb-3 flex flex-wrap gap-x-5 gap-y-1">
        {DERET.map((d) => (
          <li className="flex items-center gap-2" key={d.kunci}>
            <span
              aria-hidden
              className="size-2.5 shrink-0 rounded-full"
              style={{ background: d.warna }}
            />
            <span className="text-kecil text-tinta-70">{d.label}</span>
          </li>
        ))}
      </ul>

      <svg
        className="w-full"
        role="img"
        aria-label={`Aktivitas ${deret.length} hari terakhir`}
        viewBox={`0 0 ${W} ${H}`}
      >
        {/* Garis bantu dibuat samar: tugasnya membantu membaca nilai, bukan
            bersaing dengan datanya. */}
        {garisBantu.map((n) => (
          <g key={n}>
            <line
              stroke="rgb(11 27 51 / 0.08)"
              strokeWidth="1"
              x1={L}
              x2={W - R}
              y1={y(n)}
              y2={y(n)}
            />
            <text
              fill="#6b7688"
              fontSize="11"
              textAnchor="end"
              x={L - 10}
              y={y(n) + 4}
            >
              {n}
            </text>
          </g>
        ))}

        {deret.map((d, i) => (
          <text fill="#6b7688" fontSize="11" key={d.tanggal} textAnchor="middle" x={x(i)} y={H - 12}>
            {tanggalPendek(d.tanggal)}
          </text>
        ))}

        {sorot !== null ? (
          <line
            stroke="rgb(11 27 51 / 0.22)"
            strokeDasharray="3 3"
            strokeWidth="1"
            x1={x(sorot)}
            x2={x(sorot)}
            y1={A}
            y2={H - B}
          />
        ) : null}

        {DERET.map((s) => {
          const titik = deret.map((d, i) => `${x(i)},${y(d[s.kunci])}`).join(" ");
          const akhir = deret[deret.length - 1][s.kunci];
          return (
            <g key={s.kunci}>
              <polyline
                fill="none"
                points={titik}
                stroke={s.warna}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              {deret.map((d, i) => (
                <circle
                  cx={x(i)}
                  cy={y(d[s.kunci])}
                  fill="#fff"
                  key={d.tanggal}
                  r={sorot === i ? 5 : 4}
                  stroke={s.warna}
                  strokeWidth="2"
                />
              ))}
              {/* Label langsung di ujung kanan: identitas deret tidak
                  bergantung pada warna saja. */}
              <text
                fill={s.warna}
                fontSize="12"
                fontWeight="700"
                x={W - R + 10}
                y={y(akhir) + 4}
              >
                {akhir}
              </text>
            </g>
          );
        })}

        {/* Bidang tak terlihat untuk sasaran arahkan — jauh lebih besar
            daripada titiknya, supaya tidak perlu membidik tepat. */}
        {deret.map((d, i) => (
          <rect
            fill="transparent"
            height={H - A - B}
            key={d.tanggal}
            onMouseEnter={() => setSorot(i)}
            onMouseLeave={() => setSorot(null)}
            width={(W - L - R) / deret.length}
            x={x(i) - (W - L - R) / deret.length / 2}
            y={A}
          />
        ))}
      </svg>

      {sorot !== null ? (
        <div
          className="pointer-events-none absolute top-10 z-10 min-w-40 rounded-dalam border border-garis bg-white p-3 shadow-angkat"
          style={{
            left: `${(x(sorot) / W) * 100}%`,
            transform: sorot > deret.length / 2 ? "translateX(-108%)" : "translateX(8%)",
          }}
        >
          <p className="mb-2 font-mono text-data uppercase text-tinta-55">
            {tanggalPendek(deret[sorot].tanggal)}
          </p>
          {DERET.map((s) => (
            <p className="flex items-center gap-2 text-kecil text-tinta" key={s.kunci}>
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-full"
                style={{ background: s.warna }}
              />
              <span className="flex-1">{s.label}</span>
              <span className="font-bold">{deret[sorot][s.kunci]}</span>
            </p>
          ))}
        </div>
      ) : null}

      {/* Tampilan tabel: grafik ini punya peringatan kontras yang dilunasi
          dengan label langsung, dan pembaca layar tetap butuh angkanya. */}
      <details className="mt-4">
        <summary className="cursor-pointer text-kecil font-bold text-tinta-55 hover:text-institusi">
          Lihat sebagai tabel
        </summary>
        <table className="mt-3 w-full text-kecil">
          <thead>
            <tr className="border-b border-garis text-left text-tinta-55">
              <th className="py-2 font-mono text-data uppercase">Tanggal</th>
              {DERET.map((s) => (
                <th className="py-2 text-right font-mono text-data uppercase" key={s.kunci}>
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deret.map((d) => (
              <tr className="border-b border-garis last:border-b-0" key={d.tanggal}>
                <td className="py-2 text-tinta-70">{tanggalPendek(d.tanggal)}</td>
                {DERET.map((s) => (
                  <td className="py-2 text-right font-bold text-tinta" key={s.kunci}>
                    {d[s.kunci]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
