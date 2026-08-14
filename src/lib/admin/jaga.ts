import "server-only";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { adminSaatIni, type AdminSaatIni } from "./sesi";

/**
 * Penjaga akses.
 *
 * Tata letak `/admin` sudah memeriksa sesi, tapi itu TIDAK cukup: server
 * action bisa dipanggil langsung lewat permintaan HTTP tanpa pernah melewati
 * tata letak mana pun. Jadi setiap aksi yang mengubah data memanggil
 * `wajibAdmin()` sendiri. Ini bukan pengulangan yang mubazir — tata letak
 * menjaga tampilan, fungsi ini menjaga datanya.
 */
export async function wajibAdmin(): Promise<AdminSaatIni> {
  const admin = await adminSaatIni();
  if (!admin) redirect("/admin/masuk");
  return admin;
}

/**
 * Menyegarkan halaman publik setelah isi berubah.
 *
 * Memakai satu sapuan di akar, bukan daftar jalur satu per satu: satu materi
 * muncul di beranda, daftar materi, halaman materinya, halaman depan, dan
 * halaman tentang sekaligus. Mendaftar semuanya berarti ada yang terlupa.
 */
export function segarkanPublik(): void {
  revalidatePath("/", "layout");
}

export type HasilAksi = { galat?: string; pesan?: string };

/** Membaca satu medan teks dari form, sudah dirapikan. */
export const teks = (form: FormData, nama: string): string =>
  String(form.get(nama) ?? "").trim();

/** Medan angka; kosong atau bukan angka jadi nilai bawaan. */
export function angka(form: FormData, nama: string, bawaan = 0): number {
  const n = Number(form.get(nama));
  return Number.isFinite(n) ? n : bawaan;
}

/** Kotak centang: hadir berarti benar. */
export const centang = (form: FormData, nama: string): boolean => form.get(nama) != null;

/**
 * Beberapa baris teks dari satu textarea — dipakai untuk paragraf, poin, dan
 * langkah. Baris kosong dibuang supaya enter berlebih tidak jadi butir hampa.
 */
export const baris = (form: FormData, nama: string): string[] =>
  String(form.get(nama) ?? "")
    .split("\n")
    .map((b) => b.trim())
    .filter(Boolean);

/** ID dari judul: "Mengenal QRIS" jadi "mengenal-qris". */
export const jadikanId = (teks: string): string =>
  teks
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 64);
