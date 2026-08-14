import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

/**
 * Penyimpanan kata sandi pengelola.
 *
 * Memakai scrypt bawaan Node, bukan pustaka luar. Scrypt memang dirancang
 * untuk kata sandi: ia sengaja lambat dan boros memori, jadi menebak jutaan
 * kemungkinan jadi mahal — berbeda dari SHA-256 yang cepat dan justru
 * memudahkan penebakan.
 *
 * Bentuk simpanannya: `scrypt$<garam heksa>$<turunan heksa>`. Garam berbeda
 * untuk tiap akun, supaya dua orang dengan kata sandi sama tetap menghasilkan
 * simpanan yang berbeda dan tabel pelangi tidak berguna.
 */

const turunkan = promisify(scrypt) as (
  sandi: string,
  garam: Buffer,
  panjang: number,
) => Promise<Buffer>;

const PANJANG = 64;

export async function hashSandi(sandi: string): Promise<string> {
  const garam = randomBytes(16);
  const turunan = await turunkan(sandi.normalize("NFKC"), garam, PANJANG);
  return `scrypt$${garam.toString("hex")}$${turunan.toString("hex")}`;
}

export async function cocokSandi(sandi: string, simpanan: string): Promise<boolean> {
  const [algoritma, garamHex, turunanHex] = simpanan.split("$");
  if (algoritma !== "scrypt" || !garamHex || !turunanHex) return false;

  const diharapkan = Buffer.from(turunanHex, "hex");
  if (diharapkan.length !== PANJANG) return false;

  const dihitung = await turunkan(sandi.normalize("NFKC"), Buffer.from(garamHex, "hex"), PANJANG);

  // timingSafeEqual, bukan ===. Perbandingan biasa berhenti di karakter
  // pertama yang berbeda, dan selisih waktunya bisa dipakai menebak isinya.
  return timingSafeEqual(dihitung, diharapkan);
}

/** Syarat minimum. Sengaja sederhana — aturan rumit justru bikin orang mencatat sandinya. */
export function periksaSandi(sandi: string): string | null {
  if (sandi.length < 10) return "Kata sandi minimal 10 karakter.";
  if (!/[a-zA-Z]/.test(sandi) || !/[0-9]/.test(sandi)) {
    return "Kata sandi harus memuat huruf dan angka.";
  }
  return null;
}
