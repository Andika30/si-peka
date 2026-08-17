import { Terminal } from "lucide-react";
import { asc } from "drizzle-orm";
import { db, skema } from "@/db";
import { Lencana, Panel } from "@/components/admin/ui";
import { adminSaatIni } from "@/lib/admin/sesi";
import { FormNama, FormSandi } from "./Formulir";

const waktuID = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "belum pernah";

export default async function PengaturanAkun() {
  const saya = await adminSaatIni();
  const semua = await db.query.admin.findMany({ orderBy: [asc(skema.admin.id)] });

  return (
    <>
      <div className="mb-6">
        <h2 className="text-display text-tinta">Pengaturan akun</h2>
        <p className="mt-1 text-isi text-tinta-70">
          Masuk sebagai <strong className="text-tinta">{saya?.pengguna}</strong>.
        </p>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <FormNama nama={saya?.nama ?? ""} />
        <FormSandi />
      </div>

      <h3 className="mb-3 text-subjudul text-tinta">Semua pengelola</h3>
      <div className="mb-4">
        <Panel>
          {semua.map((a) => (
            <div className="flex items-center gap-4 border-b border-garis p-4 last:border-b-0" key={a.id}>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-isi font-bold text-tinta">
                  {a.nama}
                </span>
                <span className="block truncate text-kecil text-tinta-55">
                  {a.pengguna} &middot; terakhir masuk {waktuID(a.terakhirMasuk)}
                </span>
              </span>
              <Lencana aktif={a.aktif} />
            </div>
          ))}
        </Panel>
      </div>
    </>
  );
}
