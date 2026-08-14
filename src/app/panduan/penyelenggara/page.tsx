import { ChevronRight, HelpCircle, Info } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Eyebrow, Halaman, KartuPilihan } from "@/components/ui";
import { ambilMasalah, ambilPenyelenggara, cariMasalah } from "@/lib/konten";

export default async function PanduanLangkah3({
  searchParams,
}: {
  searchParams: Promise<{ masalah?: string }>;
}) {
  const { masalah: idMasalah } = await searchParams;
  const [terpilih, semuaMasalah, penyelenggara] = await Promise.all([
    cariMasalah(idMasalah ?? ""),
    ambilMasalah(),
    ambilPenyelenggara(),
  ]);
  const m = terpilih ?? semuaMasalah[0];

  return (
    <AppShell>
      <Halaman>
        <div className="mb-2">
          <Eyebrow warna="adukan">Panduan &middot; Langkah 3 dari 3</Eyebrow>
        </div>
        <h1 className="mb-2 text-display text-tinta">Penyelenggara mana yang kamu gunakan?</h1>
        <p className="mb-6 text-isi text-tinta-70">
          Pilih tempat kamu bertransaksi. Kanal resminya akan ditampilkan di langkah berikutnya.
        </p>

        <span className="mb-3 block font-mono text-data uppercase text-tinta-55">
          Daftar contoh &middot; diisi dari daftar PJP berizin BI
        </span>

        {/* Bank Indonesia sengaja TIDAK ada di daftar ini: BI bukan
            penyelenggara jasa pembayaran tempat orang mengadukan transaksi.
            Jalur ke BI hanya terbuka lewat layar eskalasi. */}
        <div className="mb-6 grid gap-2 md:grid-cols-2">
          {penyelenggara.map((p) => (
            <KartuPilihan href={`/panduan/hasil/${m.id}?pjp=${p.id}`} key={p.id}>
              <span className="flex items-center gap-4">
                <span
                  aria-hidden
                  className="flex size-12 shrink-0 items-center justify-center rounded-tombol bg-adukan-lembut text-subjudul text-adukan"
                >
                  {p.nama.slice(-1)}
                </span>
                <span className="flex-1">
                  <span className="block text-isi font-bold text-tinta">{p.nama}</span>
                  <span className="block text-kecil text-tinta-70">{p.jenis}</span>
                </span>
                <ChevronRight className="size-5 shrink-0 text-tinta-55" aria-hidden />
              </span>
            </KartuPilihan>
          ))}

          <div className="flex items-center gap-4 rounded-kartu border border-dashed border-garis p-5">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-tombol bg-black/5">
              <HelpCircle className="size-6 text-tinta-55" aria-hidden />
            </span>
            <span className="flex-1">
              <span className="block text-isi font-bold text-tinta">Saya tidak yakin</span>
              <span className="block text-kecil text-tinta-70">
                Cek aplikasi atau mutasi rekeningmu dulu
              </span>
            </span>
          </div>
        </div>

        {/* Catatan biasa, bukan peringatan merah — ini bukan isu keamanan. */}
        <div className="flex items-start gap-3 rounded-tombol border border-garis bg-white/60 p-4">
          <Info className="mt-0.5 size-5 shrink-0 text-adukan" aria-hidden />
          <p className="text-kecil text-tinta-70">
            Pilih penyelenggara yang benar-benar kamu pakai saat transaksi. Kalau salah, kanal yang
            ditampilkan tidak akan bisa menelusuri transaksimu.
          </p>
        </div>
      </Halaman>
    </AppShell>
  );
}
