"use server";

import { redirect } from "next/navigation";
import { asc, eq, max } from "drizzle-orm";
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

type Warna = (typeof skema.WARNA)[number];

const warnaSah = (nilai: string): Warna =>
  (skema.WARNA as readonly string[]).includes(nilai) ? (nilai as Warna) : "adukan";

/** Menulis ulang paragraf dan poin sebuah materi. */
async function tulisIsi(topikId: string, paragraf: string[], poin: string[]) {
  await db.delete(skema.isiTopik).where(eq(skema.isiTopik.topikId, topikId));

  const semua = [
    ...paragraf.map((teks, urutan) => ({ topikId, jenis: "paragraf" as const, teks, urutan })),
    ...poin.map((teks, urutan) => ({ topikId, jenis: "poin" as const, teks, urutan })),
  ];
  if (semua.length > 0) await db.insert(skema.isiTopik).values(semua);
}

export async function simpanTopik(_sebelum: HasilAksi, form: FormData): Promise<HasilAksi> {
  const admin = await wajibAdmin();

  const idLama = teks(form, "idLama");
  const judul = teks(form, "judul");
  const kategoriId = teks(form, "kategoriId");
  const paragraf = baris(form, "paragraf");
  const poin = baris(form, "poin");

  if (!judul) return { galat: "Judul materi harus diisi." };
  if (!kategoriId) return { galat: "Kategori harus dipilih." };
  if (paragraf.length === 0) return { galat: "Isi materi minimal satu paragraf." };
  if (poin.length === 0) return { galat: "Poin 'yang perlu diingat' minimal satu butir." };

  const nilai = {
    kategoriId,
    judul,
    ringkas: teks(form, "ringkas"),
    ikon: teks(form, "ikon") || "kartu",
    warna: warnaSah(teks(form, "warna")),
    peringatan: teks(form, "peringatan") || null,
    sumber: teks(form, "sumber") || "Bank Indonesia",
    urutan: angka(form, "urutan"),
    aktif: centang(form, "aktif"),
  };

  if (idLama) {
    await db.update(skema.topik).set(nilai).where(eq(skema.topik.id, idLama));
    await tulisIsi(idLama, paragraf, poin);
    await catatLog(admin, "ubah", "materi", judul);
    segarkanPublik();
    return { pesan: "Materi tersimpan." };
  }

  // ID dipakai di alamat halaman dan menyambungkan materi ke kuis serta
  // panduan, jadi ia dibuat sekali saat materi dibuat lalu tidak diubah lagi.
  const id = jadikanId(judul);
  if (!id) return { galat: "Judul tidak bisa dijadikan alamat halaman. Pakai huruf atau angka." };

  const bentrok = await db.query.topik.findFirst({ where: eq(skema.topik.id, id) });
  if (bentrok) return { galat: `Sudah ada materi dengan alamat "${id}". Ubah judulnya.` };

  const [urutanTerakhir] = await db.select({ n: max(skema.topik.urutan) }).from(skema.topik);
  await db.insert(skema.topik).values({
    ...nilai,
    id,
    urutan: nilai.urutan || (urutanTerakhir.n ?? 0) + 1,
  });
  await tulisIsi(id, paragraf, poin);
  await catatLog(admin, "tambah", "materi", judul);

  segarkanPublik();
  redirect(`/admin/materi/${id}`);
}

export async function hapusTopik(form: FormData): Promise<void> {
  const admin = await wajibAdmin();
  const id = teks(form, "id");

  // Kuis dan panduan menunjuk ke materi. Menghapusnya begitu saja akan
  // ditolak kunci asing — jadi keterkaitannya diperiksa lebih dulu dan
  // pengguna diberi tahu apa yang menghalangi, bukan pesan galat SQL.
  const [kuisTerkait, masalahTerkait] = await Promise.all([
    db.query.kuis.findMany({ where: eq(skema.kuis.topikId, id), columns: { judul: true } }),
    db.query.masalah.findMany({ where: eq(skema.masalah.topikId, id), columns: { label: true } }),
  ]);

  if (kuisTerkait.length > 0 || masalahTerkait.length > 0) {
    const penghalang = [
      ...kuisTerkait.map((k) => `kuis "${k.judul}"`),
      ...masalahTerkait.map((m) => `panduan "${m.label}"`),
    ].join(", ");
    redirect(`/admin/materi/${id}?galat=${encodeURIComponent(`Masih dipakai oleh ${penghalang}.`)}`);
  }

  await db.delete(skema.topik).where(eq(skema.topik.id, id));
  await catatLog(admin, "hapus", "materi", id);
  segarkanPublik();
  redirect("/admin/materi");
}

/** Menggeser urutan tampil satu langkah, dengan menukar nilai urutan tetangganya. */
export async function geserTopik(form: FormData): Promise<void> {
  await wajibAdmin();
  const id = teks(form, "id");
  const arah = teks(form, "arah");

  const semua = await db.query.topik.findMany({ orderBy: [asc(skema.topik.urutan)] });
  const i = semua.findIndex((t) => t.id === id);
  const j = arah === "naik" ? i - 1 : i + 1;
  if (i === -1 || j < 0 || j >= semua.length) redirect("/admin/materi");

  await db
    .update(skema.topik)
    .set({ urutan: semua[j].urutan })
    .where(eq(skema.topik.id, semua[i].id));
  await db
    .update(skema.topik)
    .set({ urutan: semua[i].urutan })
    .where(eq(skema.topik.id, semua[j].id));

  segarkanPublik();
  redirect("/admin/materi");
}
