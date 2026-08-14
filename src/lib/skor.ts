/**
 * Progres belajar dan hasil kuis.
 *
 * Sesuai blok konsep penelitian, yang dicatat hanya apa yang dibutuhkan untuk
 * belajar dan berlatih. Beberapa hal sengaja TIDAK ada:
 *
 *  - Tidak ada poin, lencana, ranking, atau sertifikat.
 *  - Tidak ada pretest-posttest maupun N-Gain. Website ini media pendukung
 *    edukasi, bukan alat untuk membuktikan peningkatan literasi.
 *  - Tidak ada data pribadi. Semua tersimpan di peramban perangkat pengguna.
 *
 * Yang tersisa: progres materi, hasil kuis beserta rekomendasi materi, riwayat
 * simulasi, dan penilaian usability aplikasi.
 */
import type { ButirSus, RingkasKonten, Warna } from "./tipe";

/* Berkas ini hidup di peramban, jadi ia TIDAK boleh menyentuh basis data.
   Isi yang dibutuhkan — daftar materi, kuis, dan jumlah skenario — dikirim
   halaman server sebagai argumen. Itu sebabnya beberapa fungsi di bawah
   meminta `konten`, bukan mengimpornya sendiri. */

const KUNCI = "peka.sesi.v3";

export type HasilKuis = {
  skor: number;
  benar: number;
  total: number;
  /** ID soal yang dijawab keliru — dasar pembahasan dan rekomendasi materi. */
  keliru: number[];
  tanggal: string;
};

export type Sesi = {
  id: string;
  mulai: string;
  nama: string;
  /** Topik materi yang sudah dibaca sampai habis. */
  materiSelesai: string[];
  /** Hasil kuis per ID kuis. */
  kuis: Record<string, HasilKuis>;
  /** Nomor skenario simulasi yang sudah dituntaskan. */
  simulasi: number[];
  /** Penilaian usability aplikasi (System Usability Scale). */
  sus?: Record<number, number>;
};

/**
 * Sesi kosong harus DETERMINISTIK.
 *
 * Bentuk ini dipakai sebagai snapshot server, dan React memakai snapshot server
 * itu juga untuk render hidrasi pertama di klien. Kalau ID atau waktu mulainya
 * diacak di sini, server memancarkan satu nilai dan klien menghitung nilai
 * lain — persis penyebab peringatan hydration mismatch. ID dan waktu mulai
 * baru dibuat saat ada yang pertama kali disimpan, di `tulis()`.
 */
const kosong = (): Sesi => ({
  id: "",
  mulai: "",
  nama: "Pengguna",
  materiSelesai: [],
  kuis: {},
  simulasi: [],
});

const idBaru = () =>
  (globalThis.crypto?.randomUUID?.() ?? String(Date.now())).slice(0, 8).toUpperCase();

export function baca(): Sesi {
  if (typeof window === "undefined") return kosong();
  try {
    const mentah = window.localStorage.getItem(KUNCI);
    if (!mentah) return kosong();
    // Digabung dengan bentuk kosong supaya sesi lama tanpa medan baru tetap jalan.
    return { ...kosong(), ...(JSON.parse(mentah) as Partial<Sesi>) } as Sesi;
  } catch {
    return kosong();
  }
}

export function tulis(ubah: (s: Sesi) => Sesi): Sesi {
  const kini = baca();
  // Sesi baru diberi identitas di sini — saat ada yang benar-benar disimpan,
  // dan hanya di klien. Membuatnya lebih awal akan merusak hidrasi.
  const dasar = kini.id ? kini : { ...kini, id: idBaru(), mulai: new Date().toISOString() };
  const berikutnya = ubah(dasar);
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

export const gantiNama = (nama: string) => tulis((s) => ({ ...s, nama: nama.trim() || s.nama }));

export const tandaiMateri = (id: string) =>
  tulis((s) =>
    s.materiSelesai.includes(id) ? s : { ...s, materiSelesai: [...s.materiSelesai, id] },
  );

export const simpanKuis = (idKuis: string, benar: number, total: number, keliru: number[]) =>
  tulis((s) => ({
    ...s,
    kuis: {
      ...s.kuis,
      [idKuis]: {
        benar,
        total,
        keliru,
        skor: Math.round((benar / total) * 100),
        tanggal: new Date().toISOString(),
      },
    },
  }));

export const tandaiSimulasi = (nomor: number) =>
  tulis((s) => (s.simulasi.includes(nomor) ? s : { ...s, simulasi: [...s.simulasi, nomor] }));

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

export const sudahBaca = (sesi: Sesi, idTopik: string) => sesi.materiSelesai.includes(idTopik);

export const materiSelesai = (sesi: Sesi) => sesi.materiSelesai.length;

export const progresMateri = (sesi: Sesi, jumlahTopik: number) =>
  jumlahTopik === 0 ? 0 : Math.round((sesi.materiSelesai.length / jumlahTopik) * 100);

/** Topik pertama yang belum dibaca — dipakai kartu "Lanjutkan materi". */
export function topikBerikutnya<T extends { id: string }>(sesi: Sesi, topik: T[]): T | undefined {
  return topik.find((t) => !sesi.materiSelesai.includes(t.id)) ?? topik[0];
}

export function rerataKuis(sesi: Sesi): number {
  const nilai = Object.values(sesi.kuis);
  if (nilai.length === 0) return 0;
  return Math.round(nilai.reduce((j, h) => j + h.skor, 0) / nilai.length);
}

export const kuisDikerjakan = (sesi: Sesi) => Object.keys(sesi.kuis).length;

export type ButirRiwayat = {
  jenis: "materi" | "kuis" | "simulasi";
  judul: string;
  ringkas: string;
  nilai: string;
  tanggal: string;
  warna: Warna;
  href: string;
};

/** Riwayat digabung dan diurutkan terbaru dulu. */
export function riwayat(sesi: Sesi, konten: RingkasKonten): ButirRiwayat[] {
  const { topik, kuis, jumlahSkenario } = konten;

  const dariKuis: ButirRiwayat[] = Object.entries(sesi.kuis).map(([id, h]) => {
    const k = kuis.find((x) => x.id === id);
    const t = topik.find((x) => x.id === k?.materiTerkait);
    return {
      jenis: "kuis" as const,
      judul: k?.judul ?? id,
      ringkas: `${h.benar} dari ${h.total} benar`,
      nilai: `${h.skor}%`,
      tanggal: h.tanggal,
      warna: t?.warna ?? "adukan",
      href: `/kuis/${id}/hasil`,
    };
  });

  const dariMateri: ButirRiwayat[] = sesi.materiSelesai.map((id) => {
    const t = topik.find((x) => x.id === id);
    return {
      jenis: "materi" as const,
      judul: t?.judul ?? id,
      ringkas: t?.ringkas ?? "Materi selesai dibaca",
      nilai: "Selesai",
      tanggal: sesi.mulai,
      warna: t?.warna ?? "adukan",
      href: `/materi/${id}`,
    };
  });

  const dariSimulasi: ButirRiwayat[] = sesi.simulasi.map((n) => ({
    jenis: "simulasi" as const,
    judul: `Skenario ${n} dari ${jumlahSkenario}`,
    ringkas: "Simulasi transaksi",
    nilai: "Selesai",
    tanggal: sesi.mulai,
    warna: "kenali",
    href: `/simulasi/${n}`,
  }));

  return [...dariKuis, ...dariMateri, ...dariSimulasi].sort((a, b) =>
    b.tanggal.localeCompare(a.tanggal),
  );
}

/**
 * Skor SUS 0–100, dipakai untuk evaluasi usability — bukan untuk mengukur
 * literasi. Butir positif dikurangi 1, butir negatif dikurangi dari 5, lalu
 * totalnya dikali 2,5. Ini bukan persentase; 68 adalah rata-rata acuan.
 */
export function skorSus(
  jawaban: Record<number, number> | undefined,
  sus: ButirSus[],
): number | null {
  if (!jawaban) return null;
  const terisi = sus.map((_, i) => jawaban[i]).filter((v) => typeof v === "number");
  if (terisi.length < sus.length) return null;

  const total = sus.reduce((jml, butir, i) => {
    const nilai = jawaban[i];
    return jml + (butir.positif ? nilai - 1 : 5 - nilai);
  }, 0);

  return Math.round(total * 2.5);
}
