import LayarMateri from "@/components/layar/LayarMateri";
import { ambilKategori, ambilTopik } from "@/lib/konten";

export default async function HalamanDaftarMateri() {
  const [kategori, topik] = await Promise.all([ambilKategori(), ambilTopik()]);
  return <LayarMateri kategori={kategori} topik={topik} />;
}
