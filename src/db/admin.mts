/**
 * Membuat atau mengganti akun pengelola.
 *
 *   npm run db:admin -- <pengguna> <"Nama Lengkap"> <kata-sandi>
 *
 * Kalau penggunanya sudah ada, kata sandi dan namanya diperbarui — jadi skrip
 * ini juga cara mengatur ulang sandi yang lupa.
 *
 * Kata sandi diminta lewat argumen, bukan ditanam di berkas. Ia akan tercatat
 * di riwayat terminal, jadi untuk akun sungguhan: buat sandi di sini, lalu
 * ganti sendiri lewat panel admin setelah masuk pertama kali.
 */
import { createRequire } from "node:module";

const { loadEnvConfig } = createRequire(import.meta.url)("@next/env") as {
  loadEnvConfig: (dir: string) => void;
};
loadEnvConfig(process.cwd());

const { db, kolam, skema } = await import("./index");
const { hashSandi, periksaSandi } = await import("../lib/admin/sandi");
const { eq } = await import("drizzle-orm");

const [pengguna, nama, sandi] = process.argv.slice(2);

if (!pengguna || !nama || !sandi) {
  console.error('Pemakaian: npm run db:admin -- <pengguna> "<Nama Lengkap>" <kata-sandi>');
  process.exit(1);
}

const keluhan = periksaSandi(sandi);
if (keluhan) {
  console.error(keluhan);
  process.exit(1);
}

try {
  const hash = await hashSandi(sandi);
  const ada = await db.query.admin.findFirst({ where: eq(skema.admin.pengguna, pengguna) });

  if (ada) {
    await db
      .update(skema.admin)
      .set({ nama, sandi: hash, aktif: true })
      .where(eq(skema.admin.id, ada.id));
    console.log(`Akun "${pengguna}" diperbarui.`);
  } else {
    await db.insert(skema.admin).values({
      nama,
      pengguna,
      sandi: hash,
      aktif: true,
      dibuat: new Date().toISOString(),
    });
    console.log(`Akun "${pengguna}" dibuat.`);
  }
  console.log("Masuk lewat /admin/masuk");
} catch (galat) {
  console.error("Gagal:", galat);
  process.exitCode = 1;
} finally {
  await kolam.end();
}
