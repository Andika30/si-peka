import "server-only";

import { desc } from "drizzle-orm";
import { db, skema } from "@/db";

/**
 * Jejak perubahan isi.
 *
 * Berbeda dari statistik pemakaian yang sengaja anonim, di sini identitas
 * justru diperlukan: kalau materi berubah, harus jelas siapa yang mengubahnya.
 * Nama pengelola ikut disalin ke barisnya, jadi jejaknya tetap terbaca
 * walaupun akunnya kelak dihapus.
 */
export async function catatLog(
  admin: { id: number; nama: string },
  aksi: "tambah" | "ubah" | "hapus" | "masuk",
  jenis: string,
  sasaran: string,
): Promise<void> {
  try {
    await db.insert(skema.logAdmin).values({
      adminId: admin.id,
      namaAdmin: admin.nama,
      aksi,
      jenis,
      sasaran: sasaran.slice(0, 255),
      waktu: new Date().toISOString(),
    });
  } catch {
    // Gagal mencatat jejak tidak boleh membatalkan penyimpanan isinya.
  }
}

export const ambilLog = (batas = 50) =>
  db.query.logAdmin.findMany({ orderBy: [desc(skema.logAdmin.waktu)], limit: batas });
