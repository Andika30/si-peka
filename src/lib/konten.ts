import "server-only";

import { cache } from "react";
import { asc, desc, eq } from "drizzle-orm";
import { db, skema } from "@/db";
import type {
  BankIndonesia,
  Berita,
  ButirSus,
  Kategori,
  Kuis,
  Layanan,
  Masalah,
  Penyelenggara,
  RingkasKonten,
  Skenario,
  Topik,
} from "./tipe";

/**
 * Satu-satunya pintu ke isi aplikasi.
 *
 * Dulu berkas ini membaca berkas JSON; sekarang ia bertanya ke MySQL. Bentuk
 * yang dikembalikan sengaja tidak berubah, jadi halaman tetap menerima data
 * yang sama seperti sebelumnya.
 *
 * Semua fungsi dibungkus `cache()` dari React: kalau satu halaman memanggil
 * `ambilTopik()` di beberapa tempat, kueri-nya tetap sekali per permintaan.
 *
 * Baris `aktif = false` disaring di sini, bukan di halaman. Menonaktifkan
 * materi lewat admin berarti materi itu hilang dari seluruh aplikasi sekaligus
 * — tidak ada halaman yang bisa lupa menyaringnya.
 */

/* ── Materi ──────────────────────────────────────────────────────────────── */

export const ambilKategori = cache(async (): Promise<Kategori[]> => {
  const baris = await db.query.kategori.findMany({
    where: eq(skema.kategori.aktif, true),
    orderBy: [asc(skema.kategori.urutan)],
  });
  return baris.map((k) => ({
    id: k.id,
    nama: k.nama,
    ringkas: k.ringkas,
    warna: k.warna,
    ikon: k.ikon,
  }));
});

export const ambilTopik = cache(async (): Promise<Topik[]> => {
  const baris = await db.query.topik.findMany({
    where: eq(skema.topik.aktif, true),
    orderBy: [asc(skema.topik.urutan)],
    with: {
      isi: { orderBy: [asc(skema.isiTopik.urutan)] },
      kuis: { columns: { id: true }, where: eq(skema.kuis.aktif, true) },
    },
  });

  return baris.map((t) => ({
    id: t.id,
    kategori: t.kategoriId,
    judul: t.judul,
    ringkas: t.ringkas,
    ikon: t.ikon,
    warna: t.warna,
    isi: t.isi.map((i) => ({
      jenis: i.jenis,
      teks: i.teks,
      ...(i.keterangan ? { keterangan: i.keterangan } : {}),
    })),
    ...(t.peringatan ? { peringatan: t.peringatan } : {}),
    sumber: t.sumber,
    // Satu materi punya paling banyak satu kuis; kalau belum ada, tautannya
    // dibiarkan kosong dan halaman materi menyembunyikan tombol kuisnya.
    kuisTerkait: t.kuis[0]?.id ?? "",
  }));
});

export const cariTopik = cache(async (id: string): Promise<Topik | undefined> => {
  const semua = await ambilTopik();
  return semua.find((t) => t.id === id);
});

export const cariKategori = cache(async (id: string): Promise<Kategori | undefined> => {
  const semua = await ambilKategori();
  return semua.find((k) => k.id === id);
});

export const topikPerKategori = cache(async (idKategori: string): Promise<Topik[]> => {
  const semua = await ambilTopik();
  return semua.filter((t) => t.kategori === idKategori);
});

/* ── Berita ──────────────────────────────────────────────────────────────── */

/** Terbaru lebih dulu — urutannya ditentukan tanggal, bukan waktu sisip. */
export const ambilBerita = cache(async (batas?: number): Promise<Berita[]> => {
  const baris = await db.query.berita.findMany({
    where: eq(skema.berita.aktif, true),
    orderBy: [desc(skema.berita.tanggal)],
    ...(batas ? { limit: batas } : {}),
    with: { isi: { orderBy: [asc(skema.isiBerita.urutan)] } },
  });

  return baris.map((b) => ({
    id: b.id,
    judul: b.judul,
    ringkas: b.ringkas,
    ...(b.gambar ? { gambar: b.gambar } : {}),
    ...(b.gambarAlt ? { gambarAlt: b.gambarAlt } : {}),
    sumber: b.sumber,
    tanggal: b.tanggal,
    isi: b.isi.map((i) => ({
      jenis: i.jenis,
      teks: i.teks,
      ...(i.keterangan ? { keterangan: i.keterangan } : {}),
    })),
  }));
});

export const cariBerita = cache(async (id: string): Promise<Berita | undefined> => {
  const semua = await ambilBerita();
  return semua.find((b) => b.id === id);
});

/* ── Kuis ────────────────────────────────────────────────────────────────── */

export const ambilKuis = cache(async (): Promise<Kuis[]> => {
  const baris = await db.query.kuis.findMany({
    where: eq(skema.kuis.aktif, true),
    orderBy: [asc(skema.kuis.urutan)],
    with: {
      soal: {
        orderBy: [asc(skema.soal.urutan)],
        with: { opsi: { orderBy: [asc(skema.opsiSoal.urutan)] } },
      },
    },
  });

  return baris.map((k) => ({
    id: k.id,
    judul: k.judul,
    materiTerkait: k.topikId,
    soal: k.soal.map((s) => ({
      pertanyaan: s.pertanyaan,
      opsi: s.opsi.map((o) => o.teks),
      kunci: s.kunci,
      pembahasan: s.pembahasan,
    })),
  }));
});

export const cariKuis = cache(async (id: string): Promise<Kuis | undefined> => {
  const semua = await ambilKuis();
  return semua.find((k) => k.id === id);
});

export const kuisUntukTopik = cache(async (idTopik: string): Promise<Kuis | undefined> => {
  const semua = await ambilKuis();
  return semua.find((k) => k.materiTerkait === idTopik);
});

/* ── Simulasi ────────────────────────────────────────────────────────────── */

export const ambilSkenario = cache(async (): Promise<Skenario[]> => {
  const baris = await db.query.skenario.findMany({
    where: eq(skema.skenario.aktif, true),
    orderBy: [asc(skema.skenario.urutan)],
    with: {
      konteks: { orderBy: [asc(skema.konteksSkenario.urutan)] },
      opsi: { orderBy: [asc(skema.opsiSkenario.urutan)] },
    },
  });

  return baris.map((s) => ({
    id: s.id,
    situasi: s.situasi,
    alasan: s.alasan,
    ...(s.gambar ? { gambar: s.gambar } : {}),
    ...(s.gambarAlt ? { gambarAlt: s.gambarAlt } : {}),
    konteks: s.konteks.map((k) => ({ label: k.label, nilai: k.nilai })),
    opsi: s.opsi.map((o) => ({
      teks: o.teks,
      aman: o.aman,
      ...(o.konsekuensi ? { konsekuensi: o.konsekuensi } : {}),
    })),
  }));
});

/* ── Panduan pengaduan ───────────────────────────────────────────────────── */

export const ambilMasalah = cache(async (): Promise<Masalah[]> => {
  const baris = await db.query.masalah.findMany({
    where: eq(skema.masalah.aktif, true),
    orderBy: [asc(skema.masalah.urutan)],
    with: { langkah: { orderBy: [asc(skema.langkahMasalah.urutan)] } },
  });

  return baris.map((m) => ({
    id: m.id,
    aktif: m.aktif,
    label: m.label,
    ringkas: m.ringkas,
    judul: m.judul,
    pembuka: m.pembuka,
    ...(m.segera ? { segera: m.segera } : {}),
    ...(m.peringatanUtama ? { peringatanUtama: m.peringatanUtama } : {}),
    langkah: m.langkah.map((l) => l.teks),
    pihak: m.pihak,
    eskalasiBI: m.eskalasiBi,
    materiTerkait: m.topikId ?? "",
    sumber: m.sumber,
  }));
});

export const cariMasalah = cache(async (id: string): Promise<Masalah | undefined> => {
  const semua = await ambilMasalah();
  return semua.find((m) => m.id === id);
});

/* ── Kanal resmi ─────────────────────────────────────────────────────────── */

export const ambilLayanan = cache(async (): Promise<Layanan[]> => {
  const baris = await db.query.layanan.findMany({
    where: eq(skema.layanan.aktif, true),
    orderBy: [asc(skema.layanan.urutan)],
  });
  return baris.map((l) => ({ id: l.id, nama: l.nama, ringkas: l.ringkas, ikon: l.ikon }));
});

export const ambilPenyelenggara = cache(async (): Promise<Penyelenggara[]> => {
  const baris = await db.query.penyelenggara.findMany({
    where: eq(skema.penyelenggara.aktif, true),
    orderBy: [asc(skema.penyelenggara.urutan)],
  });
  return baris.map((p) => ({
    id: p.id,
    nama: p.nama,
    jenis: p.jenis,
    telepon: p.telepon,
    aplikasi: p.aplikasi,
    situs: p.situs,
    diverifikasi: p.diverifikasi,
  }));
});

export const ambilBankIndonesia = cache(async (): Promise<BankIndonesia> => {
  const baris = await db.query.pengaturan.findFirst({
    where: eq(skema.pengaturan.kunci, "bank_indonesia"),
  });
  if (!baris) {
    throw new Error(
      "Kanal Bank Indonesia belum ada di basis data. Jalankan `npm run db:seed`.",
    );
  }
  return JSON.parse(baris.nilai) as BankIndonesia;
});

/* ── Penilaian usability ─────────────────────────────────────────────────── */

export const ambilSus = cache(async (): Promise<ButirSus[]> => {
  const baris = await db.query.sus.findMany({ orderBy: [asc(skema.sus.urutan)] });
  return baris.map((s) => ({ teks: s.teks, positif: s.positif }));
});

/* ── Ringkasan untuk komponen klien ──────────────────────────────────────── */

/**
 * Isi seperlunya untuk menghitung progres dan menyusun riwayat di peramban.
 * Sengaja bukan seluruh materi: paragraf dan soal tidak dibutuhkan di sana,
 * dan mengirimkannya hanya memperbesar halaman.
 */
export const ambilRingkasKonten = cache(async (): Promise<RingkasKonten> => {
  const [topik, kuis, skenario] = await Promise.all([
    ambilTopik(),
    ambilKuis(),
    ambilSkenario(),
  ]);

  return {
    topik: topik.map((t) => ({
      id: t.id,
      judul: t.judul,
      ringkas: t.ringkas,
      warna: t.warna,
      kuisTerkait: t.kuisTerkait,
    })),
    kuis: kuis.map((k) => ({ id: k.id, judul: k.judul, materiTerkait: k.materiTerkait })),
    jumlahSkenario: skenario.length,
  };
});
