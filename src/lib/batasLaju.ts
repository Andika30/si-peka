import "server-only";

import { headers } from "next/headers";

/**
 * Pembatas laju per-IP untuk aksi publik tanpa autentikasi (mencatat
 * statistik, mengirim feedback). Tanpa ini, script bisa memanggil aksi itu
 * berkali-kali tanpa batas — membengkakkan tabel statistik atau mengotori
 * kotak masuk feedback.
 *
 * ponytail: hitungan di memori proses, sama seperti pembatas percobaan masuk
 * admin. Cukup untuk satu instansi; pindah ke Redis/tabel kalau nanti
 * dijalankan di beberapa proses. Ukurannya dibatasi kasar (lihat
 * `BATAS_PETA`) supaya IP/aksi acak tidak membuatnya tumbuh tanpa henti.
 */
const hitungan = new Map<string, { jumlah: number; sampai: number }>();
const BATAS_PETA = 5000;

async function alamatIp(): Promise<string> {
  const h = await headers();
  const maju = h.get("x-forwarded-for");
  return maju?.split(",")[0]?.trim() || h.get("x-real-ip") || "?";
}

/**
 * `true` kalau `aksi` ini sudah dipanggil lebih dari `batas` kali dalam
 * `jendelaMenit` terakhir dari IP yang sama.
 */
export async function terlaluSering(
  aksi: string,
  batas: number,
  jendelaMenit: number,
): Promise<boolean> {
  const kunci = `${aksi}:${await alamatIp()}`;
  const kini = Date.now();
  const c = hitungan.get(kunci);

  if (!c || kini > c.sampai) {
    // ponytail: reset kasar, bukan LRU — cukup untuk mencegah pertumbuhan
    // tanpa batas, bukan penjadwalan hapus yang presisi.
    if (hitungan.size >= BATAS_PETA) hitungan.clear();
    hitungan.set(kunci, { jumlah: 1, sampai: kini + jendelaMenit * 60_000 });
    return false;
  }

  c.jumlah += 1;
  return c.jumlah > batas;
}
