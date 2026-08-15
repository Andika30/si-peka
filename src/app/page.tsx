import Link from "next/link";
import { ArrowRight, Ban, BookOpen, Gamepad2, LifeBuoy, LogIn } from "lucide-react";
import Ilustrasi from "@/components/Ilustrasi";
import { Anak, Berurutan, Muncul } from "@/components/gerak";
import { Chip, Finder } from "@/components/ui";
import KartuBerita from "@/components/KartuBerita";
import {
  ambilBerita,
  ambilKategori,
  ambilKuis,
  ambilMasalah,
  ambilSkenario,
  ambilTopik,
} from "@/lib/konten";

/* Urutannya adalah alur belajar yang disarankan — tahu dulu, latih, lalu tahu
   ke mana kalau benar-benar kejadian. Kuis tidak berdiri sendiri di sini
   karena ia memang melekat pada materinya. */
const FITUR = [
  {
    Ikon: BookOpen,
    nama: "Materi & Kuis",
    warna: "adukan" as const,
    kelasTeks: "text-adukan",
    kelasIsi: "bg-adukan",
    isi: "Materi singkat per topik, disusun dari publikasi resmi Bank Indonesia. Tiap materi ditutup kuis yang jawabannya langsung dibahas.",
    kapan: "Mulai dari sini",
  },
  {
    Ikon: Gamepad2,
    nama: "Simulasi",
    warna: "kenali" as const,
    kelasTeks: "text-kenali",
    kelasIsi: "bg-kenali",
    isi: "Berlatih mengambil keputusan pada situasi transaksi yang benar-benar terjadi.",
    kapan: "Untuk membiasakan",
  },
  {
    Ikon: LifeBuoy,
    nama: "Panduan Pengaduan",
    warna: "ungu" as const,
    kelasTeks: "text-ungu",
    kelasIsi: "bg-ungu",
    isi: "Apa yang harus dilakukan dan ke mana harus mengadu — lengkap dengan kanal resminya.",
    kapan: "Kalau sudah terjadi",
  },
];

/* Judulnya diambil dari nama kategori di basis data, jadi mengganti nama
   kategori lewat admin ikut mengubah halaman depan. */
const isiAplikasi = (namaKategori: string[], jumlahMasalah: number) => [
  {
    Ikon: BookOpen,
    warna: "adukan" as const,
    kelasIsi: "bg-adukan",
    judul: namaKategori[0] ?? "Pembayaran Digital",
    isi: "Mengenal QRIS, BI-FAST, uang elektronik, dan mobile banking — apa gunanya, dan bagaimana memakainya dengan benar.",
    ilustrasi: "kartu" as const,
  },
  {
    Ikon: Gamepad2,
    warna: "peduli" as const,
    kelasIsi: "bg-peduli",
    judul: namaKategori[1] ?? "Keamanan Transaksi",
    isi: "Menjaga PIN dan OTP, mengenali tautan dan modus penipuan, serta membaca tanda transaksi yang janggal.",
    ilustrasi: "perisai" as const,
  },
  {
    Ikon: LifeBuoy,
    warna: "kenali" as const,
    kelasIsi: "bg-kenali",
    judul: `Panduan ${jumlahMasalah} jenis masalah`,
    isi: "Menunjukkan langkah dan kanal resmi yang tepat sesuai kendalamu — bukan mengarahkan semua orang ke tempat yang sama.",
    ilustrasi: "adukan" as const,
  },
];

const TIDAK = [
  "Menerima laporan masyarakat",
  "Menyimpan data pengaduan",
  "Meminta data finansial",
  "Meminta OTP atau PIN",
  "Memproses transaksi",
  "Menggantikan kanal resmi BI maupun penyelenggara",
];

export default async function Depan() {
  const [kategori, topik, kuis, skenario, masalah, berita] = await Promise.all([
    ambilKategori(),
    ambilTopik(),
    ambilKuis(),
    ambilSkenario(),
    ambilMasalah(),
    ambilBerita(3),
  ]);

  // Angka nyata, diambil dari basis data — bukan klaim pemasaran.
  const ANGKA = [
    { n: topik.length, l: "materi singkat" },
    { n: kuis.length, l: "kuis per topik" },
    { n: skenario.length, l: "skenario simulasi" },
    { n: masalah.length, l: "jenis masalah" },
  ];
  const ISI_APLIKASI = isiAplikasi(
    kategori.map((k) => k.nama),
    masalah.length,
  );

  return (
    <main>
      {/* ─── Kepala ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden gradien-merek">
        <div aria-hidden className="absolute inset-0 pola-finder opacity-70" />
        {/* Cahaya lembut di belakang ilustrasi memberi kedalaman tanpa gambar
            tambahan — bidang gelap yang rata terbaca murah. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 top-0 size-[34rem] rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-8 lg:pb-20 lg:pt-20">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
            <div className="flex-1">
              <div className="mb-7 flex items-center gap-3">
                <span className="grid size-11 place-content-center rounded-dalam bg-white/15 ring-1 ring-white/25 backdrop-blur">
                  <span className="grid grid-cols-2 gap-1" aria-hidden>
                    <Finder className="size-3" warna="putih" />
                    <Finder className="size-3" warna="putih" />
                    <Finder className="size-3" warna="putih" />
                    <span className="size-3" />
                  </span>
                </span>
                <span className="text-judul text-white">PeKA</span>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 font-mono text-data uppercase text-white/80 ring-1 ring-white/20">
                <span aria-hidden className="size-1.5 rounded-full bg-white" />
                Kantor Perwakilan BI Provinsi Sulawesi Tenggara
              </span>

              <h1 className="mt-5 max-w-2xl text-[2.25rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Aman bertransaksi
                <br />
                dimulai dari{" "}
                <span className="relative whitespace-nowrap">
                  tahu
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-1 h-1.5 rounded-full bg-white/40"
                  />
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
                Media edukasi dan simulasi keamanan pembayaran digital untuk masyarakat Sulawesi
                Tenggara — memahami layanannya, mengenali risikonya, berlatih lewat skenario nyata,
                dan tahu persis ke mana harus mengadu.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="group inline-flex h-13 items-center justify-center gap-2 rounded-tombol bg-white px-8 py-3.5 text-sm font-bold text-institusi shadow-angkat transition-transform motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0"
                  href="/masuk"
                >
                  <LogIn className="size-4" aria-hidden />
                  Masuk untuk mulai
                </Link>
                <Link
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-tombol px-8 py-3.5 text-sm font-bold text-white ring-1 ring-white/30 transition-colors hover:bg-white/10"
                  href="/tentang"
                >
                  Tentang aplikasi
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>

              <p className="mt-5 max-w-lg text-xs leading-relaxed text-white/60">
                Tanpa kata sandi dan tanpa data pribadi — cukup nama panggilan yang tersimpan di
                perangkatmu sendiri.
              </p>
            </div>

            <div className="relative shrink-0 lg:w-[26rem]">
              <Ilustrasi className="mx-auto w-full max-w-sm" nama="merek" warna="adukan" />
            </div>
          </div>

          {/* Angka nyata, diambil dari berkas konten — bukan klaim pemasaran. */}
          <Berurutan className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ANGKA.map(({ n, l }) => (
              <Anak key={l}>
                <div className="rounded-dalam bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
                  <p className="text-3xl font-extrabold leading-none text-white">{n}</p>
                  <p className="mt-1.5 text-kecil text-white/70">{l}</p>
                </div>
              </Anak>
            ))}
          </Berurutan>
        </div>
      </section>

      {/* ─── Tiga pilar ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <Muncul className="mb-10 max-w-2xl">
          <span className="font-mono text-data uppercase text-tinta-55">Tiga kelompok fitur</span>
          <h2 className="mt-2 text-display text-tinta">Tahu, latih, lalu tahu ke mana</h2>
          <p className="mt-3 text-isi text-tinta-70">
            Tidak ada urutan wajib — kamu boleh masuk dari mana saja. Tapi ketiganya memang
            dirancang saling menyambung, dari memahami sampai tahu harus berbuat apa.
          </p>
        </Muncul>

        <Berurutan className="grid gap-4 lg:grid-cols-3">
          {FITUR.map((f, i) => (
            <Anak key={f.nama}>
              <div className="group relative h-full overflow-hidden rounded-kartu border border-garis bg-white shadow-kartu transition-shadow motion-safe:hover:shadow-angkat">
                {/* Pita warna di tepi atas — penanda cepat tanpa teks. */}
                <span aria-hidden className={`block h-1.5 w-full ${f.kelasIsi}`} />

                {/* Angka raksasa di latar menegaskan urutannya tanpa memaksa. */}
                <span aria-hidden className={`huruf-hantu ${f.kelasTeks}`}>
                  {i + 1}
                </span>

                <div className="relative p-6 lg:p-7">
                  <div className="mb-5 flex items-center gap-2.5">
                    <Finder status={i === 0 ? "selesai" : "kosong"} warna={f.warna} />
                    <span className="font-mono text-data uppercase text-tinta-55">{f.kapan}</span>
                  </div>

                  <Chip Ikon={f.Ikon} warna={f.warna} />

                  <p className={`mt-4 text-2xl font-extrabold tracking-tight ${f.kelasTeks}`}>
                    {f.nama}
                  </p>

                  <p className="mt-3 text-isi leading-relaxed text-tinta-70">{f.isi}</p>
                </div>
              </div>
            </Anak>
          ))}
        </Berurutan>
      </section>

      {/* ─── Isi aplikasi ────────────────────────────────────────────────── */}
      <section className="border-y border-garis bg-kertas-tua/40">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <Muncul className="mb-10 max-w-2xl">
            <span className="font-mono text-data uppercase text-tinta-55">Cakupan materi</span>
            <h2 className="mt-2 text-display text-tinta">Yang dibahas di dalamnya</h2>
          </Muncul>

          <Berurutan className="grid gap-4 lg:grid-cols-3">
            {ISI_APLIKASI.map(({ Ikon, warna, kelasIsi, judul, isi, ilustrasi }, i) => (
              <Anak key={judul}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-kartu border border-garis bg-white shadow-kartu transition-shadow motion-safe:hover:shadow-angkat">
                  {/* Ilustrasi ditaruh di bidang berwarna lembut yang menyentuh
                      tepi kartu — kartu jadi punya kepala, bukan sekadar kotak. */}
                  <div
                    className={`relative flex h-40 items-center justify-center ${
                      warna === "adukan"
                        ? "bg-adukan-lembut"
                        : warna === "peduli"
                          ? "bg-peduli-lembut"
                          : "bg-kenali-lembut"
                    }`}
                  >
                    <Ilustrasi
                      className="w-40 transition-transform motion-safe:group-hover:scale-105"
                      nama={ilustrasi}
                      warna={warna}
                    />
                    <span
                      aria-hidden
                      className={`absolute left-5 top-5 grid size-8 place-content-center rounded-lg font-mono text-xs font-semibold text-white ${kelasIsi}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <Chip Ikon={Ikon} warna={warna} />
                      <p className="text-subjudul text-tinta">{judul}</p>
                    </div>
                    <p className="text-isi leading-relaxed text-tinta-70">{isi}</p>
                  </div>
                </div>
              </Anak>
            ))}
          </Berurutan>
        </div>
      </section>

      {/* ─── Batasan ─────────────────────────────────────────────────────────
          Sengaja bidang gelap. Ini pernyataan kelembagaan paling penting di
          halaman ini, dan pergantian nada membuatnya tidak terbaca sebagai
          satu blok teks lagi di antara blok-blok putih. */}
      <section className="relative overflow-hidden bg-institusi">
        <div aria-hidden className="absolute inset-0 pola-finder opacity-60" />

        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-5 lg:items-center lg:gap-14">
            <Muncul className="lg:col-span-2">
              <div className="rounded-kartu bg-white/10 p-8 ring-1 ring-white/15 backdrop-blur">
                <Ilustrasi className="mx-auto w-52" nama="perisai" warna="peduli" />
              </div>
            </Muncul>

            <div className="lg:col-span-3">
              <Muncul>
                <span className="font-mono text-data uppercase text-white/60">
                  Batasan aplikasi
                </span>
                <h2 className="mt-2 text-display text-white">
                  Ini media edukasi, bukan sistem pengaduan
                </h2>
                <p className="mt-3 max-w-xl text-isi leading-relaxed text-white/75">
                  Setiap alur panduan selalu berakhir di kanal resmi pihak lain. Tidak ada satu pun
                  tombol &ldquo;kirim ke kami&rdquo;. Aplikasi ini tidak:
                </p>
              </Muncul>

              <Berurutan className="mt-7 grid gap-2.5 sm:grid-cols-2">
                {TIDAK.map((t) => (
                  <Anak key={t}>
                    <div className="flex h-full items-start gap-3 rounded-dalam bg-white/5 p-4 ring-1 ring-white/10">
                      <Ban className="mt-0.5 size-4 shrink-0 text-white/70" aria-hidden />
                      <span className="text-kecil text-white/85">{t}</span>
                    </div>
                  </Anak>
                ))}
              </Berurutan>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Berita ──────────────────────────────────────────────────────────
          Muncul hanya kalau memang ada isinya. Bagian kosong bertuliskan
          "belum ada berita" di halaman depan justru membuat aplikasinya
          tampak terbengkalai. */}
      {berita.length > 0 ? (
        <section className="border-t border-garis bg-kertas-tua/40">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
            <Muncul className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <span className="font-mono text-data uppercase text-tinta-55">Kabar terbaru</span>
                <h2 className="mt-2 text-display text-tinta">Berita &amp; pengumuman</h2>
                <p className="mt-3 text-isi text-tinta-70">
                  Modus penipuan berubah, begitu juga aturan dan kanal resminya. Kabar di sini
                  selalu mencantumkan tanggal dan sumbernya.
                </p>
              </div>
              <Link
                className="inline-flex items-center gap-2 text-kecil font-bold text-adukan"
                href="/berita"
              >
                Semua berita
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Muncul>

            <Berurutan className="grid gap-4 md:grid-cols-3">
              {berita.map((b) => (
                <Anak key={b.id}>
                  <KartuBerita b={b} />
                </Anak>
              ))}
            </Berurutan>
          </div>
        </section>
      ) : null}

      {/* ─── Ajakan penutup ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <Muncul>
          <div className="relative overflow-hidden rounded-kartu border border-garis bg-white p-8 shadow-kartu sm:p-12">
            <span
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-adukan-lembut"
            />
            <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-display text-tinta">Siap mulai?</h2>
                <p className="mt-2 max-w-xl text-isi text-tinta-70">
                  Masuk dengan nama panggilan, lalu pilih sendiri mau mulai dari mana — membaca
                  materi, langsung mengerjakan kuis, atau mencoba simulasi.
                </p>
              </div>
              <Link
                className="inline-flex h-13 shrink-0 items-center justify-center gap-2 rounded-tombol bg-adukan px-8 py-3.5 text-sm font-bold text-white shadow-angkat transition-transform motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0"
                href="/masuk"
              >
                Masuk
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </Muncul>
      </section>

      <footer className="border-t border-garis">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-kecil text-tinta-55">
            Program edukasi Kantor Perwakilan Bank Indonesia Provinsi Sulawesi Tenggara.
          </p>
          <Link className="text-kecil font-bold text-adukan" href="/tentang">
            Tentang aplikasi
          </Link>
        </div>
      </footer>
    </main>
  );
}
