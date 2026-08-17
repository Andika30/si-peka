"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, skema } from "@/db";
import {
  centang,
  jadikanId,
  segarkanPublik,
  teks,
  wajibAdmin,
  type HasilAksi,
} from "@/lib/admin/jaga";
import { catatLog } from "@/lib/admin/log";
import { bacaBlok, bersihkanGambarYatim, type BlokMasuk } from "@/lib/admin/blok";
import { hapusGambar, simpanGambar } from "@/lib/admin/gambar";

async function tulisIsi(beritaId: string, blok: BlokMasuk[]) {
  await db.delete(skema.isiBerita).where(eq(skema.isiBerita.beritaId, beritaId));
  if (blok.length === 0) return;

  await db.insert(skema.isiBerita).values(
    // Berita dibaca sekali jalan, tidak dipecah per bagian, dan editornya
    // tidak menawarkan kartu-flip maupun video — tapi skemanya juga tidak
    // mengenal ketiganya, jadi kalau ada yang lolos (mis. sisa data lama)
    // diperlakukan sebagai paragraf biasa daripada gagal tersimpan.
    blok.map((b, urutan) => ({
      beritaId,
      jenis:
        b.jenis === "subjudul" || b.jenis === "kartu-flip" || b.jenis === "video"
          ? ("paragraf" as const)
          : b.jenis,
      teks: b.teks,
      keterangan: b.keterangan,
      urutan,
    })),
  );
}

const blokLama = (beritaId: string) =>
  db.query.isiBerita.findMany({
    where: eq(skema.isiBerita.beritaId, beritaId),
    columns: { jenis: true, teks: true },
  });

export async function simpanBerita(_sebelum: HasilAksi, form: FormData): Promise<HasilAksi> {
  const admin = await wajibAdmin();

  const idLama = teks(form, "idLama");
  const judul = teks(form, "judul");
  const ringkas = teks(form, "ringkas");
  const sumber = teks(form, "sumber");
  const tanggal = teks(form, "tanggal");

  if (!judul) return { galat: "Judul berita harus diisi." };
  if (!ringkas) return { galat: "Ringkasan harus diisi — itu yang tampil di kartu." };

  // Tanggal dan sumber ditegakkan di sini, bukan sekadar disarankan. Berita
  // terikat waktu, dan tanpa keduanya pembaca tidak bisa menilai kabarnya
  // masih berlaku atau tidak.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) return { galat: "Tanggal terbit harus diisi." };
  if (!sumber) return { galat: "Sumber harus diisi supaya klaimnya bisa ditelusuri." };

  const { blok, galat } = await bacaBlok(form);
  if (galat) return { galat };
  if (!blok.some((b) => b.jenis === "paragraf")) {
    return { galat: "Isi berita minimal satu paragraf." };
  }

  // Gambar sampul: berkas baru menggantikan yang lama; tanpa berkas, yang
  // lama dipertahankan kecuali memang diminta dihapus.
  const berkas = form.get("gambar");
  const gambarLama = teks(form, "gambarLama") || null;
  let gambar = gambarLama;

  if (berkas instanceof File && berkas.size > 0) {
    const hasil = await simpanGambar(berkas);
    if (hasil.galat) return { galat: hasil.galat };
    gambar = hasil.nama!;
  } else if (centang(form, "hapusGambar")) {
    gambar = null;
  }

  const nilai = {
    judul,
    ringkas,
    gambar,
    gambarAlt: teks(form, "gambarAlt") || null,
    sumber,
    tanggal,
    aktif: centang(form, "aktif"),
  };

  if (idLama) {
    await db.update(skema.berita).set(nilai).where(eq(skema.berita.id, idLama));
    await bersihkanGambarYatim(await blokLama(idLama), blok);
    await tulisIsi(idLama, blok);
    if (gambarLama && gambarLama !== gambar) await hapusGambar(gambarLama);

    await catatLog(admin, "ubah", "berita", judul);
    segarkanPublik();
    return { pesan: "Berita tersimpan." };
  }

  // Alamat halaman diawali tanggal supaya dua berita berjudul mirip di bulan
  // berbeda tidak bertabrakan.
  const id = `${tanggal}-${jadikanId(judul)}`.slice(0, 96);
  const bentrok = await db.query.berita.findFirst({ where: eq(skema.berita.id, id) });
  if (bentrok) return { galat: `Sudah ada berita dengan alamat "${id}". Ubah judulnya.` };

  await db.insert(skema.berita).values({ ...nilai, id });
  await tulisIsi(id, blok);

  await catatLog(admin, "tambah", "berita", judul);
  segarkanPublik();
  redirect(`/admin/berita/${id}`);
}

export async function hapusBerita(form: FormData): Promise<void> {
  const admin = await wajibAdmin();
  const id = teks(form, "id");

  const b = await db.query.berita.findFirst({
    where: eq(skema.berita.id, id),
    columns: { gambar: true },
  });

  // Baris isinya ikut terhapus lewat ON DELETE CASCADE, berkas gambarnya tidak.
  await bersihkanGambarYatim(await blokLama(id), []);
  await hapusGambar(b?.gambar);

  await db.delete(skema.berita).where(eq(skema.berita.id, id));
  await catatLog(admin, "hapus", "berita", id);
  segarkanPublik();
  redirect("/admin/berita");
}
