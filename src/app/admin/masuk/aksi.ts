"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, skema } from "@/db";
import { cocokSandi } from "@/lib/admin/sandi";
import { mulaiSesi } from "@/lib/admin/sesi";

export type HasilMasuk = { galat?: string };

/**
 * Pembatas percobaan masuk.
 *
 * ponytail: hitungan di memori proses. Hilang saat server dimuat ulang dan
 * tidak berlaku lintas proses — cukup untuk pemakaian satu instansi seperti
 * ini. Kalau nanti dijalankan di beberapa proses, pindahkan ke tabel atau
 * Redis dengan bentuk data yang sama.
 */
const percobaan = new Map<string, { jumlah: number; sampai: number }>();
const BATAS = 5;
const KUNCI_MENIT = 10;
// Dikunci per nama pengguna, dan nama penggunanya bebas dari pengirim
// formulir — tanpa batas ini, mengirim ribuan nama acak akan membuat Map ini
// tumbuh tanpa henti selama proses hidup.
const BATAS_PETA = 5000;

function terkunci(pengguna: string): number | null {
  const c = percobaan.get(pengguna);
  if (!c || c.jumlah < BATAS) return null;
  if (Date.now() > c.sampai) {
    percobaan.delete(pengguna);
    return null;
  }
  return Math.ceil((c.sampai - Date.now()) / 60000);
}

function catatGagal(pengguna: string): void {
  const c = percobaan.get(pengguna) ?? { jumlah: 0, sampai: 0 };
  c.jumlah += 1;
  c.sampai = Date.now() + KUNCI_MENIT * 60 * 1000;
  // ponytail: reset kasar, bukan LRU — cukup untuk mencegah pertumbuhan
  // tanpa batas dari nama pengguna acak.
  if (percobaan.size >= BATAS_PETA) percobaan.clear();
  percobaan.set(pengguna, c);
}

export async function masukAdmin(_sebelum: HasilMasuk, form: FormData): Promise<HasilMasuk> {
  const pengguna = String(form.get("pengguna") ?? "").trim();
  const sandi = String(form.get("sandi") ?? "");

  if (!pengguna || !sandi) return { galat: "Nama pengguna dan kata sandi harus diisi." };

  const sisa = terkunci(pengguna);
  if (sisa) {
    return { galat: `Terlalu banyak percobaan. Coba lagi dalam ${sisa} menit.` };
  }

  const baris = await db.query.admin.findFirst({
    where: eq(skema.admin.pengguna, pengguna),
  });

  // Pesan galatnya sengaja sama untuk pengguna tidak ada, akun nonaktif, dan
  // sandi keliru — supaya tidak bisa dipakai menebak nama pengguna mana yang
  // benar-benar terdaftar.
  const gagal = { galat: "Nama pengguna atau kata sandi tidak cocok." };

  if (!baris || !baris.aktif || !(await cocokSandi(sandi, baris.sandi))) {
    catatGagal(pengguna);
    return gagal;
  }

  percobaan.delete(pengguna);
  await db
    .update(skema.admin)
    .set({ terakhirMasuk: new Date().toISOString() })
    .where(eq(skema.admin.id, baris.id));

  await mulaiSesi(baris.id);
  redirect("/admin");
}
