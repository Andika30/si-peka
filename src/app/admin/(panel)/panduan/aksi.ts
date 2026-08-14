"use server";

import { redirect } from "next/navigation";
import { eq, max } from "drizzle-orm";
import { db, skema } from "@/db";
import {
  angka,
  baris,
  centang,
  jadikanId,
  segarkanPublik,
  teks,
  wajibAdmin,
  type HasilAksi,
} from "@/lib/admin/jaga";
import { catatLog } from "@/lib/admin/log";

/**
 * Panduan pengaduan — bukan pengaduan.
 *
 * Yang dikelola di sini adalah JAWABAN yang ditampilkan ke peserta: langkah
 * apa yang perlu diambil dan ke siapa harus menghubungi. Tidak ada satu pun
 * aksi di berkas ini yang menerima atau menyimpan laporan dari masyarakat,
 * dan memang tidak boleh ada.
 */
export async function simpanMasalah(_sebelum: HasilAksi, form: FormData): Promise<HasilAksi> {
  const admin = await wajibAdmin();

  const idLama = teks(form, "idLama");
  const label = teks(form, "label");
  const judul = teks(form, "judul");
  const pembuka = teks(form, "pembuka");
  const pihak = teks(form, "pihak");
  const langkah = baris(form, "langkah");

  if (!label) return { galat: "Label masalah harus diisi." };
  if (!judul) return { galat: "Judul halaman hasil harus diisi." };
  if (!pembuka) return { galat: "Paragraf pembuka harus diisi." };
  if (langkah.length === 0) return { galat: "Isi minimal satu langkah." };
  if (!pihak) return { galat: "Pihak yang dihubungi harus diisi." };

  const eskalasiBI = centang(form, "eskalasiBI");
  const topikId = teks(form, "topikId") || null;

  const nilai = {
    label,
    ringkas: teks(form, "ringkas"),
    judul,
    pembuka,
    segera: teks(form, "segera") || null,
    peringatanUtama: teks(form, "peringatanUtama") || null,
    pihak,
    eskalasiBi: eskalasiBI,
    topikId,
    sumber: teks(form, "sumber") || "Bank Indonesia — Pelindungan Konsumen",
    urutan: angka(form, "urutan"),
    aktif: centang(form, "aktif"),
  };

  const id = idLama || jadikanId(label);
  if (!id) return { galat: "Label tidak bisa dijadikan alamat halaman." };

  if (!idLama) {
    const bentrok = await db.query.masalah.findFirst({ where: eq(skema.masalah.id, id) });
    if (bentrok) return { galat: `Sudah ada panduan dengan alamat "${id}".` };

    const [terakhir] = await db.select({ n: max(skema.masalah.urutan) }).from(skema.masalah);
    await db
      .insert(skema.masalah)
      .values({ ...nilai, id, urutan: nilai.urutan || (terakhir.n ?? 0) + 1 });
  } else {
    await db.update(skema.masalah).set(nilai).where(eq(skema.masalah.id, id));
  }

  await db.delete(skema.langkahMasalah).where(eq(skema.langkahMasalah.masalahId, id));
  await db
    .insert(skema.langkahMasalah)
    .values(langkah.map((teks, urutan) => ({ masalahId: id, urutan, teks })));

  await catatLog(admin, idLama ? "ubah" : "tambah", "panduan", label);

  segarkanPublik();
  if (!idLama) redirect(`/admin/panduan/${id}`);
  return { pesan: "Panduan tersimpan." };
}

export async function hapusMasalah(form: FormData): Promise<void> {
  const admin = await wajibAdmin();
  const id = teks(form, "id");
  await db.delete(skema.masalah).where(eq(skema.masalah.id, id));
  await catatLog(admin, "hapus", "panduan", id);
  segarkanPublik();
  redirect("/admin/panduan");
}
