import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db, skema } from "@/db";

/**
 * Sesi pengelola.
 *
 * Isinya cuma `id admin` dan `waktu kedaluwarsa`, ditandatangani HMAC dengan
 * rahasia dari lingkungan. Kuncinya ada pada tanda tangan itu: nilainya boleh
 * dibaca siapa saja, tapi tidak bisa dipalsukan tanpa rahasianya — jadi orang
 * tidak bisa mengganti id di kuki lalu menyamar jadi admin lain.
 *
 * Tidak memakai pustaka JWT karena tidak ada yang dibutuhkan darinya di sini:
 * satu penerbit, satu pembaca, tanpa klaim rumit.
 */

const NAMA_KUKI = "peka.admin";
const UMUR_JAM = 8;

function rahasia(): Buffer {
  const nilai = process.env.AUTH_SECRET;
  if (!nilai || nilai.length < 32) {
    throw new Error(
      "AUTH_SECRET belum diisi atau terlalu pendek (minimal 32 karakter). " +
        "Buat nilainya dengan: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    );
  }
  return Buffer.from(nilai, "utf8");
}

const tandaTangani = (isi: string) =>
  createHmac("sha256", rahasia()).update(isi).digest("base64url");

function bacaToken(token: string): number | null {
  const [idTeks, kedaluwarsaTeks, tanda] = token.split(".");
  if (!idTeks || !kedaluwarsaTeks || !tanda) return null;

  const diharapkan = tandaTangani(`${idTeks}.${kedaluwarsaTeks}`);
  const a = Buffer.from(tanda);
  const b = Buffer.from(diharapkan);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  const kedaluwarsa = Number(kedaluwarsaTeks);
  if (!Number.isFinite(kedaluwarsa) || Date.now() > kedaluwarsa) return null;

  const id = Number(idTeks);
  return Number.isInteger(id) ? id : null;
}

export async function mulaiSesi(idAdmin: number): Promise<void> {
  const kedaluwarsa = Date.now() + UMUR_JAM * 60 * 60 * 1000;
  const isi = `${idAdmin}.${kedaluwarsa}`;

  (await cookies()).set(NAMA_KUKI, `${isi}.${tandaTangani(isi)}`, {
    httpOnly: true, // tidak terbaca JavaScript — XSS tidak bisa mencurinya
    sameSite: "lax", // tidak ikut terkirim dari situs lain
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: UMUR_JAM * 60 * 60,
  });
}

export async function akhiriSesi(): Promise<void> {
  (await cookies()).delete(NAMA_KUKI);
}

export type AdminSaatIni = { id: number; nama: string; pengguna: string };

/**
 * Siapa yang sedang masuk, atau null. Selalu diperiksa ulang ke basis data —
 * akun yang dinonaktifkan harus langsung kehilangan akses, bukan menunggu
 * kukinya kedaluwarsa.
 */
export async function adminSaatIni(): Promise<AdminSaatIni | null> {
  const token = (await cookies()).get(NAMA_KUKI)?.value;
  if (!token) return null;

  const id = bacaToken(token);
  if (id === null) return null;

  const baris = await db.query.admin.findFirst({ where: eq(skema.admin.id, id) });
  if (!baris || !baris.aktif) return null;

  return { id: baris.id, nama: baris.nama, pengguna: baris.pengguna };
}
