"use server";

import { eq } from "drizzle-orm";
import { db, skema } from "@/db";
import { angka, centang, segarkanPublik, teks, wajibAdmin, type HasilAksi } from "@/lib/admin/jaga";

/**
 * Kanal resmi dan kategori materi.
 *
 * Berbeda dari materi dan kuis, isi di sini jarang bertambah tapi sering
 * diperbarui — nomor telepon berubah, tautan pindah. Karena itu tidak ada
 * layar "baru" yang terpisah: semua disunting langsung dari satu halaman.
 */

export async function simpanPenyelenggara(
  _sebelum: HasilAksi,
  form: FormData,
): Promise<HasilAksi> {
  await wajibAdmin();
  const id = teks(form, "id");
  if (!id) return { galat: "Penyelenggara tidak dikenali." };

  await db
    .update(skema.penyelenggara)
    .set({
      nama: teks(form, "nama"),
      jenis: teks(form, "jenis"),
      telepon: teks(form, "telepon"),
      aplikasi: teks(form, "aplikasi"),
      situs: teks(form, "situs"),
      diverifikasi: teks(form, "diverifikasi"),
      urutan: angka(form, "urutan"),
      aktif: centang(form, "aktif"),
    })
    .where(eq(skema.penyelenggara.id, id));

  segarkanPublik();
  return { pesan: `${teks(form, "nama")} tersimpan.` };
}

export async function simpanBankIndonesia(
  _sebelum: HasilAksi,
  form: FormData,
): Promise<HasilAksi> {
  await wajibAdmin();

  const nilai = {
    nama: teks(form, "nama"),
    telepon: teks(form, "telepon"),
    situs: teks(form, "situs"),
    situsLabel: teks(form, "situsLabel"),
    diverifikasi: teks(form, "diverifikasi"),
  };

  if (!nilai.nama || !nilai.telepon) return { galat: "Nama dan telepon harus diisi." };

  await db
    .update(skema.pengaturan)
    .set({ nilai: JSON.stringify(nilai) })
    .where(eq(skema.pengaturan.kunci, "bank_indonesia"));

  segarkanPublik();
  return { pesan: "Kanal Bank Indonesia tersimpan." };
}

export async function simpanKategori(_sebelum: HasilAksi, form: FormData): Promise<HasilAksi> {
  await wajibAdmin();
  const id = teks(form, "id");
  if (!id) return { galat: "Kategori tidak dikenali." };

  await db
    .update(skema.kategori)
    .set({
      nama: teks(form, "nama"),
      ringkas: teks(form, "ringkas"),
      urutan: angka(form, "urutan"),
      aktif: centang(form, "aktif"),
    })
    .where(eq(skema.kategori.id, id));

  segarkanPublik();
  return { pesan: `Kategori ${teks(form, "nama")} tersimpan.` };
}
