import "server-only";

import { and, desc, eq, gte, sql } from "drizzle-orm";
import { db, skema } from "@/db";

/**
 * Pencatatan pemakaian — dan pembacaannya untuk dasbor.
 *
 * Semua yang dicatat di sini berupa ANGKA. Tidak ada id pengguna, id
 * perangkat, alamat IP, maupun cap waktu per kejadian. Yang bertambah hanya
 * penghitung harian, jadi tidak ada cara merangkai dua kejadian jadi jejak
 * satu orang — bahkan dari basis datanya langsung.
 *
 * Konsekuensinya jujur: dasbor bisa menjawab "materi mana yang paling
 * dibuka", tapi tidak bisa menjawab "berapa orang yang memakai aplikasi".
 * Pertanyaan kedua butuh menandai perangkat, dan itu tidak dilakukan.
 */

const hariIni = () => new Date().toISOString().slice(0, 10);

type Jenis = (typeof skema.JENIS_PERISTIWA)[number];

/**
 * Menaikkan penghitung harian. Memakai ON DUPLICATE KEY UPDATE supaya dua
 * permintaan bersamaan tidak saling menimpa — penambahannya dikerjakan MySQL,
 * bukan dibaca-lalu-ditulis oleh aplikasi.
 */
export async function catat(jenis: Jenis, rujukan = ""): Promise<void> {
  try {
    await db
      .insert(skema.peristiwa)
      .values({ jenis, rujukan, tanggal: hariIni(), jumlah: 1 })
      .onDuplicateKeyUpdate({ set: { jumlah: sql`${skema.peristiwa.jumlah} + 1` } });
  } catch {
    // Statistik tidak boleh menjatuhkan halaman. Kalau pencatatan gagal,
    // yang hilang cuma satu angka di dasbor — bukan materinya.
  }
}

export async function catatHasilKuis(
  kuisId: string,
  skor: number,
  idSoalKeliru: number[],
  idSoalDijawab: number[],
): Promise<void> {
  try {
    await db
      .insert(skema.statistikKuis)
      .values({ kuisId, dikerjakan: 1, jumlahSkor: skor })
      .onDuplicateKeyUpdate({
        set: {
          dikerjakan: sql`${skema.statistikKuis.dikerjakan} + 1`,
          jumlahSkor: sql`${skema.statistikKuis.jumlahSkor} + ${skor}`,
        },
      });

    // Satu INSERT untuk semua soal sekaligus, bukan satu per soal — VALUES()
    // di UPDATE merujuk nilai yang baru saja dikirim untuk baris itu, jadi
    // tiap baris tetap naik dengan angka `keliru`-nya masing-masing walau
    // pernyataan SET-nya sama untuk semua baris.
    if (idSoalDijawab.length > 0) {
      const keliru = new Set(idSoalKeliru);
      await db
        .insert(skema.statistikSoal)
        .values(
          idSoalDijawab.map((soalId) => ({
            soalId,
            dijawab: 1,
            keliru: keliru.has(soalId) ? 1 : 0,
          })),
        )
        .onDuplicateKeyUpdate({
          set: {
            dijawab: sql`${skema.statistikSoal.dijawab} + 1`,
            keliru: sql`${skema.statistikSoal.keliru} + VALUES(${skema.statistikSoal.keliru})`,
          },
        });
    }

    await catat("kuis_selesai", kuisId);
  } catch {
    /* diabaikan — lihat catatan di `catat` */
  }
}

export async function catatSimulasi(skenarioId: string, aman: boolean): Promise<void> {
  try {
    await db
      .insert(skema.statistikSkenario)
      .values({ skenarioId, dicoba: 1, aman: aman ? 1 : 0 })
      .onDuplicateKeyUpdate({
        set: {
          dicoba: sql`${skema.statistikSkenario.dicoba} + 1`,
          aman: sql`${skema.statistikSkenario.aman} + ${aman ? 1 : 0}`,
        },
      });
    await catat("simulasi_selesai", skenarioId);
  } catch {
    /* diabaikan */
  }
}

/* ── Pembacaan untuk dasbor ──────────────────────────────────────────────── */

const tanggalMundur = (hari: number) =>
  new Date(Date.now() - hari * 86_400_000).toISOString().slice(0, 10);

export type DeretHarian = { tanggal: string; materi: number; kuis: number; simulasi: number };

/** Deret harian untuk grafik aktivitas. Hari tanpa kegiatan tetap muncul
    sebagai nol — kalau dilewati, grafiknya berbohong soal jeda. */
export async function deretAktivitas(hari = 7): Promise<DeretHarian[]> {
  const sejak = tanggalMundur(hari - 1);
  const baris = await db
    .select()
    .from(skema.peristiwa)
    .where(gte(skema.peristiwa.tanggal, sejak));

  const peta = new Map<string, DeretHarian>();
  for (let i = hari - 1; i >= 0; i -= 1) {
    const t = tanggalMundur(i);
    peta.set(t, { tanggal: t, materi: 0, kuis: 0, simulasi: 0 });
  }

  for (const b of baris) {
    const hari = peta.get(b.tanggal);
    if (!hari) continue;
    if (b.jenis === "materi_dibuka") hari.materi += b.jumlah;
    if (b.jenis === "kuis_selesai") hari.kuis += b.jumlah;
    if (b.jenis === "simulasi_selesai") hari.simulasi += b.jumlah;
  }

  return [...peta.values()];
}

export async function totalPeristiwa(jenis: Jenis, hari?: number): Promise<number> {
  const syarat = hari
    ? and(eq(skema.peristiwa.jenis, jenis), gte(skema.peristiwa.tanggal, tanggalMundur(hari - 1)))
    : eq(skema.peristiwa.jenis, jenis);

  const [hasil] = await db
    .select({ n: sql<number>`COALESCE(SUM(${skema.peristiwa.jumlah}), 0)` })
    .from(skema.peristiwa)
    .where(syarat);

  return Number(hasil?.n ?? 0);
}

export async function materiTerbanyak(batas = 5) {
  return db
    .select({
      id: skema.peristiwa.rujukan,
      judul: skema.topik.judul,
      jumlah: sql<number>`SUM(${skema.peristiwa.jumlah})`,
    })
    .from(skema.peristiwa)
    .innerJoin(skema.topik, eq(skema.topik.id, skema.peristiwa.rujukan))
    .where(eq(skema.peristiwa.jenis, "materi_dibuka"))
    .groupBy(skema.peristiwa.rujukan, skema.topik.judul)
    .orderBy(desc(sql`SUM(${skema.peristiwa.jumlah})`))
    .limit(batas);
}

export async function performaKuis() {
  const [ringkas] = await db
    .select({
      dikerjakan: sql<number>`COALESCE(SUM(${skema.statistikKuis.dikerjakan}), 0)`,
      jumlahSkor: sql<number>`COALESCE(SUM(${skema.statistikKuis.jumlahSkor}), 0)`,
    })
    .from(skema.statistikKuis);

  const dikerjakan = Number(ringkas?.dikerjakan ?? 0);
  const rerata = dikerjakan > 0 ? Math.round(Number(ringkas.jumlahSkor) / dikerjakan) : 0;

  // Hanya soal yang sudah cukup sering dijawab yang layak dibandingkan —
  // satu jawaban keliru dari satu percobaan bukan berarti soalnya sulit.
  const seringSalah = await db
    .select({
      pertanyaan: skema.soal.pertanyaan,
      dijawab: skema.statistikSoal.dijawab,
      keliru: skema.statistikSoal.keliru,
      persen: sql<number>`ROUND(${skema.statistikSoal.keliru} * 100 / ${skema.statistikSoal.dijawab})`,
    })
    .from(skema.statistikSoal)
    .innerJoin(skema.soal, eq(skema.soal.id, skema.statistikSoal.soalId))
    .where(gte(skema.statistikSoal.dijawab, 3))
    .orderBy(desc(sql`${skema.statistikSoal.keliru} / ${skema.statistikSoal.dijawab}`))
    .limit(3);

  return { dikerjakan, rerata, seringSalah };
}

export async function skenarioPopuler(batas = 5) {
  return db
    .select({
      id: skema.statistikSkenario.skenarioId,
      situasi: skema.skenario.situasi,
      dicoba: skema.statistikSkenario.dicoba,
      persen: sql<number>`ROUND(${skema.statistikSkenario.aman} * 100 / ${skema.statistikSkenario.dicoba})`,
    })
    .from(skema.statistikSkenario)
    .innerJoin(skema.skenario, eq(skema.skenario.id, skema.statistikSkenario.skenarioId))
    .orderBy(desc(skema.statistikSkenario.dicoba))
    .limit(batas);
}
