import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, Clock, Globe, Phone, Smartphone, Users } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Eyebrow, Halaman, Kartu, Peringatan, Tombol } from "@/components/ui";
import { ambilPenyelenggara, cariMasalah, cariTopik } from "@/lib/konten";

export default async function HasilPanduan({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = await cariMasalah(id);
  if (!m) notFound();

  const [daftarPjp, materi] = await Promise.all([
    ambilPenyelenggara(),
    cariTopik(m.materiTerkait),
  ]);
  const pjp = daftarPjp[0];

  return (
    <AppShell>
      <Halaman>
        <div className="mb-2">
          <Eyebrow warna="adukan">Panduan &middot; {m.label}</Eyebrow>
        </div>
        <h1 className="mb-2 text-display text-tinta">{m.judul}</h1>
        <p className="mb-6 text-isi text-tinta-70">{m.pembuka}</p>

        {/* Kasus mendesak diberi penanda waktu di paling atas. */}
        {m.segera ? (
          <div className="mb-6 flex items-start gap-4 rounded-tombol border-[1.5px] border-waspada bg-waspada-lembut p-5">
            <Clock className="mt-0.5 size-5 shrink-0 text-waspada" aria-hidden />
            <p className="text-isi font-bold text-tinta">{m.segera}</p>
          </div>
        ) : null}

        {/* Kasus penipuan menaruh peringatan keamanan SEBELUM langkah. */}
        {m.peringatanUtama ? <Peringatan>{m.peringatanUtama}</Peringatan> : null}

        <div className="lg:grid lg:grid-cols-5 lg:items-start lg:gap-10">
          <div className="lg:col-span-3">
            <h2 className="mb-4 text-subjudul text-tinta">Langkah yang perlu kamu ambil</h2>
            <ol className="relative mb-8 flex flex-col gap-6 pl-4">
              <div className="absolute bottom-6 left-[11px] top-6 w-px bg-garis" />
              {m.langkah.map((t, i) => (
                <li className="relative z-10 flex gap-4" key={t}>
                  <span className="flex size-6 shrink-0 items-center justify-center bg-institusi font-mono text-[10px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-isi text-tinta">{t}</span>
                </li>
              ))}
            </ol>

            {/* "Pihak yang dihubungi" adalah kolom tersendiri di dokumen —
                jadi ia tampil sebagai jawaban tersendiri, bukan terselip. */}
            <Kartu className="mb-8" nada="adukan">
              <div className="flex gap-3">
                <Users className="mt-0.5 size-5 shrink-0 text-adukan" aria-hidden />
                <div>
                  <span className="font-mono text-data uppercase text-tinta-55">
                    Pihak yang dihubungi
                  </span>
                  <p className="mt-1 text-isi font-bold text-tinta">{m.pihak}</p>
                </div>
              </div>
            </Kartu>

            {materi ? (
              <Link
                className="mb-8 flex items-center gap-3 rounded-dalam border border-garis bg-white p-4 transition-colors hover:border-adukan"
                href={`/materi/${materi.id}`}
              >
                <BookOpen className="size-5 shrink-0 text-adukan" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-data uppercase text-tinta-55">
                    Supaya tidak terulang
                  </span>
                  <span className="block text-kecil font-bold text-tinta">{materi.judul}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-tinta-55" aria-hidden />
              </Link>
            ) : null}
          </div>

          <div className="lg:col-span-2">
            <Kartu aksen="adukan" className="mb-6">
              <span className="font-mono text-data uppercase text-tinta-55">
                Kanal resmi penyelenggara
              </span>
              <h2 className="mb-4 mt-2 text-judul text-tinta">{pjp.nama}</h2>
              <div className="flex flex-col">
                {[
                  { Ikon: Phone, teks: pjp.telepon },
                  { Ikon: Smartphone, teks: pjp.aplikasi },
                  { Ikon: Globe, teks: pjp.situs },
                ].map(({ Ikon, teks }, i) => (
                  <span
                    className={`flex items-center gap-4 py-4 ${i < 2 ? "border-b border-garis" : ""}`}
                    key={teks}
                  >
                    <Ikon className="size-5 text-adukan" aria-hidden />
                    <span className="text-isi text-tinta">{teks}</span>
                  </span>
                ))}
              </div>
              <div className="mt-4 border-t border-garis pt-4">
                {/* Nomor dan tautan kanal resmi berubah. Kolom ini yang
                    membuat kebasian datanya terlihat, bukan tersembunyi. */}
                <span className="font-mono text-data uppercase text-tinta-55">
                  Diverifikasi terakhir {pjp.diverifikasi}
                </span>
              </div>
            </Kartu>

            {!m.peringatanUtama ? (
              <Peringatan>
                Jangan pernah memberikan PIN, password, atau OTP kepada siapa pun.
              </Peringatan>
            ) : null}

            {/* Jalur BI hanya menonjol kalau kasusnya memang sudah melewati
                penyelenggara. Selebihnya cuma tautan tenang di bawah. */}
            {m.eskalasiBI ? (
              <div className="mb-6 rounded-kartu border border-garis border-l-4 border-l-institusi bg-white/60 p-5">
                <span className="font-mono text-data uppercase text-tinta-55">
                  Langkah berikutnya
                </span>
                <h2 className="mb-2 mt-2 text-subjudul text-tinta">
                  Jalur Bank Indonesia terbuka untuk kasusmu
                </h2>
                <p className="mb-4 text-isi text-tinta-70">
                  Periksa dulu syaratnya sebelum menghubungi.
                </p>
                <Tombol href="/panduan/eskalasi">Lihat syarat eskalasi</Tombol>
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              <Tombol href="/panduan/penyelenggara" jenis="garis">
                Lihat penyelenggara berizin
              </Tombol>
              <Tombol href="/panduan/kanal" jenis="garis">
                Lihat kanal resmi
              </Tombol>
              {!m.eskalasiBI ? (
                <Tombol href="/panduan/eskalasi" jenis="teks">
                  Informasi pengaduan Bank Indonesia
                </Tombol>
              ) : null}
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-kecil text-tinta-55">
          Sumber: {m.sumber}. Aplikasi ini tidak menerima laporan dan tidak menyimpan data aduanmu.
        </p>
      </Halaman>
    </AppShell>
  );
}
