import { Check } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Eyebrow, Halaman, Judul, Kartu, Peringatan, Tombol } from "@/components/ui";
import { ambilBankIndonesia } from "@/lib/konten";

const LANGKAH_PENYELENGGARA = [
  "Gunakan call center resmi yang tertera di aplikasi atau kartu",
  "Siapkan bukti transaksi sebelum menghubungi",
  "Minta dan catat nomor tiket laporanmu",
];

export default async function KanalResmi() {
  const bankIndonesia = await ambilBankIndonesia();

  return (
    <AppShell>
      <Halaman>
        <div className="mb-2">
          <Eyebrow warna="adukan">Panduan &middot; Kanal resmi</Eyebrow>
        </div>
        <Judul sub="Urutannya menentukan. Hampir semua kendala transaksi selesai di penyelenggara — Bank Indonesia adalah langkah terakhir, bukan langkah pertama.">
          Ke mana kamu harus mengadu
        </Judul>

        {/* Langkah 1 sengaja dibuat paling menonjol. */}
        <section className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-6 items-center justify-center bg-institusi font-mono text-[10px] font-semibold text-white">
              1
            </span>
            <span className="font-mono text-data uppercase text-tinta-55">Mulai dari sini</span>
          </div>
          <Kartu aksen="adukan">
            <h2 className="mb-1 text-judul text-tinta">Penyelenggara yang kamu pakai</h2>
            <p className="mb-4 text-isi text-tinta-70">
              Bank, e-wallet, atau merchant tempat transaksi terjadi. Merekalah yang memegang data
              transaksimu dan bisa menelusuri dananya.
            </p>
            <ul className="mb-5 flex flex-col gap-2">
              {LANGKAH_PENYELENGGARA.map((t) => (
                <li className="flex gap-3 text-isi text-tinta" key={t}>
                  <Check className="mt-1 size-4 shrink-0 text-adukan" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <Tombol href="/panduan">Cari kanal penyelenggaraku</Tombol>
          </Kartu>
        </section>

        {/* Langkah 2 bersyarat, dan sengaja lebih tenang. */}
        <section className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-6 items-center justify-center border border-garis font-mono text-[10px] font-semibold text-tinta-70">
              2
            </span>
            <span className="font-mono text-data uppercase text-tinta-55">
              Hanya jika langkah 1 buntu
            </span>
          </div>
          <Kartu className="bg-white/60 shadow-none">
            <h2 className="mb-1 text-subjudul text-tinta">
              Bank Indonesia — BICARA {bankIndonesia.telepon}
            </h2>
            <p className="mb-4 text-isi text-tinta-70">
              Untuk permasalahan penyelenggara sistem pembayaran yang berada dalam kewenangan Bank
              Indonesia, setelah kamu melapor ke penyelenggara dan belum ada penyelesaian.
            </p>
            <Tombol href="/panduan/eskalasi" jenis="garis">
              Lihat syarat eskalasi
            </Tombol>
            <div className="mt-4 border-t border-garis pt-4">
              <span className="font-mono text-data uppercase text-tinta-55">
                Diverifikasi terakhir {bankIndonesia.diverifikasi}
              </span>
            </div>
          </Kartu>
        </section>

        <Peringatan>
          Kanal resmi tidak pernah meminta PIN, password, atau OTP. Cari nomornya di aplikasi resmi
          atau situs resmi, bukan dari hasil pencarian atau pesan masuk.
        </Peringatan>

        <p className="text-center text-kecil text-tinta-70">
          Aplikasi ini tidak menerima pengaduan dan tidak meneruskannya. Semua kontak di atas kamu
          hubungi langsung.
        </p>
      </Halaman>
    </AppShell>
  );
}
