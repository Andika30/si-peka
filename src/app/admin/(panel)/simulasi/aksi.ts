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
 * Satu skenario disimpan sekaligus dengan konteks dan pilihannya — sama
 * seperti kuis, sebab penanda "aman" pada pilihan tidak boleh terlepas dari
 * daftar pilihannya.
 */
type OpsiMasuk = { teks: string; aman: boolean; konsekuensi: string };

function bacaOpsi(form: FormData): OpsiMasuk[] {
  const amanKe = Number(form.get("aman") ?? -1);
  const hasil: OpsiMasuk[] = [];

  for (let i = 0; i < 6; i += 1) {
    const t = String(form.get(`opsi.${i}.teks`) ?? "").trim();
    if (!t) continue;
    hasil.push({
      teks: t,
      aman: i === amanKe,
      konsekuensi: String(form.get(`opsi.${i}.konsekuensi`) ?? "").trim(),
    });
  }
  return hasil;
}

function bacaKonteks(form: FormData): { label: string; nilai: string }[] {
  const hasil: { label: string; nilai: string }[] = [];
  for (let i = 0; i < 5; i += 1) {
    const label = String(form.get(`konteks.${i}.label`) ?? "").trim();
    const nilai = String(form.get(`konteks.${i}.nilai`) ?? "").trim();
    if (label && nilai) hasil.push({ label, nilai });
  }
  return hasil;
}

export async function simpanSkenario(_sebelum: HasilAksi, form: FormData): Promise<HasilAksi> {
  const admin = await wajibAdmin();

  const idLama = teks(form, "idLama");
  const situasi = teks(form, "situasi");
  const alasan = teks(form, "alasan");
  const konteks = bacaKonteks(form);
  const opsi = bacaOpsi(form);

  if (!situasi) return { galat: "Pertanyaan situasi harus diisi." };
  if (!alasan) return { galat: "Penjelasan langkah yang aman harus diisi." };
  if (konteks.length === 0) return { galat: "Isi minimal satu baris kartu konteks." };
  if (opsi.length < 2) return { galat: "Skenario butuh minimal dua pilihan tindakan." };

  const jumlahAman = opsi.filter((o) => o.aman).length;
  if (jumlahAman !== 1) {
    return { galat: "Tandai tepat satu pilihan sebagai tindakan yang aman." };
  }

  // Pilihan keliru tanpa konsekuensi akan langsung melompat ke penjelasan,
  // dan simulasinya kehilangan bagian yang membuatnya terasa nyata.
  const tanpaKonsekuensi = opsi.findIndex((o) => !o.aman && !o.konsekuensi);
  if (tanpaKonsekuensi !== -1) {
    return {
      galat: `Pilihan ${tanpaKonsekuensi + 1} keliru tapi belum punya konsekuensi. Tulis apa yang terjadi kalau peserta memilihnya.`,
    };
  }

  const nilai = { situasi, alasan, urutan: angka(form, "urutan"), aktif: centang(form, "aktif") };

  const id = idLama || jadikanId(teks(form, "nama") || situasi.slice(0, 40));
  if (!id) return { galat: "Nama skenario tidak bisa dijadikan alamat." };

  if (!idLama) {
    const bentrok = await db.query.skenario.findFirst({ where: eq(skema.skenario.id, id) });
    if (bentrok) return { galat: `Sudah ada skenario dengan alamat "${id}".` };

    const [terakhir] = await db.select({ n: max(skema.skenario.urutan) }).from(skema.skenario);
    await db
      .insert(skema.skenario)
      .values({ ...nilai, id, urutan: nilai.urutan || (terakhir.n ?? 0) + 1 });
  } else {
    await db.update(skema.skenario).set(nilai).where(eq(skema.skenario.id, id));
  }

  await db.delete(skema.konteksSkenario).where(eq(skema.konteksSkenario.skenarioId, id));
  await db.delete(skema.opsiSkenario).where(eq(skema.opsiSkenario.skenarioId, id));

  await db
    .insert(skema.konteksSkenario)
    .values(konteks.map((k, i) => ({ skenarioId: id, urutan: i, ...k })));
  await db.insert(skema.opsiSkenario).values(
    opsi.map((o, i) => ({
      skenarioId: id,
      urutan: i,
      teks: o.teks,
      aman: o.aman,
      konsekuensi: o.aman ? null : o.konsekuensi,
    })),
  );

  await catatLog(admin, idLama ? "ubah" : "tambah", "simulasi", situasi.slice(0, 80));

  segarkanPublik();
  if (!idLama) redirect(`/admin/simulasi/${id}`);
  return { pesan: "Skenario tersimpan." };
}

export async function hapusSkenario(form: FormData): Promise<void> {
  const admin = await wajibAdmin();
  const id = teks(form, "id");
  await db.delete(skema.skenario).where(eq(skema.skenario.id, id));
  await catatLog(admin, "hapus", "simulasi", id);
  segarkanPublik();
  redirect("/admin/simulasi");
}
