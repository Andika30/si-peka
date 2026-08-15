import "server-only";

import { hapusGambar, simpanGambar } from "./gambar";

/**
 * Membaca isi berblok dari form — dipakai materi dan berita.
 *
 * Tiap blok dinamai `blok.<kunci>.*` dengan `urutan` sebagai medan tersendiri,
 * bukan mengandalkan urutan kunci. Dengan begitu menggeser blok di layar cukup
 * mengubah angka urutannya, tanpa menomori ulang seluruh medan.
 *
 * Blok gambar boleh datang dalam dua bentuk: berkas baru yang diunggah, atau
 * nama berkas lama yang dipertahankan. Keduanya berakhir sama — nama berkas
 * di kolom `teks`.
 */

export type JenisBlok = "subjudul" | "paragraf" | "poin" | "gambar";

export type BlokMasuk = {
  jenis: JenisBlok;
  teks: string;
  keterangan: string | null;
  urutan: number;
};

export async function bacaBlok(
  form: FormData,
): Promise<{ blok: BlokMasuk[]; galat?: string }> {
  const kunci = new Set<string>();
  for (const k of form.keys()) {
    const cocok = /^blok\.([^.]+)\./.exec(k);
    if (cocok) kunci.add(cocok[1]);
  }

  const blok: BlokMasuk[] = [];

  for (const k of kunci) {
    const jenis = String(form.get(`blok.${k}.jenis`) ?? "paragraf") as JenisBlok;
    const urutan = Number(form.get(`blok.${k}.urutan`) ?? 0);
    const keterangan = String(form.get(`blok.${k}.keterangan`) ?? "").trim() || null;

    if (jenis === "gambar") {
      const berkas = form.get(`blok.${k}.berkas`);
      const lama = String(form.get(`blok.${k}.lama`) ?? "").trim();

      if (berkas instanceof File && berkas.size > 0) {
        const hasil = await simpanGambar(berkas);
        if (hasil.galat) return { blok: [], galat: hasil.galat };
        // Berkas lama dibuang begitu penggantinya tersimpan.
        if (lama) await hapusGambar(lama);
        blok.push({ jenis, teks: hasil.nama!, keterangan, urutan });
      } else if (lama) {
        blok.push({ jenis, teks: lama, keterangan, urutan });
      }
      // Blok gambar tanpa berkas apa pun diabaikan — bukan galat, cuma baris
      // yang ditambahkan lalu tidak jadi diisi.
      continue;
    }

    const teks = String(form.get(`blok.${k}.teks`) ?? "").trim();
    if (teks) blok.push({ jenis, teks, keterangan: null, urutan });
  }

  return { blok: blok.sort((a, b) => a.urutan - b.urutan) };
}

/** Membuang berkas gambar yang tidak lagi dirujuk setelah penyimpanan. */
export async function bersihkanGambarYatim(
  lama: { jenis: string; teks: string }[],
  blokBaru: BlokMasuk[],
): Promise<void> {
  const dipakai = new Set(blokBaru.filter((b) => b.jenis === "gambar").map((b) => b.teks));
  for (const b of lama) {
    if (b.jenis === "gambar" && !dipakai.has(b.teks)) await hapusGambar(b.teks);
  }
}
