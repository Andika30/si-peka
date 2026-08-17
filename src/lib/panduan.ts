import type { Masalah, Penyelenggara } from "./tipe";

/**
 * Alur panduan pengaduan.
 *
 * Dulu semua masalah melewati tiga layar yang sama: pilih masalah, pilih
 * jenis layanan, pilih penyelenggara. Padahal dua layar terakhir tidak selalu
 * menentukan jawabannya — dan untuk kasus mendesak, menanyakan hal yang tidak
 * mengubah apa pun berarti menunda orang yang sedang panik.
 *
 * Sekarang tiap masalah membawa sendiri langkah apa yang dibutuhkannya,
 * dan pengelola yang menentukannya lewat panel admin.
 */

export type Langkah = { nomor: number; total: number };

/** Berapa layar pertanyaan yang dilewati sebuah masalah, di luar layar hasil. */
export const jumlahLangkah = (m: Pick<Masalah, "perluLayanan" | "perluPenyelenggara">) =>
  1 + (m.perluLayanan ? 1 : 0) + (m.perluPenyelenggara ? 1 : 0);

/** Ke mana kartu masalah menuju setelah diklik. */
export function langkahPertama(
  m: Pick<Masalah, "id" | "perluLayanan" | "perluPenyelenggara">,
): string {
  if (m.perluLayanan) return `/panduan/layanan?masalah=${m.id}`;
  if (m.perluPenyelenggara) return `/panduan/penyelenggara?masalah=${m.id}`;
  return `/panduan/hasil/${m.id}`;
}

/** Ke mana layar pilih-layanan menuju setelah jenis layanan dipilih. */
export function setelahLayanan(
  m: Pick<Masalah, "id" | "perluPenyelenggara">,
  idLayanan: string,
): string {
  return m.perluPenyelenggara
    ? `/panduan/penyelenggara?masalah=${m.id}&layanan=${idLayanan}`
    : `/panduan/hasil/${m.id}?layanan=${idLayanan}`;
}

/**
 * Penyelenggara yang menangani jenis layanan tertentu.
 *
 * Inilah yang membuat pertanyaan "kamu memakai layanan apa?" berguna:
 * jawabannya menyempitkan daftar. Kalau tidak ada satu pun yang cocok —
 * misalnya data keterkaitannya belum diisi — seluruh daftar dikembalikan
 * daripada memberi layar kosong yang membuat orang buntu.
 */
export function penyelenggaraUntuk(
  semua: Penyelenggara[],
  idLayanan: string | undefined,
): { daftar: Penyelenggara[]; disaring: boolean } {
  if (!idLayanan) return { daftar: semua, disaring: false };

  const cocok = semua.filter((p) => p.layanan.includes(idLayanan));
  return cocok.length > 0 ? { daftar: cocok, disaring: true } : { daftar: semua, disaring: false };
}
