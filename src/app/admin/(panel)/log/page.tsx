import { BookOpen, Gamepad2, LifeBuoy, ListChecks, LogIn, ScrollText } from "lucide-react";
import { Panel } from "@/components/admin/ui";
import { ambilLog } from "@/lib/admin/log";

const waktuID = (iso: string) =>
  new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const IKON = {
  materi: BookOpen,
  kuis: ListChecks,
  simulasi: Gamepad2,
  panduan: LifeBuoy,
  sesi: LogIn,
} as const;

const WARNA_AKSI = {
  tambah: "bg-peduli-lembut text-peduli",
  ubah: "bg-adukan-lembut text-adukan",
  hapus: "bg-waspada-lembut text-waspada",
  masuk: "bg-kertas-tua text-tinta-55",
} as const;

export default async function LogAktivitas() {
  const log = await ambilLog(200);

  return (
    <>
      <div className="mb-6">
        <h2 className="text-display text-tinta">Log aktivitas</h2>
        <p className="mt-1 text-isi text-tinta-70">
          Jejak perubahan isi oleh pengelola. Berbeda dari angka pemakaian yang anonim, di sini
          identitas memang dicatat — kalau materi berubah, harus jelas siapa yang mengubahnya.
        </p>
      </div>

      <Panel>
        {log.map((l) => {
          const Ikon = IKON[l.jenis as keyof typeof IKON] ?? ScrollText;
          return (
            <div className="flex items-start gap-4 border-b border-garis p-4 last:border-b-0" key={l.id}>
              <span className="grid size-9 shrink-0 place-content-center rounded-dalam bg-kertas">
                <Ikon className="size-4 text-tinta-55" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-kecil font-bold text-tinta">{l.namaAdmin}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-data uppercase ${
                      WARNA_AKSI[l.aksi] ?? "bg-kertas-tua text-tinta-55"
                    }`}
                  >
                    {l.aksi}
                  </span>
                  <span className="font-mono text-data uppercase text-tinta-55">{l.jenis}</span>
                </div>
                <p className="mt-0.5 truncate text-kecil text-tinta-70">{l.sasaran}</p>
              </div>
              <span className="shrink-0 font-mono text-data text-tinta-55">{waktuID(l.waktu)}</span>
            </div>
          );
        })}

        {log.length === 0 ? (
          <p className="px-5 py-12 text-center text-isi text-tinta-55">
            Belum ada perubahan tercatat.
          </p>
        ) : null}
      </Panel>
    </>
  );
}
