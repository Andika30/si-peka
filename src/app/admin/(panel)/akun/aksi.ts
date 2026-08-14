"use server";

import { eq } from "drizzle-orm";
import { db, skema } from "@/db";
import { cocokSandi, hashSandi, periksaSandi } from "@/lib/admin/sandi";
import { wajibAdmin, type HasilAksi } from "@/lib/admin/jaga";
import { akhiriSesi } from "@/lib/admin/sesi";
import { redirect } from "next/navigation";

export async function gantiSandi(_sebelum: HasilAksi, form: FormData): Promise<HasilAksi> {
  const admin = await wajibAdmin();

  const lama = String(form.get("lama") ?? "");
  const baru = String(form.get("baru") ?? "");
  const ulang = String(form.get("ulang") ?? "");

  if (baru !== ulang) return { galat: "Kata sandi baru dan ulangannya tidak sama." };

  const keluhan = periksaSandi(baru);
  if (keluhan) return { galat: keluhan };

  const baris = await db.query.admin.findFirst({ where: eq(skema.admin.id, admin.id) });
  if (!baris) return { galat: "Akun tidak ditemukan." };

  // Sandi lama tetap diminta walaupun sesinya sudah sah — supaya perangkat
  // yang ditinggal terbuka tidak bisa dipakai mengambil alih akunnya.
  if (!(await cocokSandi(lama, baris.sandi))) {
    return { galat: "Kata sandi lama tidak cocok." };
  }

  await db
    .update(skema.admin)
    .set({ sandi: await hashSandi(baru) })
    .where(eq(skema.admin.id, admin.id));

  // Sesi diakhiri supaya pemiliknya masuk ulang dengan sandi barunya.
  await akhiriSesi();
  redirect("/admin/masuk");
}

export async function gantiNama(_sebelum: HasilAksi, form: FormData): Promise<HasilAksi> {
  const admin = await wajibAdmin();
  const nama = String(form.get("nama") ?? "").trim();
  if (!nama) return { galat: "Nama tidak boleh kosong." };

  await db.update(skema.admin).set({ nama }).where(eq(skema.admin.id, admin.id));
  return { pesan: "Nama tersimpan." };
}
