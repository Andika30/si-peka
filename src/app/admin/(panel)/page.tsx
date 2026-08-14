import Link from "next/link";
import {
  BookOpen,
  Gamepad2,
  LifeBuoy,
  ListChecks,
  MessageSquare,
  ScrollText,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { count, desc, eq } from "drizzle-orm";
import { db, skema } from "@/db";
import GrafikAktivitas from "@/components/admin/GrafikAktivitas";
import { ambilLog } from "@/lib/admin/log";
import {
  deretAktivitas,
  materiTerbanyak,
  performaKuis,
  skenarioPopuler,
  totalPeristiwa,
} from "@/lib/statistik";

const waktuID = (iso: string) =>
  new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const IKON_LOG = {
  materi: BookOpen,
  kuis: ListChecks,
  simulasi: Gamepad2,
  panduan: LifeBuoy,
} as const;

async function hitungAktif(
  tabel: typeof skema.topik | typeof skema.kuis | typeof skema.skenario | typeof skema.masalah,
) {
  const [r] = await db.select({ n: count() }).from(tabel).where(eq(tabel.aktif, true));
  return r.n;
}

export default async function Dasbor() {
  const [
    jumlahMateri,
    jumlahKuis,
    materiDibuka,
    kuisSelesai,
    simulasiSelesai,
    panduanDibuka,
    deret,
    topMateri,
    kuisStat,
    skenarioStat,
    feedbackBaru,
    log,
  ] = await Promise.all([
    hitungAktif(skema.topik),
    hitungAktif(skema.kuis),
    totalPeristiwa("materi_dibuka"),
    totalPeristiwa("kuis_selesai"),
    totalPeristiwa("simulasi_selesai"),
    totalPeristiwa("panduan_dibuka"),
    deretAktivitas(7),
    materiTerbanyak(5),
    performaKuis(),
    skenarioPopuler(5),
    db.query.feedback.findMany({ orderBy: [desc(skema.feedback.dibuat)], limit: 4 }),
    ambilLog(6),
  ]);

  const KARTU = [
    {
      label: "Materi aktif",
      nilai: jumlahMateri,
      Ikon: BookOpen,
      kelas: "bg-adukan-lembut text-adukan",
      href: "/admin/materi",
    },
    {
      label: "Kuis aktif",
      nilai: jumlahKuis,
      Ikon: ListChecks,
      kelas: "bg-peduli-lembut text-peduli",
      href: "/admin/kuis",
    },
    {
      label: "Materi dibuka",
      nilai: materiDibuka,
      Ikon: BookOpen,
      kelas: "bg-adukan-lembut text-adukan",
      href: "/admin/materi",
    },
    {
      label: "Kuis dikerjakan",
      nilai: kuisSelesai,
      Ikon: ListChecks,
      kelas: "bg-peduli-lembut text-peduli",
      href: "/admin/kuis",
    },
    {
      label: "Simulasi diikuti",
      nilai: simulasiSelesai,
      Ikon: Gamepad2,
      kelas: "bg-kenali-lembut text-kenali",
      href: "/admin/simulasi",
    },
    {
      label: "Panduan dibuka",
      nilai: panduanDibuka,
      Ikon: LifeBuoy,
      kelas: "bg-ungu-lembut text-ungu",
      href: "/admin/panduan",
    },
  ];

  const belumAdaData = materiDibuka + kuisSelesai + simulasiSelesai === 0;

  return (
    <>
      <div className="mb-6">
        <h2 className="text-display text-tinta">Ringkasan</h2>
        <p className="mt-1 text-isi text-tinta-70">
          Isi yang dikelola dan bagaimana aplikasinya dipakai.
        </p>
      </div>

      {/* Batas yang dipegang aplikasi ini ditulis di layar pengelolanya
          sendiri, supaya tidak ada yang keliru mengira angka di bawah bisa
          ditelusuri sampai ke orangnya. */}
      <div className="mb-6 flex items-start gap-3 rounded-kartu border border-garis bg-white p-4">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-peduli" aria-hidden />
        <p className="text-kecil text-tinta-70">
          Semua angka pemakaian di halaman ini <strong className="text-tinta">anonim</strong> —
          penghitung harian tanpa id pengguna, id perangkat, maupun alamat IP. Dasbor bisa menjawab
          materi mana yang paling dibuka, tapi tidak bisa menjawab berapa orang yang memakainya:
          itu perlu menandai perangkat, dan aplikasi ini tidak melakukannya.
        </p>
      </div>

      {/* Enam kartu sejajar begitu layarnya muat — angka pemakaian paling
          berguna kalau bisa dibandingkan sekali lihat, bukan sambil menggulir. */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {KARTU.map(({ label, nilai, Ikon, kelas, href }) => (
          <Link
            className="flex items-center gap-3 rounded-kartu border border-garis bg-white p-4 transition-colors hover:border-adukan"
            href={href}
            key={label}
          >
            <span className={`grid size-11 shrink-0 place-content-center rounded-dalam ${kelas}`}>
              <Ikon className="size-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-kecil text-tinta-55">{label}</span>
              <span className="block text-judul font-extrabold text-tinta">
                {nilai.toLocaleString("id-ID")}
              </span>
            </span>
          </Link>
        ))}
      </div>

      {belumAdaData ? (
        <div className="mb-6 flex items-start gap-3 rounded-kartu border border-kenali/30 bg-kenali-lembut p-4">
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-kenali" aria-hidden />
          <p className="text-kecil text-tinta-70">
            Belum ada pemakaian yang tercatat. Angka mulai terisi begitu ada yang membuka materi,
            mengerjakan kuis, atau mencoba simulasi.
          </p>
        </div>
      ) : null}

      <div className="mb-6 grid gap-4 xl:grid-cols-3">
        <div className="rounded-kartu border border-garis bg-white p-5 xl:col-span-2">
          <h3 className="mb-4 text-subjudul text-tinta">Aktivitas 7 hari terakhir</h3>
          <GrafikAktivitas deret={deret} />
        </div>

        <div className="rounded-kartu border border-garis bg-white p-5">
          <h3 className="mb-4 text-subjudul text-tinta">Materi paling sering dibuka</h3>
          {topMateri.length === 0 ? (
            <p className="text-kecil text-tinta-55">Belum ada yang tercatat.</p>
          ) : (
            <ol className="flex flex-col gap-3">
              {topMateri.map((m, i) => {
                const persen = (Number(m.jumlah) / Number(topMateri[0].jumlah)) * 100;
                return (
                  <li className="flex items-center gap-3" key={m.id}>
                    <span className="grid size-6 shrink-0 place-content-center rounded-md bg-kertas-tua font-mono text-[10px] font-semibold text-tinta-55">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-kecil font-bold text-tinta">
                        {m.judul}
                      </span>
                      <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-kertas-tua">
                        <span
                          className="block h-full rounded-full bg-adukan"
                          style={{ width: `${persen}%` }}
                        />
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-data text-tinta-55">{m.jumlah}</span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>

      <div className="mb-6 grid gap-4 xl:grid-cols-3">
        <div className="rounded-kartu border border-garis bg-white p-5">
          <h3 className="mb-4 text-subjudul text-tinta">Performa kuis</h3>
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-dalam bg-kertas p-4">
              <p className="text-display text-peduli">{kuisStat.rerata}%</p>
              <p className="mt-0.5 text-kecil text-tinta-55">Rata-rata benar</p>
            </div>
            <div className="rounded-dalam bg-kertas p-4">
              <p className="text-display text-adukan">{kuisStat.dikerjakan}</p>
              <p className="mt-0.5 text-kecil text-tinta-55">Kuis dikerjakan</p>
            </div>
          </div>

          <p className="mb-2 text-kecil font-bold text-tinta">Soal paling sering salah</p>
          {kuisStat.seringSalah.length === 0 ? (
            <p className="text-kecil text-tinta-55">
              Butuh minimal 3 jawaban per soal sebelum layak dibandingkan.
            </p>
          ) : (
            <ol className="flex flex-col gap-2">
              {kuisStat.seringSalah.map((s) => (
                <li className="flex items-start gap-3" key={s.pertanyaan}>
                  <span className="min-w-0 flex-1 text-kecil text-tinta-70">{s.pertanyaan}</span>
                  <span className="shrink-0 font-mono text-data font-bold text-waspada">
                    {s.persen}%
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="rounded-kartu border border-garis bg-white p-5">
          <h3 className="mb-1 text-subjudul text-tinta">Skenario simulasi</h3>
          <p className="mb-4 text-kecil text-tinta-55">
            Angka rendah menandai modus yang paling belum dikenali.
          </p>
          {skenarioStat.length === 0 ? (
            <p className="text-kecil text-tinta-55">Belum ada yang tercatat.</p>
          ) : (
            <ol className="flex flex-col gap-3">
              {skenarioStat.map((s) => (
                <li key={s.id}>
                  <p className="mb-1 truncate text-kecil text-tinta">{s.situasi.slice(0, 60)}…</p>
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-kertas-tua">
                      <span
                        className="block h-full rounded-full bg-peduli"
                        style={{ width: `${s.persen}%` }}
                      />
                    </span>
                    <span className="shrink-0 font-mono text-data text-tinta-55">
                      {s.persen}% aman
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="rounded-kartu border border-garis bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-subjudul text-tinta">Feedback terbaru</h3>
            <Link className="text-kecil font-bold text-adukan" href="/admin/feedback">
              Lihat semua
            </Link>
          </div>
          {feedbackBaru.length === 0 ? (
            <p className="text-kecil text-tinta-55">Belum ada masukan.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {feedbackBaru.map((f) => (
                <li className="flex gap-3" key={f.id}>
                  <MessageSquare className="mt-0.5 size-4 shrink-0 text-ungu" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="rounded-full bg-ungu-lembut px-2 py-0.5 font-mono text-data uppercase text-ungu">
                        {f.jenis}
                      </span>
                      <span className="font-mono text-data text-tinta-55">{waktuID(f.dibuat)}</span>
                    </span>
                    <span className="mt-1 block text-kecil text-tinta-70">{f.komentar}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-kartu border border-garis bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-subjudul text-tinta">Aktivitas pengelola</h3>
          <Link className="text-kecil font-bold text-adukan" href="/admin/log">
            Lihat semua
          </Link>
        </div>
        {log.length === 0 ? (
          <p className="text-kecil text-tinta-55">Belum ada perubahan tercatat.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {log.map((l) => {
              const Ikon = IKON_LOG[l.jenis as keyof typeof IKON_LOG] ?? ScrollText;
              return (
                <li className="flex items-start gap-3" key={l.id}>
                  <span className="grid size-8 shrink-0 place-content-center rounded-dalam bg-kertas">
                    <Ikon className="size-4 text-tinta-55" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-kecil text-tinta">
                      <strong>{l.namaAdmin}</strong> {l.aksi} {l.jenis}
                    </span>
                    <span className="block truncate text-kecil text-tinta-55">{l.sasaran}</span>
                  </span>
                  <span className="shrink-0 font-mono text-data text-tinta-55">
                    {waktuID(l.waktu)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
