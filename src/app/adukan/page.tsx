import AppShell from "@/components/AppShell";
import Ilustrasi from "@/components/Ilustrasi";
import { Anak, Berurutan, Sentuh } from "@/components/gerak";
import { Eyebrow, Halaman, Kartu, KartuPilihan, Peringatan } from "@/components/ui";
import { kasus } from "@/lib/konten";

export default function AdukanLangkah1() {
  return (
    <AppShell>
      <Halaman>
        <div className="mb-2">
          <Eyebrow warna="adukan">Adukan &middot; Langkah 1 dari 3</Eyebrow>
        </div>
        <h1 className="mb-2 text-display text-tinta">Apa yang kamu alami?</h1>
        <p className="mb-6 text-isi text-tinta-70">
          Pilih yang paling mendekati keadaanmu. Langkah berikutnya menyesuaikan pilihan ini.
        </p>

        {/* Panel bantuan. Gambarnya menunjuk keluar — ke kanal resmi — supaya
            tidak ada yang mengira ini kotak masuk pengaduan. */}
        <Kartu aksen="adukan" className="mb-6 flex flex-col items-center gap-4 sm:flex-row" nada="adukan">
          <Ilustrasi className="w-40 shrink-0 sm:w-32" nama="adukan" warna="adukan" />
          <div className="text-center sm:text-left">
            <h2 className="text-subjudul text-tinta">Butuh bantuan?</h2>
            <p className="mt-1 text-isi text-tinta-70">
              Jangan diam jika kamu mengalami kendala, kejanggalan, atau indikasi penipuan saat
              bertransaksi. PeKA menunjukkan ke mana kamu harus pergi — kami tidak menerima laporan
              dan tidak menyimpan data aduanmu.
            </p>
          </div>
        </Kartu>

        {/* Tiap kasus punya jalur dan hasil sendiri — kasus mendesak dan
            kasus penipuan tidak boleh diperlakukan sama. */}
        <Berurutan className="mb-6 grid gap-4 md:grid-cols-2">
          {kasus.map((k) => (
            <Anak key={k.id}>
              <Sentuh>
                <KartuPilihan href={`/adukan/layanan?kasus=${k.id}`}>
                  <span className="mb-1 block text-subjudul text-tinta">{k.label}</span>
                  <span className="block text-kecil text-tinta-70">{k.ringkas}</span>
                </KartuPilihan>
              </Sentuh>
            </Anak>
          ))}
        </Berurutan>

        <Peringatan>
          Jangan pernah memberikan PIN, password, atau OTP kepada siapa pun.
        </Peringatan>
      </Halaman>
    </AppShell>
  );
}
