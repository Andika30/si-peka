import { notFound } from "next/navigation";
import { Clock, Globe, Phone, Smartphone } from "lucide-react";
import Nav from "@/components/Nav";
import { Eyebrow, Halaman, Kartu, Peringatan, Tombol } from "@/components/dasar";
import { cariKasus, kasus, penyelenggara } from "@/lib/konten";

export function generateStaticParams() {
  return kasus.map((k) => ({ kasus: k.id }));
}

export default async function HasilAdukan({ params }: { params: Promise<{ kasus: string }> }) {
  const { kasus: id } = await params;
  const k = cariKasus(id);
  if (!k) notFound();

  const pjp = penyelenggara[0];

  return (
    <>
      <Nav />
      <Halaman>
        <div className="mb-2">
          <Eyebrow warna="adukan">Adukan &middot; Hasil</Eyebrow>
        </div>
        <h1 className="mb-2 text-display text-tinta">{k.judul}</h1>
        <p className="mb-6 text-isi text-tinta-70">{k.pembuka}</p>

        {/* Kasus mendesak diberi penanda waktu di paling atas. */}
        {k.segera ? (
          <div className="mb-6 flex items-start gap-4 rounded-tombol border-[1.5px] border-waspada bg-waspada-lembut p-5">
            <Clock className="mt-0.5 size-5 shrink-0 text-waspada" aria-hidden />
            <p className="text-isi font-bold text-tinta">{k.segera}</p>
          </div>
        ) : null}

        {/* Kasus penipuan menaruh peringatan keamanan SEBELUM langkah. */}
        {k.peringatanUtama ? <Peringatan>{k.peringatanUtama}</Peringatan> : null}

        <div className="lg:grid lg:grid-cols-5 lg:items-start lg:gap-10">
          <div className="lg:col-span-3">
            <ol className="relative mb-10 flex flex-col gap-6 pl-4">
              <div className="absolute bottom-6 left-[11px] top-6 w-px bg-garis" />
              {k.langkah.map((t, i) => (
                <li className="relative z-10 flex gap-4" key={t}>
                  <span className="flex size-6 shrink-0 items-center justify-center bg-institusi font-mono text-[10px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-isi text-tinta">{t}</span>
                </li>
              ))}
            </ol>
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

            {!k.peringatanUtama ? (
              <Peringatan>
                Jangan pernah memberikan PIN, password, atau OTP kepada siapa pun.
              </Peringatan>
            ) : null}

            {/* Jalur BI hanya menonjol kalau kasusnya memang sudah melewati
                penyelenggara. Selebihnya cuma tautan tenang di bawah. */}
            {k.eskalasiBI ? (
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
                <Tombol href="/adukan/eskalasi">Lihat syarat eskalasi</Tombol>
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              <Tombol href="/adukan/penyelenggara" jenis="garis">
                Lihat penyelenggara berizin
              </Tombol>
              <Tombol href="/adukan/kanal" jenis="garis">
                Lihat kanal resmi
              </Tombol>
              {!k.eskalasiBI ? (
                <Tombol href="/adukan/eskalasi" jenis="teks">
                  Informasi pengaduan Bank Indonesia
                </Tombol>
              ) : null}
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-kecil text-tinta-70">
          PeKA tidak menerima laporan dan tidak menyimpan data aduanmu. Kami menunjukkan ke mana
          kamu harus pergi.
        </p>
      </Halaman>
    </>
  );
}
