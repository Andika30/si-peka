import LayarBeranda from "@/components/layar/LayarBeranda";
import { ambilKategori, ambilKuis, ambilMasalah, ambilSkenario, ambilTopik } from "@/lib/konten";

export default async function HalamanBeranda() {
  const [kategori, topik, masalah, kuis, skenario] = await Promise.all([
    ambilKategori(),
    ambilTopik(),
    ambilMasalah(),
    ambilKuis(),
    ambilSkenario(),
  ]);

  return (
    <LayarBeranda
      jumlahKuis={kuis.length}
      jumlahSkenario={skenario.length}
      kategori={kategori}
      masalah={masalah}
      topik={topik}
    />
  );
}
