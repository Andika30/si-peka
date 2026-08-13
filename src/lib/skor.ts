/**
 * Progres, skor, poin, dan lencana.
 *
 * Semua di perangkat pengguna (localStorage). Tidak ada nama, nomor telepon,
 * atau data transaksi yang disimpan — hanya ID sesi acak, skor, dan progres.
 * Ini konsekuensi langsung dari batasan proyek: aplikasi tidak menerima
 * laporan dan tidak menyimpan data aduan.
 */
import {
  checklist,
  kasus,
  lencana,
  modul,
  nilaiPoin,
  skenario,
  soal,
  sus,
  type Dimensi,
  type Lencana,
} from "./konten";

const KUNCI = "peka.sesi.v2";

export type Fase = "awal" | "akhir";

export type HasilModul = {
  /** Persentase benar pada kuis modul. */
  skor: number;
  benar: number;
  total: number;
  tanggal: string;
};

export type Sesi = {
  id: string;
  mulai: string;
  setuju: boolean;
  nama: string;
  /** Materi modul yang sudah dibuka sampai habis. */
  materiSelesai: string[];
  /** Hasil kuis per modul. */
  kuis: Record<string, HasilModul>;
  /** Nomor skenario simulasi yang sudah dituntaskan. */
  simulasi: number[];
  /** Jenis kasus Adukan yang sudah ditelusuri sampai halaman hasil. */
  kasusDilihat: string[];
  checklist: string[];
  jawaban: Partial<Record<Fase, Record<string, number>>>;
  sus?: Record<number, number>;
};

const kosong = (): Sesi => ({
  id: (globalThis.crypto?.randomUUID?.() ?? String(Date.now())).slice(0, 8).toUpperCase(),
  mulai: new Date().toISOString(),
  setuju: false,
  nama: "Peserta PeKA",
  materiSelesai: [],
  kuis: {},
  simulasi: [],
  kasusDilihat: [],
  checklist: [],
  jawaban: {},
});

export function baca(): Sesi {
  if (typeof window === "undefined") return kosong();
  try {
    const mentah = window.localStorage.getItem(KUNCI);
    if (!mentah) return kosong();
    // Gabung dengan bentuk kosong supaya sesi lama tanpa medan baru tetap jalan.
    return { ...kosong(), ...(JSON.parse(mentah) as Partial<Sesi>) } as Sesi;
  } catch {
    return kosong();
  }
}

export function tulis(ubah: (s: Sesi) => Sesi): Sesi {
  const berikutnya = ubah(baca());
  try {
    window.localStorage.setItem(KUNCI, JSON.stringify(berikutnya));
  } catch {
    /* mode privat menolak menulis — aplikasi tetap jalan, progres saja yang hilang */
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

/* ── Aksi ─────────────────────────────────────────────────────────────────── */

export const setujui = () => tulis((s) => ({ ...s, setuju: true }));

export const gantiNama = (nama: string) => tulis((s) => ({ ...s, nama: nama.trim() || s.nama }));

export const tandaiMateri = (id: string) =>
  tulis((s) =>
    s.materiSelesai.includes(id) ? s : { ...s, materiSelesai: [...s.materiSelesai, id] },
  );

export const simpanKuis = (idModul: string, benar: number, total: number) =>
  tulis((s) => ({
    ...s,
    kuis: {
      ...s.kuis,
      [idModul]: {
        benar,
        total,
        skor: Math.round((benar / total) * 100),
        tanggal: new Date().toISOString(),
      },
    },
  }));

export const tandaiSimulasi = (nomor: number) =>
  tulis((s) => (s.simulasi.includes(nomor) ? s : { ...s, simulasi: [...s.simulasi, nomor] }));

export const tandaiKasus = (id: string) =>
  tulis((s) =>
    s.kasusDilihat.includes(id) ? s : { ...s, kasusDilihat: [...s.kasusDilihat, id] },
  );

export const simpanChecklist = (dicentang: string[]) =>
  tulis((s) => ({ ...s, checklist: dicentang }));

export const simpanJawaban = (fase: Fase, idSoal: string, pilihan: number) =>
  tulis((s) => ({
    ...s,
    jawaban: { ...s.jawaban, [fase]: { ...(s.jawaban[fase] ?? {}), [idSoal]: pilihan } },
  }));

export const simpanSus = (nomor: number, nilai: number) =>
  tulis((s) => ({ ...s, sus: { ...(s.sus ?? {}), [nomor]: nilai } }));

export const hapusSesi = () => {
  try {
    window.localStorage.removeItem(KUNCI);
  } catch {
    /* diabaikan */
  }
  simpanan = null;
  pendengar.forEach((f) => f());
};

/* ── Turunan ──────────────────────────────────────────────────────────────── */

/** Progres satu modul: separuh dari membaca materi, separuh dari kuis. */
export function progresModul(sesi: Sesi, id: string): number {
  const materi = sesi.materiSelesai.includes(id) ? 50 : 0;
  const kuis = sesi.kuis[id] ? 50 : 0;
  return materi + kuis;
}

export const modulSelesai = (sesi: Sesi) =>
  modul.filter((m) => progresModul(sesi, m.id) === 100).length;

export function progresKeseluruhan(sesi: Sesi): number {
  const total = modul.reduce((j, m) => j + progresModul(sesi, m.id), 0);
  return Math.round(total / modul.length);
}

/** Modul pertama yang belum tuntas — dipakai kartu "Lanjutkan Materi". */
export const modulBerikutnya = (sesi: Sesi) =>
  modul.find((m) => progresModul(sesi, m.id) < 100) ?? modul[0];

export function rerataKuis(sesi: Sesi): number {
  const nilai = Object.values(sesi.kuis);
  if (nilai.length === 0) return 0;
  return Math.round(nilai.reduce((j, h) => j + h.skor, 0) / nilai.length);
}

export function totalPoin(sesi: Sesi): number {
  const dariModul = sesi.materiSelesai.length * nilaiPoin.modulSelesai;
  const dariKuis = Object.values(sesi.kuis).filter((h) => h.skor >= 60).length * nilaiPoin.kuisLulus;
  const dariSimulasi = sesi.simulasi.length * nilaiPoin.simulasiSelesai;
  const dariChecklist =
    sesi.checklist.length === checklist.length ? nilaiPoin.checklistPenuh : 0;
  return dariModul + dariKuis + dariSimulasi + dariChecklist;
}

export function lencanaDidapat(sesi: Sesi, l: Lencana): boolean {
  switch (l.jenis) {
    case "modul":
      return modulSelesai(sesi) >= l.ambang;
    case "simulasi":
      return sesi.simulasi.length >= l.ambang;
    case "skor":
      return rerataKuis(sesi) >= l.ambang;
    case "checklist":
      return sesi.checklist.length >= l.ambang;
    case "kasus":
      return sesi.kasusDilihat.length >= l.ambang;
  }
}

export const jumlahLencana = (sesi: Sesi) =>
  lencana.filter((l) => lencanaDidapat(sesi, l)).length;

export type ButirRiwayat = {
  jenis: "modul" | "simulasi" | "pengukuran";
  judul: string;
  ringkas: string;
  nilai: string;
  tanggal: string;
  warna: string;
};

/** Riwayat digabung dan diurutkan terbaru dulu. */
export function riwayat(sesi: Sesi): ButirRiwayat[] {
  const dariModul: ButirRiwayat[] = Object.entries(sesi.kuis).map(([id, h]) => {
    const m = modul.find((x) => x.id === id);
    return {
      jenis: "modul" as const,
      judul: m?.judul ?? id,
      ringkas: `Modul ${m?.nomor ?? "—"} · ${h.benar} dari ${h.total} benar`,
      nilai: `${h.skor}%`,
      tanggal: h.tanggal,
      warna: m?.warna ?? "adukan",
    };
  });

  const dariSimulasi: ButirRiwayat[] = sesi.simulasi.map((n) => ({
    jenis: "simulasi" as const,
    judul: `Skenario ${n} dari ${skenario.length}`,
    ringkas: "Simulasi Kenali",
    nilai: "Selesai",
    tanggal: sesi.mulai,
    warna: "kenali",
  }));

  const dariPengukuran: ButirRiwayat[] = (["awal", "akhir"] as Fase[])
    .filter((f) => Object.keys(sesi.jawaban[f] ?? {}).length > 0)
    .map((f) => {
      const s = skorDimensi(sesi, f);
      return {
        jenis: "pengukuran" as const,
        judul: f === "awal" ? "Cek Awal" : "Cek Akhir",
        ringkas: `Peduli ${s.peduli}% · Kenali ${s.kenali}% · Adukan ${s.adukan}%`,
        nilai: `${Math.round((s.peduli + s.kenali + s.adukan) / 3)}%`,
        tanggal: sesi.mulai,
        warna: "institusi",
      };
    });

  return [...dariModul, ...dariSimulasi, ...dariPengukuran].sort((a, b) =>
    b.tanggal.localeCompare(a.tanggal),
  );
}

/** Persentase benar per dimensi pada instrumen penelitian. */
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

/** Cek awal dan akhir hanya boleh sekali. Kalau bisa diulang, orang akan
    mengulangnya demi poin dan data N-Gain penelitian jadi tidak sahih. */
export const sudahMengerjakan = (sesi: Sesi, fase: Fase) =>
  Object.keys(sesi.jawaban[fase] ?? {}).length >= soal.length;

/**
 * N-Gain (Hake): (akhir − awal) / (100 − awal).
 * Mengukur berapa bagian dari ruang perbaikan yang berhasil ditutup — lebih
 * adil daripada selisih mentah, karena yang skor awalnya sudah tinggi punya
 * ruang perbaikan lebih sempit.
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
  (["peduli", "kenali", "adukan"] as Dimensi[]).reduce((a, b) => (skor[a] <= skor[b] ? a : b));

export const totalKasus = kasus.length;
