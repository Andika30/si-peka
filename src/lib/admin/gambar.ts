import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Unggahan gambar materi dan simulasi.
 *
 * Berkas TIDAK ditaruh di `public/`. Dua alasan:
 *
 *  1. `public/` dibaca saat aplikasi dibangun; berkas yang muncul setelah itu
 *     tidak selalu ikut tersaji — saat pengembangan bahkan sering 404 sampai
 *     server dijalankan ulang.
 *  2. Menyajikannya lewat rute sendiri memberi kendali atas tipe konten dan
 *     header cache, dan memastikan nama berkas dari pengguna tidak pernah
 *     langsung jadi jalur di sistem berkas.
 *
 * Nama berkas dibuat ulang sepenuhnya (UUID + ekstensi hasil pemeriksaan),
 * jadi nama asli dari pengguna tidak dipakai sama sekali. Itu menutup jalur
 * "../../" sekaligus tabrakan nama.
 */

export const DIR_UNGGAHAN = path.join(process.cwd(), "unggahan");

const MAKS_BYTE = 2 * 1024 * 1024;

/**
 * Jenis berkas ditentukan dari ISI-nya, bukan dari ekstensi atau `type` yang
 * dikirim peramban — keduanya gampang dipalsukan. Ini memeriksa beberapa byte
 * pertama, tanda pengenal yang memang ada di dalam berkas gambar.
 */
function kenaliJenis(buf: Buffer): { ext: string; mime: string } | null {
  if (buf.length < 12) return null;

  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { ext: "jpg", mime: "image/jpeg" };
  }
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { ext: "png", mime: "image/png" };
  }
  if (buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP") {
    return { ext: "webp", mime: "image/webp" };
  }
  // GIF sengaja tidak diterima: nilainya kecil untuk materi, tapi menambah
  // satu format lagi yang harus dijaga.
  return null;
}

export const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

/** Hanya nama berbentuk `<uuid>.<ext>` yang boleh dibaca. */
export const namaSah = (nama: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/.test(nama);

export type HasilUnggah = { nama?: string; galat?: string };

export async function simpanGambar(berkas: File | null): Promise<HasilUnggah> {
  if (!berkas || berkas.size === 0) return {};

  if (berkas.size > MAKS_BYTE) {
    return { galat: `Ukuran gambar maksimal 2 MB (berkasmu ${Math.round(berkas.size / 1024)} KB).` };
  }

  const buf = Buffer.from(await berkas.arrayBuffer());
  const jenis = kenaliJenis(buf);
  if (!jenis) return { galat: "Format gambar harus JPG, PNG, atau WEBP." };

  await mkdir(DIR_UNGGAHAN, { recursive: true });
  const nama = `${randomUUID()}.${jenis.ext}`;
  await writeFile(path.join(DIR_UNGGAHAN, nama), buf);

  return { nama };
}

/** Membuang berkas yang sudah tidak dirujuk. Gagal menghapus diabaikan —
    berkas yatim jauh lebih ringan akibatnya daripada penyimpanan yang batal. */
export async function hapusGambar(nama: string | null | undefined): Promise<void> {
  if (!nama || !namaSah(nama)) return;
  try {
    await unlink(path.join(DIR_UNGGAHAN, nama));
  } catch {
    /* diabaikan */
  }
}

export const alamatGambar = (nama: string) => `/gambar/${nama}`;
