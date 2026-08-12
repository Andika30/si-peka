import Nav from "@/components/Nav";
import { Eyebrow, Halaman, KartuPilihan, Peringatan } from "@/components/dasar";
import { kasus } from "@/lib/konten";

export default function AdukanLangkah1() {
  return (
    <>
      <Nav />
      <Halaman>
        <div className="mb-2">
          <Eyebrow warna="adukan">Adukan &middot; Langkah 1 dari 3</Eyebrow>
        </div>
        <h1 className="mb-2 text-display text-tinta">Apa yang kamu alami?</h1>
        <p className="mb-6 text-isi text-tinta-70">
          Pilih yang paling mendekati keadaanmu. Langkah berikutnya menyesuaikan pilihan ini.
        </p>

        {/* Tiap kasus punya jalur dan hasil sendiri — kasus mendesak dan
            kasus penipuan tidak boleh diperlakukan sama. */}
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          {kasus.map((k) => (
            <KartuPilihan href={`/adukan/layanan?kasus=${k.id}`} key={k.id}>
              <span className="mb-1 block text-subjudul text-tinta">{k.label}</span>
              <span className="block text-kecil text-tinta-70">{k.ringkas}</span>
            </KartuPilihan>
          ))}
        </div>

        <Peringatan>
          Jangan pernah memberikan PIN, password, atau OTP kepada siapa pun.
        </Peringatan>
      </Halaman>
    </>
  );
}
