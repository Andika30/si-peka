import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as skema from "./skema";

/**
 * Koneksi ke MySQL.
 *
 * Berkas ini sengaja TIDAK memakai penanda `server-only`, sebab skrip seed
 * memakainya dari Node biasa — di luar Next — dan penanda itu akan menolaknya.
 * Penjaganya dipasang satu lapis di atas, di `lib/konten.ts`: itulah berkas
 * yang mungkin keliru diimpor komponen klien, dan di sanalah build harus
 * gagal daripada diam-diam mengirim kredensial ke peramban.
 *
 * Kolam koneksi disimpan di `globalThis` supaya hot reload saat pengembangan
 * tidak membuka kolam baru setiap kali berkas berubah — tanpa ini MySQL cepat
 * kehabisan sambungan setelah beberapa kali menyimpan.
 */

const wadah = globalThis as typeof globalThis & {
  kolamPeka?: mysql.Pool;
};

function buatKolam(): mysql.Pool {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL belum diisi. Salin .env.example jadi .env.local, " +
        "lalu sesuaikan dengan MySQL kamu.",
    );
  }

  return mysql.createPool({
    uri: url,
    connectionLimit: 10,
    // Materi memakai tanda kutip lengkung dan em dash; tanpa ini MySQL
    // menyimpannya sebagai tanda tanya.
    charset: "utf8mb4",
    timezone: "+07:00",
  });
}

export const kolam = (wadah.kolamPeka ??= buatKolam());

export const db = drizzle(kolam, { schema: skema, mode: "default" });

export { skema };
