import { readFile } from "node:fs/promises";
import path from "node:path";
import { DIR_UNGGAHAN, MIME, namaSah } from "@/lib/admin/gambar";

/**
 * Menyajikan gambar unggahan.
 *
 * Namanya diperiksa dengan pola ketat lebih dulu — hanya `<uuid>.<ext>` yang
 * lolos. Tanpa itu, nama seperti `../../.env.local` akan berubah jadi jalur
 * ke berkas lain di komputer. Memeriksa polanya lebih aman daripada mencoba
 * membersihkan nama yang mencurigakan.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ nama: string }> }) {
  const { nama } = await ctx.params;
  if (!namaSah(nama)) return new Response("Tidak ditemukan", { status: 404 });

  try {
    const isi = await readFile(path.join(DIR_UNGGAHAN, nama));
    const ext = nama.split(".").pop() ?? "";

    return new Response(new Uint8Array(isi), {
      headers: {
        "content-type": MIME[ext] ?? "application/octet-stream",
        // Nama berkas mengandung UUID dan tidak pernah dipakai ulang, jadi
        // isinya tidak mungkin berubah — aman disimpan lama di cache.
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Tidak ditemukan", { status: 404 });
  }
}
