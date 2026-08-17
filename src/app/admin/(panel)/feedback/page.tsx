import { ChevronDown, MessageSquare } from "lucide-react";
import { desc, eq, sql } from "drizzle-orm";
import { db, skema } from "@/db";
import { Panel } from "@/components/admin/ui";
import { wajibAdmin, segarkanPublik } from "@/lib/admin/jaga";

const waktuID = (iso: string) =>
  new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

async function tandaiDibaca(form: FormData) {
  "use server";
  await wajibAdmin();
  const id = Number(form.get("id"));
  if (!Number.isInteger(id)) return;
  await db.update(skema.feedback).set({ dibaca: true }).where(eq(skema.feedback.id, id));
  segarkanPublik();
}

export default async function DaftarFeedback() {
  const [daftar, ringkas] = await Promise.all([
    db.query.feedback.findMany({ orderBy: [desc(skema.feedback.dibuat)], limit: 200 }),
    db
      .select({ jenis: skema.feedback.jenis, n: sql<number>`COUNT(*)` })
      .from(skema.feedback)
      .groupBy(skema.feedback.jenis),
  ]);

  const belumDibaca = daftar.filter((f) => !f.dibaca).length;

  return (
    <>
      <div className="mb-6">
        <h2 className="text-display text-tinta">Feedback</h2>
        <p className="mt-1 text-isi text-tinta-70">
          {daftar.length} masukan, {belumDibaca} belum dibaca.
        </p>
      </div>

      {ringkas.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {ringkas.map((r) => (
            <span
              className="rounded-full border border-garis bg-white px-3 py-1.5 text-kecil text-tinta-70"
              key={r.jenis}
            >
              {r.jenis} <strong className="text-tinta">{r.n}</strong>
            </span>
          ))}
        </div>
      ) : null}

      {/* Disusun seperti daftar pesan: sebaris per masukan, isinya dibuka saat
          diklik. Memakai <details> bawaan peramban — tidak perlu JavaScript,
          dan tetap bisa dibuka walau skripnya gagal dimuat. */}
      <Panel>
        {daftar.map((f) => (
          <details className="group border-b border-garis last:border-b-0" key={f.id}>
            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 transition-colors hover:bg-kertas [&::-webkit-details-marker]:hidden">
              <span
                aria-hidden
                className={`size-2 shrink-0 rounded-full ${f.dibaca ? "bg-transparent" : "bg-adukan"}`}
              />
              <span className="w-24 shrink-0 truncate rounded-full bg-ungu-lembut px-2.5 py-1 text-center font-mono text-data uppercase text-ungu">
                {f.jenis}
              </span>

              {/* Sebaris cuplikan supaya bisa disaring dengan mata sebelum
                  dibuka. Utuhnya menunggu sampai memang dibutuhkan. */}
              <span
                className={`min-w-0 flex-1 truncate text-isi ${
                  f.dibaca ? "text-tinta-70" : "font-bold text-tinta"
                }`}
              >
                {f.komentar}
              </span>

              <span className="hidden shrink-0 font-mono text-data text-tinta-55 sm:inline">
                {waktuID(f.dibuat)}
              </span>
              <ChevronDown
                aria-hidden
                className="size-4 shrink-0 text-tinta-55 transition-transform group-open:rotate-180"
              />
            </summary>

            <div className="border-t border-garis bg-kertas/60 px-4 py-4 pl-[4.75rem]">
              <p className="whitespace-pre-line text-isi text-tinta">{f.komentar}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="font-mono text-data text-tinta-55 sm:hidden">
                  {waktuID(f.dibuat)}
                </span>
                {!f.dibaca ? (
                  <form action={tandaiDibaca}>
                    <input name="id" type="hidden" value={f.id} />
                    <button
                      className="h-9 rounded-tombol border border-garis bg-white px-3 text-kecil font-bold text-tinta-55 hover:bg-kertas hover:text-institusi"
                      type="submit"
                    >
                      Tandai dibaca
                    </button>
                  </form>
                ) : (
                  <span className="font-mono text-data uppercase text-peduli">Sudah dibaca</span>
                )}
              </div>
            </div>
          </details>
        ))}

        {daftar.length === 0 ? (
          <p className="px-5 py-12 text-center text-isi text-tinta-55">
            Belum ada masukan yang masuk.
          </p>
        ) : null}
      </Panel>
    </>
  );
}
