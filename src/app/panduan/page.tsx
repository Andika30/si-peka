import { CheckCircle2, Clock } from "lucide-react";
import AppShell from "@/components/AppShell";
import Ilustrasi from "@/components/Ilustrasi";
import { Anak, Berurutan, Sentuh } from "@/components/gerak";
import { Eyebrow, Halaman, Kartu, KartuPilihan, Peringatan } from "@/components/ui";
import { ambilInfoAwal, ambilMasalah } from "@/lib/konten";
import { langkahPertama } from "@/lib/panduan";

/**
 * Panduan Pengaduan — bukan sistem pengaduan.
 *
 * Website ini tidak menerima laporan, tidak menyimpan data aduan, dan tidak
 * memproses apa pun. Ia hanya menjawab dua pertanyaan: apa yang harus
 * dilakukan, dan ke mana harus mengadu.
 */
export default async function PanduanLangkah1() {
  const [masalah, infoAwal] = await Promise.all([ambilMasalah(), ambilInfoAwal()]);

  return (
    <AppShell>
      <Halaman>
        <div className="mb-2">
          <Eyebrow warna="adukan">Panduan Pengaduan</Eyebrow>
        </div>
        <h1 className="mb-2 text-display text-tinta">Apa yang kamu alami?</h1>
        <p className="mb-6 text-isi text-tinta-70">
          Pilih yang paling mendekati keadaanmu. Langkah berikutnya menyesuaikan pilihan ini.
        </p>

        {/* Panel pembuka. Gambarnya menunjuk keluar — ke kanal resmi — supaya
            tidak ada yang mengira ini kotak masuk pengaduan. */}
        <Kartu
          aksen="adukan"
          className="mb-6 flex flex-col items-center gap-4 sm:flex-row"
          nada="adukan"
        >
          <Ilustrasi className="w-40 shrink-0 sm:w-32" nama="adukan" warna="adukan" />
          <div className="text-center sm:text-left">
            <h2 className="text-subjudul text-tinta">Ini panduan, bukan tempat melapor</h2>
            <p className="mt-1 text-isi text-tinta-70">
              Aplikasi ini tidak menerima laporan dan tidak menyimpan data aduanmu. Yang ditunjukkan
              di sini adalah langkah yang perlu kamu ambil dan pihak resmi yang harus kamu hubungi.
            </p>
          </div>
        </Kartu>

        {infoAwal.length > 0 ? (
          <Kartu className="mb-6">
            <h2 className="mb-1 text-subjudul text-tinta">Sebelum memilih, siapkan ini dulu</h2>
            <p className="mb-4 text-kecil text-tinta-70">
              Langkah umum ini berlaku apa pun masalahmu — langkah yang spesifik menyusul setelah
              kamu memilih di bawah.
            </p>
            <ul className="flex flex-col gap-3">
              {infoAwal.map((i) => (
                <li className="flex gap-3" key={i.id}>
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-adukan" aria-hidden />
                  <div>
                    <p className="text-isi font-bold text-tinta">{i.judul}</p>
                    {i.keterangan ? (
                      <p className="text-kecil text-tinta-70">{i.keterangan}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </Kartu>
        ) : null}

        <span className="mb-3 block font-mono text-data uppercase text-tinta-55">
          Pilih jenis permasalahan
        </span>

        {/* Tiap masalah punya jalur dan hasil sendiri — kasus mendesak dan
            kasus penipuan tidak boleh diperlakukan sama. */}
        {/* Tiap masalah menuju langkah yang memang dibutuhkannya. Kasus yang
            jawabannya tidak bergantung penyelenggara langsung ke jawaban;
            menanyakan hal yang tidak menentukan apa-apa hanya menunda orang
            yang sedang panik. */}
        <Berurutan className="mb-6 grid gap-4 md:grid-cols-2">
          {masalah.map((m) => (
            <Anak key={m.id}>
              <Sentuh>
                <KartuPilihan href={langkahPertama(m)}>
                  <span className="mb-1 block text-subjudul text-tinta">{m.label}</span>
                  <span className="block text-kecil text-tinta-70">{m.ringkas}</span>
                  {m.segera ? (
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-waspada-lembut px-2.5 py-1 font-mono text-data uppercase text-waspada">
                      <Clock className="size-3" aria-hidden />
                      Mendesak
                    </span>
                  ) : null}
                </KartuPilihan>
              </Sentuh>
            </Anak>
          ))}
        </Berurutan>

        <Peringatan>Jangan pernah memberikan PIN, password, atau OTP kepada siapa pun.</Peringatan>
      </Halaman>
    </AppShell>
  );
}
