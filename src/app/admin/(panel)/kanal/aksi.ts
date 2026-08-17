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

/** Menulis ulang kaitan penyelenggara ke jenis layanan. */
async function tulisLayanan(penyelenggaraId: string, form: FormData) {
  await db
    .delete(skema.penyelenggaraLayanan)
    .where(eq(skema.penyelenggaraLayanan.penyelenggaraId, penyelenggaraId));

  const dipilih: string[] = [];
  for (const k of form.keys()) {
    const cocok = /^layanan\.(.+)$/.exec(k);
    if (cocok) dipilih.push(cocok[1]);
  }
  if (dipilih.length === 0) return;

  await db
    .insert(skema.penyelenggaraLayanan)
    .values(dipilih.map((layananId) => ({ penyelenggaraId, layananId })));
}

/**
 * Kanal resmi penyelenggara jasa pembayaran.
 *
 * Dulu seluruh daftar disunting sekaligus di satu halaman — bisa mengubah,
 * tapi tidak bisa menambah maupun menghapus. Sekarang bentuknya sama seperti
 * isi lain: daftar, lalu satu halaman per penyelenggara.
 *
 * Bank Indonesia sengaja TIDAK ada di daftar ini. BI bukan tempat mengadukan
 * transaksi sehari-hari; jalur ke sana hanya terbuka lewat layar eskalasi,
 * dan kanalnya diatur terpisah di bawah.
 */
export async function simpanPenyelenggara(
  _sebelum: HasilAksi,
  form: FormData,
): Promise<HasilAksi> {
  const admin = await wajibAdmin();

  const idLama = teks(form, "idLama");
  const nama = teks(form, "nama");
  const telepon = teks(form, "telepon");
  const diverifikasi = teks(form, "diverifikasi");

  if (!nama) return { galat: "Nama penyelenggara harus diisi." };
  if (!telepon) return { galat: "Nomor call center harus diisi." };
  // Nomor dan tautan kanal resmi berubah. Tanggal verifikasi tampil apa adanya
  // ke peserta — itu yang membuat data basi kelihatan, bukan tersembunyi.
  if (!diverifikasi) return { galat: "Tanggal verifikasi harus diisi." };

  const nilai = {
    nama,
    jenis: teks(form, "jenis") || "Penyelenggara jasa pembayaran",
    telepon,
    aplikasi: teks(form, "aplikasi"),
    situs: teks(form, "situs"),
    diverifikasi,
    urutan: angka(form, "urutan"),
    aktif: centang(form, "aktif"),
  };

  if (idLama) {
    await db
      .update(skema.penyelenggara)
      .set(nilai)
      .where(eq(skema.penyelenggara.id, idLama));
    await tulisLayanan(idLama, form);
    await catatLog(admin, "ubah", "kanal", nama);
    segarkanPublik();
    return { pesan: `${nama} tersimpan.` };
  }

  const id = jadikanId(nama);
  if (!id) return { galat: "Nama tidak bisa dijadikan pengenal. Pakai huruf atau angka." };

  const bentrok = await db.query.penyelenggara.findFirst({
    where: eq(skema.penyelenggara.id, id),
  });
  if (bentrok) return { galat: `Sudah ada penyelenggara dengan pengenal "${id}".` };

  const [terakhir] = await db
    .select({ n: max(skema.penyelenggara.urutan) })
    .from(skema.penyelenggara);
  await db
    .insert(skema.penyelenggara)
    .values({ ...nilai, id, urutan: nilai.urutan || (terakhir.n ?? 0) + 1 });
  await tulisLayanan(id, form);

  await catatLog(admin, "tambah", "kanal", nama);
  segarkanPublik();
  redirect(`/admin/kanal/${id}`);
}

export async function hapusPenyelenggara(form: FormData): Promise<void> {
  const admin = await wajibAdmin();
  const id = teks(form, "id");

  await db.delete(skema.penyelenggara).where(eq(skema.penyelenggara.id, id));
  await catatLog(admin, "hapus", "kanal", id);
  segarkanPublik();
  redirect("/admin/kanal");
}

export async function geserPenyelenggara(form: FormData): Promise<void> {
  await wajibAdmin();
  const id = teks(form, "id");
  const arah = teks(form, "arah");

  const semua = await db.query.penyelenggara.findMany({
    orderBy: [asc(skema.penyelenggara.urutan)],
  });
  const i = semua.findIndex((p) => p.id === id);
  const j = arah === "naik" ? i - 1 : i + 1;
  if (i === -1 || j < 0 || j >= semua.length) redirect("/admin/kanal");

  await db
    .update(skema.penyelenggara)
    .set({ urutan: semua[j].urutan })
    .where(eq(skema.penyelenggara.id, semua[i].id));
  await db
    .update(skema.penyelenggara)
    .set({ urutan: semua[i].urutan })
    .where(eq(skema.penyelenggara.id, semua[j].id));

  segarkanPublik();
  redirect("/admin/kanal");
}

/** Kanal Bank Indonesia — hanya ada satu, jadi disunting langsung di tempat. */
export async function simpanBankIndonesia(
  _sebelum: HasilAksi,
  form: FormData,
): Promise<HasilAksi> {
  const admin = await wajibAdmin();

  const nilai = {
    nama: teks(form, "nama"),
    telepon: teks(form, "telepon"),
    situs: teks(form, "situs"),
    situsLabel: teks(form, "situsLabel"),
    diverifikasi: teks(form, "diverifikasi"),
  };

  if (!nilai.nama || !nilai.telepon) return { galat: "Nama dan telepon harus diisi." };
  if (!nilai.diverifikasi) return { galat: "Tanggal verifikasi harus diisi." };

  await db
    .update(skema.pengaturan)
    .set({ nilai: JSON.stringify(nilai) })
    .where(eq(skema.pengaturan.kunci, "bank_indonesia"));

  await catatLog(admin, "ubah", "kanal", "Kanal Bank Indonesia");
  segarkanPublik();
  return { pesan: "Kanal Bank Indonesia tersimpan." };
}
