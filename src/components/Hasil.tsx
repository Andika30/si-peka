import type { Dimensi } from "@/lib/konten";

const WARNA: Record<Dimensi, string> = {
  peduli: "var(--color-peduli)",
  kenali: "var(--color-kenali)",
  adukan: "var(--color-adukan)",
};

/**
 * Tiga finder pattern pada posisi aslinya di kode QR: kiri-atas, kanan-atas,
 * kiri-bawah. Sel keempat sengaja kosong, seperti kode QR sungguhan.
 * Tinggi isian mengikuti skor tiap dimensi.
 */
export function PekaMark({ skor }: { skor: Record<Dimensi, number> }) {
  const urutan: Dimensi[] = ["peduli", "kenali", "adukan"];

  return (
    <div aria-hidden className="peka-mark">
      {urutan.map((d, i) => (
        <div
          className="peka-mark__sel"
          key={d}
          style={{ ["--sel-warna" as string]: WARNA[d] }}
        >
          <div
            className="peka-mark__isi"
            style={{ ["--skor" as string]: `${skor[d]}%`, ["--tunda" as string]: `${i * 150}ms` }}
          />
          <div className="peka-mark__inti" />
        </div>
      ))}
      <div className="peka-mark__sel" data-kosong="true" />
    </div>
  );
}

export function BarSkor({
  label,
  awal,
  akhir,
  dimensi,
}: {
  label: string;
  awal: number;
  akhir: number;
  dimensi: Dimensi;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-isi font-bold text-tinta">{label}</span>
        <span className="font-mono text-data text-tinta-55">
          {awal}% <span style={{ color: WARNA[dimensi] }}>&rarr; {akhir}%</span>
        </span>
      </div>
      <div className="bar-skor">
        <div
          className="bar-skor__sesudah"
          style={{ width: `${akhir}%`, ["--bar-warna" as string]: WARNA[dimensi] }}
        />
        {/* Skor awal jadi garis penanda: kalau digambar sebagai bar kedua,
            skor akhir yang selalu lebih besar akan selalu menutupinya. */}
        <div className="bar-skor__sebelum" style={{ left: `${awal}%` }} />
      </div>
    </div>
  );
}
