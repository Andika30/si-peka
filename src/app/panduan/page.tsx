import AppShell from "@/components/AppShell";
import Ilustrasi from "@/components/Ilustrasi";
import { Anak, Berurutan, Sentuh } from "@/components/gerak";
import { Eyebrow, Halaman, Kartu, KartuPilihan, Peringatan } from "@/components/ui";
import { ambilMasalah } from "@/lib/konten";

/**
 * Panduan Pengaduan — bukan sistem pengaduan.
 *
 * Website ini tidak menerima laporan, tidak menyimpan data aduan, dan tidak
 * memproses apa pun. Ia hanya menjawab dua pertanyaan: apa yang harus
 * dilakukan, dan ke mana harus mengadu.
 */
export default async function PanduanLangkah1() {
  const masalah = await ambilMasalah();

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

        {/* Tiap masalah punya jalur dan hasil sendiri — kasus mendesak dan
            kasus penipuan tidak boleh diperlakukan sama. */}
        <Berurutan className="mb-6 grid gap-4 md:grid-cols-2">
          {masalah.map((m) => (
            <Anak key={m.id}>
              <Sentuh>
                <KartuPilihan href={`/panduan/layanan?masalah=${m.id}`}>
                  <span className="mb-1 block text-subjudul text-tinta">{m.label}</span>
                  <span className="block text-kecil text-tinta-70">{m.ringkas}</span>
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
