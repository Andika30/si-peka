/**
 * Penyimpanan jawaban dan penghitungan skor.
 *
 * Semua di perangkat pengguna (localStorage). Tidak ada nama, nomor telepon,
 * atau data transaksi yang disimpan — hanya ID sesi acak dan skor per dimensi.
 * Ini konsekuensi langsung dari batasan proyek: aplikasi tidak menerima
 * laporan dan tidak menyimpan data aduan.
 */
import { soal, sus, type Dimensi } from "./konten";

const KUNCI = "peka.sesi.v1";

export type Fase = "awal" | "akhir";

export type Sesi = {
  id: string;
  mulai: string;
  setuju: boolean;
  jawaban: Partial<Record<Fase, Record<string, number>>>;
  sus?: Record<number, number>;
  checklist?: string[];
};

const kosong = (): Sesi => ({
  id: (globalThis.crypto?.randomUUID?.() ?? String(Date.now())).slice(0, 8),
  mulai: new Date().toISOString(),
  setuju: false,
  jawaban: {},
});

export function baca(): Sesi {
  if (typeof window === "undefined") return kosong();
  try {
    const mentah = window.localStorage.getItem(KUNCI);
    return mentah ? (JSON.parse(mentah) as Sesi) : kosong();
  } catch {
    return kosong();
  }
}

export function tulis(ubah: (s: Sesi) => Sesi): Sesi {
  const berikutnya = ubah(baca());
  try {
    window.localStorage.setItem(KUNCI, JSON.stringify(berikutnya));
  } catch {
    /* mode privat menolak menulis — aplikasi tetap jalan, skor saja yang hilang */
  }
  simpanan = berikutnya;
  pendengar.forEach((f) => f());
  return berikutnya;
}

/* ── Jembatan ke React ─────────────────────────────────────────────────────
   localStorage adalah sistem di luar React, jadi cara membacanya adalah
   useSyncExternalStore — bukan setState di dalam effect. Snapshot harus
   stabil referensinya, kalau tidak React menganggapnya selalu berubah. */

let simpanan: Sesi | null = null;
const pendengar = new Set<() => void>();
const SESI_SERVER = kosong();

export function langgan(f: () => void): () => void {
  pendengar.add(f);
  return () => {
    pendengar.delete(f);
  };
}

export function snapshot(): Sesi {
  simpanan ??= baca();
  return simpanan;
}

/** Di server belum ada localStorage; React merender ini lalu menyegarkan
    dengan snapshot klien setelah hidrasi — tanpa peringatan mismatch. */
export const snapshotServer = (): Sesi => SESI_SERVER;

export const setujui = () => tulis((s) => ({ ...s, setuju: true }));

export const simpanJawaban = (fase: Fase, idSoal: string, pilihan: number) =>
  tulis((s) => ({
    ...s,
    jawaban: { ...s.jawaban, [fase]: { ...(s.jawaban[fase] ?? {}), [idSoal]: pilihan } },
  }));

export const simpanSus = (nomor: number, nilai: number) =>
  tulis((s) => ({ ...s, sus: { ...(s.sus ?? {}), [nomor]: nilai } }));

export const simpanChecklist = (dicentang: string[]) =>
  tulis((s) => ({ ...s, checklist: dicentang }));

export const hapusSesi = () => {
  try {
    window.localStorage.removeItem(KUNCI);
  } catch {
    /* diabaikan */
  }
  simpanan = null;
  pendengar.forEach((f) => f());
};

/** Persentase benar per dimensi. Dimensi tanpa jawaban bernilai 0. */
export function skorDimensi(sesi: Sesi, fase: Fase): Record<Dimensi, number> {
  const jawab = sesi.jawaban[fase] ?? {};
  const hasil = { peduli: 0, kenali: 0, adukan: 0 } as Record<Dimensi, number>;

  (["peduli", "kenali", "adukan"] as Dimensi[]).forEach((d) => {
    const butir = soal.filter((s) => s.dimensi === d);
    if (butir.length === 0) return;
    const benar = butir.filter((s) => jawab[s.id] === s.kunci).length;
    hasil[d] = Math.round((benar / butir.length) * 100);
  });

  return hasil;
}

/**
 * N-Gain (Hake): (akhir − awal) / (100 − awal).
 * Mengukur berapa bagian dari ruang perbaikan yang berhasil ditutup —
 * lebih adil daripada selisih mentah, karena yang skor awalnya sudah tinggi
 * punya ruang perbaikan lebih sempit.
 */
export function nGain(awal: number, akhir: number): number | null {
  if (awal >= 100) return null;
  return Number(((akhir - awal) / (100 - awal)).toFixed(2));
}

export function tafsirNGain(g: number | null): string {
  if (g === null) return "Skor awal sudah maksimal";
  if (g >= 0.7) return "Peningkatan tinggi";
  if (g >= 0.3) return "Peningkatan sedang";
  return "Peningkatan rendah";
}

/**
 * Skor SUS 0–100. Butir positif dikurangi 1, butir negatif dikurangi dari 5,
 * lalu totalnya dikali 2,5. Ini bukan persentase — 68 adalah rata-rata acuan.
 */
export function skorSus(jawaban: Record<number, number> | undefined): number | null {
  if (!jawaban) return null;
  const terisi = sus.map((_, i) => jawaban[i]).filter((v) => typeof v === "number");
  if (terisi.length < sus.length) return null;

  const total = sus.reduce((jml, butir, i) => {
    const nilai = jawaban[i];
    return jml + (butir.positif ? nilai - 1 : 5 - nilai);
  }, 0);

  return Math.round(total * 2.5);
}

export const dimensiTerlemah = (skor: Record<Dimensi, number>): Dimensi =>
  (["peduli", "kenali", "adukan"] as Dimensi[]).reduce((a, b) =>
    skor[a] <= skor[b] ? a : b,
  );
