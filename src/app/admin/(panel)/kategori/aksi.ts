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

type Warna = (typeof skema.WARNA)[number];

const warnaSah = (nilai: string): Warna =>
  (skema.WARNA as readonly string[]).includes(nilai) ? (nilai as Warna) : "adukan";

export async function simpanKategori(_sebelum: HasilAksi, form: FormData): Promise<HasilAksi> {
  const admin = await wajibAdmin();

  const idLama = teks(form, "idLama");
  const nama = teks(form, "nama");
  const ringkas = teks(form, "ringkas");

  if (!nama) return { galat: "Nama kategori harus diisi." };
  if (!ringkas) return { galat: "Keterangan harus diisi — tampil di bawah penyaring materi." };

  const nilai = {
    nama,
    ringkas,
    warna: warnaSah(teks(form, "warna")),
    ikon: teks(form, "ikon") || "kartu",
    urutan: angka(form, "urutan"),
    aktif: centang(form, "aktif"),
  };

  if (idLama) {
    await db.update(skema.kategori).set(nilai).where(eq(skema.kategori.id, idLama));
    await catatLog(admin, "ubah", "kategori", nama);
    segarkanPublik();
    return { pesan: "Kategori tersimpan." };
  }

  const id = jadikanId(nama);
  if (!id) return { galat: "Nama tidak bisa dijadikan pengenal. Pakai huruf atau angka." };

  const bentrok = await db.query.kategori.findFirst({ where: eq(skema.kategori.id, id) });
  if (bentrok) return { galat: `Sudah ada kategori dengan pengenal "${id}".` };

  const [terakhir] = await db.select({ n: max(skema.kategori.urutan) }).from(skema.kategori);
  await db
    .insert(skema.kategori)
    .values({ ...nilai, id, urutan: nilai.urutan || (terakhir.n ?? 0) + 1 });

  await catatLog(admin, "tambah", "kategori", nama);
  segarkanPublik();
  redirect(`/admin/kategori/${id}`);
}

export async function hapusKategori(form: FormData): Promise<void> {
  const admin = await wajibAdmin();
  const id = teks(form, "id");

  // Materi menunjuk ke kategori. Menghapusnya begitu saja ditolak kunci asing,
  // jadi keterkaitannya diperiksa dulu dan pengelola diberi tahu apa yang
  // menghalangi — bukan pesan galat SQL.
  const dipakai = await db.query.topik.findMany({
    where: eq(skema.topik.kategoriId, id),
    columns: { judul: true },
  });

  if (dipakai.length > 0) {
    const daftar = dipakai
      .slice(0, 3)
      .map((t) => `"${t.judul}"`)
      .join(", ");
    const sisa = dipakai.length > 3 ? ` dan ${dipakai.length - 3} lainnya` : "";
    redirect(
      `/admin/kategori/${id}?galat=${encodeURIComponent(
        `Masih dipakai ${dipakai.length} materi: ${daftar}${sisa}. Pindahkan materinya dulu.`,
      )}`,
    );
  }

  await db.delete(skema.kategori).where(eq(skema.kategori.id, id));
  await catatLog(admin, "hapus", "kategori", id);
  segarkanPublik();
  redirect("/admin/kategori");
}

export async function geserKategori(form: FormData): Promise<void> {
  await wajibAdmin();
  const id = teks(form, "id");
  const arah = teks(form, "arah");

  const semua = await db.query.kategori.findMany({ orderBy: [asc(skema.kategori.urutan)] });
  const i = semua.findIndex((k) => k.id === id);
  const j = arah === "naik" ? i - 1 : i + 1;
  if (i === -1 || j < 0 || j >= semua.length) redirect("/admin/kategori");

  await db
    .update(skema.kategori)
    .set({ urutan: semua[j].urutan })
    .where(eq(skema.kategori.id, semua[i].id));
  await db
    .update(skema.kategori)
    .set({ urutan: semua[i].urutan })
    .where(eq(skema.kategori.id, semua[j].id));

  segarkanPublik();
  redirect("/admin/kategori");
}
