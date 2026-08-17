/**
 * Mengisi basis data dari berkas JSON bawaan.
 *
 * JSON di `src/content` sekarang berperan sebagai ISI AWAL, bukan lagi sumber
 * yang dibaca aplikasi saat berjalan. Menjalankan skrip ini mengembalikan
 * basis data ke keadaan awal itu — berguna saat menyiapkan komputer baru atau
 * saat percobaan admin perlu diulang dari nol.
 *
 * Skrip ini MENGHAPUS lalu MENGISI ULANG seluruh tabel isi. Kalau sudah ada
 * materi yang disunting lewat admin, suntingan itu ikut hilang.
 *
 *   npm run db:seed
 */
// @next/env hanya menyediakan ekspor CommonJS, jadi diambil lewat createRequire
// — berkas ini ESM supaya bisa memakai top-level await.
import { createRequire } from "node:module";

const { loadEnvConfig } = createRequire(import.meta.url)("@next/env") as {
  loadEnvConfig: (dir: string) => void;
};
loadEnvConfig(process.cwd());

const { db, kolam, skema } = await import("./index");

import materiJson from "../content/materi.json";
import kuisJson from "../content/kuis.json";
import skenarioJson from "../content/skenario.json";
import panduanJson from "../content/panduan.json";
import penyelenggaraJson from "../content/penyelenggara.json";
import susJson from "../content/sus.json";

type Warna = (typeof skema.WARNA)[number];

async function seed() {
  console.log("Mengosongkan tabel isi…");
  // Urutannya dari anak ke induk supaya kunci asing tidak menghalangi.
  await db.delete(skema.opsiSoal);
  await db.delete(skema.soal);
  await db.delete(skema.kuis);
  await db.delete(skema.langkahMasalah);
  await db.delete(skema.masalah);
  await db.delete(skema.infoAwal);
  await db.delete(skema.opsiSkenario);
  await db.delete(skema.konteksSkenario);
  await db.delete(skema.skenario);
  await db.delete(skema.isiTopik);
  await db.delete(skema.topik);
  await db.delete(skema.kategori);
  await db.delete(skema.penyelenggara);
  await db.delete(skema.layanan);
  await db.delete(skema.pengaturan);
  await db.delete(skema.sus);

  /* ── Materi ─────────────────────────────────────────────────────────── */

  await db.insert(skema.kategori).values(
    materiJson.kategori.map((k, i) => ({
      id: k.id,
      nama: k.nama,
      ringkas: k.ringkas,
      warna: k.warna as Warna,
      ikon: k.ikon,
      urutan: i,
      aktif: true,
    })),
  );
  console.log(`  kategori       ${materiJson.kategori.length}`);

  await db.insert(skema.topik).values(
    materiJson.topik.map((t, i) => ({
      id: t.id,
      kategoriId: t.kategori,
      judul: t.judul,
      ringkas: t.ringkas,
      ikon: t.ikon,
      warna: t.warna as Warna,
      peringatan: "peringatan" in t.isi ? (t.isi.peringatan as string) : null,
      sumber: t.sumber,
      urutan: i,
      aktif: true,
    })),
  );
  console.log(`  topik          ${materiJson.topik.length}`);

  // Blok disusun berurut: paragraf dulu, lalu poin. Isi awal belum memuat
  // gambar — itu ditambahkan pengelola lewat panel admin.
  const barisIsi = materiJson.topik.flatMap((t) => {
    const blok = [
      ...t.isi.paragraf.map((teks) => ({ jenis: "paragraf" as const, teks })),
      ...t.isi.poin.map((teks) => ({ jenis: "poin" as const, teks })),
    ];
    return blok.map((b, urutan) => ({ topikId: t.id, ...b, urutan }));
  });
  await db.insert(skema.isiTopik).values(barisIsi);
  console.log(`  isi_topik      ${barisIsi.length}`);

  /* ── Kuis ───────────────────────────────────────────────────────────── */

  await db.insert(skema.kuis).values(
    kuisJson.daftar.map((k, i) => ({
      id: k.id,
      judul: k.judul,
      topikId: k.materiTerkait,
      urutan: i,
      aktif: true,
    })),
  );
  console.log(`  kuis           ${kuisJson.daftar.length}`);

  // ID soal dibuat MySQL, jadi opsinya baru bisa disisipkan setelah soalnya
  // ada dan ID-nya dibaca kembali.
  let jumlahSoal = 0;
  let jumlahOpsi = 0;
  for (const k of kuisJson.daftar) {
    for (const [urutan, s] of k.soal.entries()) {
      const [hasil] = await db.insert(skema.soal).values({
        kuisId: k.id,
        pertanyaan: s.pertanyaan,
        kunci: s.kunci,
        pembahasan: s.pembahasan,
        urutan,
      });
      const soalId = hasil.insertId;
      await db.insert(skema.opsiSoal).values(
        s.opsi.map((teks, i) => ({ soalId, urutan: i, teks })),
      );
      jumlahSoal += 1;
      jumlahOpsi += s.opsi.length;
    }
  }
  console.log(`  soal           ${jumlahSoal}`);
  console.log(`  opsi_soal      ${jumlahOpsi}`);

  /* ── Simulasi ───────────────────────────────────────────────────────── */

  await db.insert(skema.skenario).values(
    skenarioJson.map((s, i) => ({
      id: s.id,
      situasi: s.situasi,
      alasan: s.alasan,
      urutan: i,
      aktif: true,
    })),
  );
  await db.insert(skema.konteksSkenario).values(
    skenarioJson.flatMap((s) =>
      s.konteks.map((k, i) => ({
        skenarioId: s.id,
        urutan: i,
        label: k.label,
        nilai: k.nilai,
      })),
    ),
  );
  await db.insert(skema.opsiSkenario).values(
    skenarioJson.flatMap((s) =>
      s.opsi.map((o, i) => ({
        skenarioId: s.id,
        urutan: i,
        teks: o.teks,
        aman: o.aman,
        konsekuensi: "konsekuensi" in o ? (o.konsekuensi as string) : null,
      })),
    ),
  );
  console.log(`  skenario       ${skenarioJson.length}`);

  /* ── Panduan pengaduan ──────────────────────────────────────────────── */

  await db.insert(skema.masalah).values(
    panduanJson.masalah.map((m, i) => ({
      id: m.id,
      label: m.label,
      ringkas: m.ringkas,
      judul: m.judul,
      pembuka: m.pembuka,
      segera: "segera" in m ? (m.segera as string) : null,
      peringatanUtama:
        "peringatanUtama" in m ? (m.peringatanUtama as string) : null,
      pihak: m.pihak,
      eskalasiBi: m.eskalasiBI,
      topikId: m.materiTerkait,
      sumber: m.sumber,
      urutan: i,
      aktif: m.aktif,
    })),
  );
  await db.insert(skema.langkahMasalah).values(
    panduanJson.masalah.flatMap((m) =>
      m.langkah.map((teks, i) => ({ masalahId: m.id, urutan: i, teks })),
    ),
  );
  console.log(`  masalah        ${panduanJson.masalah.length}`);

  await db.insert(skema.infoAwal).values(
    panduanJson.infoAwal.map((i, urutan) => ({
      id: i.id,
      judul: i.judul,
      keterangan: i.keterangan,
      urutan,
      aktif: true,
    })),
  );
  console.log(`  info_awal      ${panduanJson.infoAwal.length}`);

  /* ── Kanal resmi ────────────────────────────────────────────────────── */

  await db.insert(skema.layanan).values(
    penyelenggaraJson.layanan.map((l, i) => ({
      id: l.id,
      nama: l.nama,
      ringkas: l.ringkas,
      ikon: l.ikon,
      urutan: i,
      aktif: true,
    })),
  );
  await db.insert(skema.penyelenggara).values(
    penyelenggaraJson.daftar.map((p, i) => ({
      id: p.id,
      nama: p.nama,
      jenis: p.jenis,
      telepon: p.telepon,
      aplikasi: p.aplikasi,
      situs: p.situs,
      diverifikasi: p.diverifikasi,
      urutan: i,
      aktif: true,
    })),
  );
  console.log(`  penyelenggara  ${penyelenggaraJson.daftar.length}`);

  // Kanal Bank Indonesia disimpan utuh sebagai JSON dalam satu baris
  // pengaturan — bentuknya bersarang dan hanya ada satu.
  await db.insert(skema.pengaturan).values({
    kunci: "bank_indonesia",
    nilai: JSON.stringify(penyelenggaraJson.bankIndonesia),
  });

  /* ── Penilaian usability ────────────────────────────────────────────── */

  await db.insert(skema.sus).values(
    susJson.pernyataan.map((s, i) => ({
      urutan: i,
      teks: s.teks,
      positif: s.positif,
    })),
  );
  console.log(`  sus            ${susJson.pernyataan.length}`);

  console.log("\nSelesai.");
}

try {
  await seed();
} catch (galat) {
  console.error("\nSeed gagal:", galat);
  process.exitCode = 1;
} finally {
  await kolam.end();
}
