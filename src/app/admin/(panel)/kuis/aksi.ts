"use server";

import { redirect } from "next/navigation";
import { eq, max } from "drizzle-orm";
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
 * Satu form memuat seluruh kuis: judul, semua soal, semua opsi, dan kunci
 * jawabannya. Alasannya kunci jawaban — menyimpan soal terpisah dari opsinya
 * membuka celah kunci menunjuk opsi yang sudah tidak ada. Disimpan sekaligus,
 * soal dan opsinya selalu konsisten.
 *
 * Medan form dinamai `soal.<n>.pertanyaan`, `soal.<n>.opsi.<m>`, dan
 * `soal.<n>.kunci`, lalu dibaca ulang jadi struktur di bawah ini.
 */
type SoalMasuk = { pertanyaan: string; opsi: string[]; kunci: number; pembahasan: string };

function bacaSoal(form: FormData): SoalMasuk[] {
  const nomorSoal = new Set<number>();
  for (const kunci of form.keys()) {
    const cocok = /^soal\.(\d+)\./.exec(kunci);
    if (cocok) nomorSoal.add(Number(cocok[1]));
  }

  return [...nomorSoal]
    .sort((a, b) => a - b)
    .map((n) => {
      const opsi: string[] = [];
      for (let m = 0; m < 6; m += 1) {
        const t = String(form.get(`soal.${n}.opsi.${m}`) ?? "").trim();
        if (t) opsi.push(t);
      }
      return {
        pertanyaan: String(form.get(`soal.${n}.pertanyaan`) ?? "").trim(),
        opsi,
        kunci: Number(form.get(`soal.${n}.kunci`) ?? 0),
        pembahasan: String(form.get(`soal.${n}.pembahasan`) ?? "").trim(),
      };
    })
    .filter((s) => s.pertanyaan);
}

function periksaSoal(daftar: SoalMasuk[]): string | null {
  if (daftar.length === 0) return "Kuis harus punya minimal satu soal.";

  for (const [i, s] of daftar.entries()) {
    const no = i + 1;
    if (s.opsi.length < 2) return `Soal ${no} butuh minimal dua pilihan jawaban.`;
    if (!s.pembahasan) return `Soal ${no} belum punya pembahasan.`;
    // Pembahasan bukan pelengkap: itulah yang dibaca peserta di halaman hasil
    // saat jawabannya keliru, dan satu-satunya bagian yang mengajarkan sesuatu.
    if (!Number.isInteger(s.kunci) || s.kunci < 0 || s.kunci >= s.opsi.length) {
      return `Soal ${no}: kunci jawaban menunjuk pilihan yang tidak ada.`;
    }
  }
  return null;
}

async function tulisSoal(kuisId: string, daftar: SoalMasuk[]) {
  await db.delete(skema.soal).where(eq(skema.soal.kuisId, kuisId));

  // Tiap soal butuh insertId-nya sendiri sebelum opsinya bisa disimpan —
  // itu sebabnya bukan satu INSERT borongan. Tapi antar-soal tidak saling
  // bergantung, jadi rantai insert-soal-lalu-opsi tiap soal jalan bersamaan
  // lewat Promise.all, bukan menunggu satu-satu.
  await Promise.all(
    daftar.map(async (s, urutan) => {
      const [hasil] = await db.insert(skema.soal).values({
        kuisId,
        pertanyaan: s.pertanyaan,
        kunci: s.kunci,
        pembahasan: s.pembahasan,
        urutan,
      });
      await db
        .insert(skema.opsiSoal)
        .values(s.opsi.map((teks, i) => ({ soalId: hasil.insertId, urutan: i, teks })));
    }),
  );
}

export async function simpanKuis(_sebelum: HasilAksi, form: FormData): Promise<HasilAksi> {
  const admin = await wajibAdmin();

  const idLama = teks(form, "idLama");
  const judul = teks(form, "judul");
  const topikId = teks(form, "topikId");

  if (!judul) return { galat: "Judul kuis harus diisi." };
  if (!topikId) return { galat: "Kuis harus terhubung ke satu materi." };

  const daftar = bacaSoal(form);
  const keluhan = periksaSoal(daftar);
  if (keluhan) return { galat: keluhan };

  // Satu materi satu kuis — halaman materi hanya punya satu tombol
  // "Uji pemahaman", dan halaman hasil merujuk balik ke satu materi.
  const sudahAda = await db.query.kuis.findFirst({ where: eq(skema.kuis.topikId, topikId) });
  if (sudahAda && sudahAda.id !== idLama) {
    return { galat: `Materi itu sudah punya kuis ("${sudahAda.judul}").` };
  }

  const nilai = {
    judul,
    topikId,
    urutan: angka(form, "urutan"),
    aktif: centang(form, "aktif"),
  };

  if (idLama) {
    await db.update(skema.kuis).set(nilai).where(eq(skema.kuis.id, idLama));
    await tulisSoal(idLama, daftar);
    await catatLog(admin, "ubah", "kuis", judul);
    segarkanPublik();
    return { pesan: `Kuis tersimpan — ${daftar.length} soal.` };
  }

  const id = jadikanId(`kuis ${judul}`);
  if (!id) return { galat: "Judul tidak bisa dijadikan alamat halaman." };

  const bentrok = await db.query.kuis.findFirst({ where: eq(skema.kuis.id, id) });
  if (bentrok) return { galat: `Sudah ada kuis dengan alamat "${id}". Ubah judulnya.` };

  const [terakhir] = await db.select({ n: max(skema.kuis.urutan) }).from(skema.kuis);
  await db
    .insert(skema.kuis)
    .values({ ...nilai, id, urutan: nilai.urutan || (terakhir.n ?? 0) + 1 });
  await tulisSoal(id, daftar);
  await catatLog(admin, "tambah", "kuis", judul);

  segarkanPublik();
  redirect(`/admin/kuis/${id}`);
}

export async function hapusKuis(form: FormData): Promise<void> {
  const admin = await wajibAdmin();
  const id = teks(form, "id");
  // Soal dan opsinya ikut terhapus lewat ON DELETE CASCADE di skema.
  await db.delete(skema.kuis).where(eq(skema.kuis.id, id));
  await catatLog(admin, "hapus", "kuis", id);
  segarkanPublik();
  redirect("/admin/kuis");
}
