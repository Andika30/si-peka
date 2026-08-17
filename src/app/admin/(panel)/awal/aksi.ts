"use server";

import { redirect } from "next/navigation";
import { asc, eq, max } from "drizzle-orm";
import { db, skema } from "@/db";
import {
  angka,
  centang,
  jadikanId,
  segarkanPublik,
  teks,
  wajibAdmin,
  type HasilAksi,
} from "@/lib/admin/jaga";
import { catatLog } from "@/lib/admin/log";

/**
 * Checklist yang tampil sebelum peserta memilih jenis masalah. Bentuknya
 * sengaja sama seperti kanal pengaduan — daftar, lalu satu halaman per butir
 * — supaya admin bisa menambah dan menghapus, bukan cuma menyunting yang ada.
 */
export async function simpanInfoAwal(
  _sebelum: HasilAksi,
  form: FormData,
): Promise<HasilAksi> {
  const admin = await wajibAdmin();

  const idLama = teks(form, "idLama");
  const judul = teks(form, "judul");
  if (!judul) return { galat: "Judul harus diisi." };

  const nilai = {
    judul,
    keterangan: teks(form, "keterangan") || null,
    urutan: angka(form, "urutan"),
    aktif: centang(form, "aktif"),
  };

  if (idLama) {
    await db.update(skema.infoAwal).set(nilai).where(eq(skema.infoAwal.id, idLama));
    await catatLog(admin, "ubah", "info-awal", judul);
    segarkanPublik();
    return { pesan: `${judul} tersimpan.` };
  }

  const id = jadikanId(judul);
  if (!id) return { galat: "Judul tidak bisa dijadikan pengenal. Pakai huruf atau angka." };

  const bentrok = await db.query.infoAwal.findFirst({ where: eq(skema.infoAwal.id, id) });
  if (bentrok) return { galat: `Sudah ada info dengan pengenal "${id}".` };

  const [terakhir] = await db.select({ n: max(skema.infoAwal.urutan) }).from(skema.infoAwal);
  await db
    .insert(skema.infoAwal)
    .values({ ...nilai, id, urutan: nilai.urutan || (terakhir.n ?? 0) + 1 });

  await catatLog(admin, "tambah", "info-awal", judul);
  segarkanPublik();
  redirect(`/admin/awal/${id}`);
}

export async function hapusInfoAwal(form: FormData): Promise<void> {
  const admin = await wajibAdmin();
  const id = teks(form, "id");

  await db.delete(skema.infoAwal).where(eq(skema.infoAwal.id, id));
  await catatLog(admin, "hapus", "info-awal", id);
  segarkanPublik();
  redirect("/admin/awal");
}

export async function geserInfoAwal(form: FormData): Promise<void> {
  await wajibAdmin();
  const id = teks(form, "id");
  const arah = teks(form, "arah");

  const semua = await db.query.infoAwal.findMany({ orderBy: [asc(skema.infoAwal.urutan)] });
  const i = semua.findIndex((x) => x.id === id);
  const j = arah === "naik" ? i - 1 : i + 1;
  if (i === -1 || j < 0 || j >= semua.length) redirect("/admin/awal");

  await db
    .update(skema.infoAwal)
    .set({ urutan: semua[j].urutan })
    .where(eq(skema.infoAwal.id, semua[i].id));
  await db
    .update(skema.infoAwal)
    .set({ urutan: semua[i].urutan })
    .where(eq(skema.infoAwal.id, semua[j].id));

  segarkanPublik();
  redirect("/admin/awal");
}
