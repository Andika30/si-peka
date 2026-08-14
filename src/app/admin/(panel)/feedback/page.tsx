import { MessageSquare } from "lucide-react";
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

      <div className="mb-6 flex items-start gap-3 rounded-kartu border border-garis bg-white p-4">
        <MessageSquare className="mt-0.5 size-5 shrink-0 text-ungu" aria-hidden />
        <p className="text-kecil text-tinta-70">
          Halaman feedback tidak menanyakan nama maupun kontak, jadi masukan di sini tidak bisa
          dibalas dan tidak bisa ditelusuri ke orangnya. Yang tersimpan hanya tulisannya.
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

      <Panel>
        {daftar.map((f) => (
          <div className="flex gap-4 border-b border-garis p-5 last:border-b-0" key={f.id}>
            <span
              className={`mt-1 size-2 shrink-0 rounded-full ${f.dibaca ? "bg-transparent" : "bg-adukan"}`}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-ungu-lembut px-2.5 py-1 font-mono text-data uppercase text-ungu">
                  {f.jenis}
                </span>
                <span className="font-mono text-data text-tinta-55">{waktuID(f.dibuat)}</span>
              </div>
              <p className="whitespace-pre-line text-isi text-tinta">{f.komentar}</p>
            </div>
            {!f.dibaca ? (
              <form action={tandaiDibaca}>
                <input name="id" type="hidden" value={f.id} />
                <button
                  className="h-9 shrink-0 rounded-tombol border border-garis bg-white px-3 text-kecil font-bold text-tinta-55 hover:bg-kertas hover:text-institusi"
                  type="submit"
                >
                  Tandai dibaca
                </button>
              </form>
            ) : null}
          </div>
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
