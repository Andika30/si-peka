"use server";

import { asc, eq } from "drizzle-orm";
import { db, skema } from "@/db";
import { catat, catatHasilKuis, catatSimulasi } from "@/lib/statistik";

/**
 * Yang dikirim halaman peserta ke server.
 *
 * Perhatikan apa yang TIDAK ada di sini: tidak ada nama, tidak ada id
 * perangkat, tidak ada penanda sesi. Setiap panggilan berdiri sendiri dan
 * hanya menaikkan penghitung. Progres belajar tetap di peramban masing-masing
 * — yang dikirim ke sini cuma "ada satu orang membuka materi X", tanpa cara
 * mengetahui apakah itu orang yang sama dengan panggilan sebelumnya.
 */

export async function catatMateriDibuka(idTopik: string): Promise<void> {
  await catat("materi_dibuka", idTopik);
}

export async function catatPanduanDibuka(idMasalah: string): Promise<void> {
  await catat("panduan_dibuka", idMasalah);
}

/**
 * Hasil kuis dikirim sebagai NOMOR URUT soal yang keliru, bukan id barisnya —
 * klien memang tidak perlu tahu id di basis data. Pemetaannya dikerjakan di
 * sini, dan sekaligus jadi penjaga: nomor urut di luar jangkauan diabaikan.
 */
export async function catatKuisSelesai(
  idKuis: string,
  skor: number,
  urutanKeliru: number[],
): Promise<void> {
  const daftarSoal = await db.query.soal.findMany({
    where: eq(skema.soal.kuisId, idKuis),
    orderBy: [asc(skema.soal.urutan)],
    columns: { id: true },
  });
  if (daftarSoal.length === 0) return;

  const semuaId = daftarSoal.map((s) => s.id);
  const idKeliru = urutanKeliru
    .filter((i) => Number.isInteger(i) && i >= 0 && i < semuaId.length)
    .map((i) => semuaId[i]);

  const skorAman = Math.max(0, Math.min(100, Math.round(skor)));
  await catatHasilKuis(idKuis, skorAman, idKeliru, semuaId);
}

export async function catatSimulasiSelesai(idSkenario: string, aman: boolean): Promise<void> {
  await catatSimulasi(idSkenario, aman);
}

export type HasilKirimFeedback = { galat?: string; berhasil?: boolean };

const JENIS_SAH = ["materi", "kuis", "simulasi", "aplikasi", "adukan", "lainnya"];

export async function kirimFeedback(
  _sebelum: HasilKirimFeedback,
  form: FormData,
): Promise<HasilKirimFeedback> {
  const jenis = String(form.get("jenis") ?? "lainnya");
  const komentar = String(form.get("komentar") ?? "").trim();

  if (komentar.length < 5) return { galat: "Tulis masukanmu lebih dulu." };
  if (komentar.length > 500) return { galat: "Masukan maksimal 500 karakter." };

  await db.insert(skema.feedback).values({
    jenis: JENIS_SAH.includes(jenis) ? jenis : "lainnya",
    komentar,
    dibuat: new Date().toISOString(),
  });

  return { berhasil: true };
}
