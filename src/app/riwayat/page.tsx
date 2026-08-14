import LayarRiwayat from "@/components/layar/LayarRiwayat";
import { ambilRingkasKonten } from "@/lib/konten";

export default async function HalamanRiwayat() {
  // Riwayat disusun di peramban dari catatan localStorage, tapi judul materi
  // dan kuisnya ada di basis data — jadi daftarnya dikirim dari sini.
  return <LayarRiwayat konten={await ambilRingkasKonten()} />;
}
