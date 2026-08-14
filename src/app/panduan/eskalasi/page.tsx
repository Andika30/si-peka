import { Globe, Phone } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Eyebrow, Finder, Halaman, Judul, Kartu, Peringatan, Tombol } from "@/components/ui";
import { ambilBankIndonesia } from "@/lib/konten";

// Eskalasi dilakukan pengguna sendiri lewat kanal resmi. Aplikasi ini tidak
// menerima, tidak meneruskan, dan tidak menyimpan laporan — itu batasan proyek,
// dan layar ini adalah tempat paling mudah untuk melanggarnya kalau tidak
// hati-hati.
const PRASYARAT = [
  {
    judul: "Kamu sudah melapor ke penyelenggara",
    isi: "Bank, e-wallet, atau merchant tempat transaksi terjadi.",
  },
  {
    judul: "Kamu menyimpan nomor tiket atau bukti laporan",
    isi: "Nomor ini yang akan diminta saat kamu menghubungi Bank Indonesia.",
  },
  {
    judul: "Tenggat penyelesaian penyelenggara sudah lewat",
    isi: "Setiap penyelenggara punya tenggat sendiri — tanyakan saat kamu melapor.",
  },
];

export default async function Eskalasi() {
  const bankIndonesia = await ambilBankIndonesia();

  return (
    <AppShell>
      <Halaman>
        <div className="mb-2">
          <Eyebrow warna="institusi">Panduan &middot; Eskalasi</Eyebrow>
        </div>
        <Judul sub="Eskalasi kamu lakukan sendiri lewat kanal resmi. Aplikasi ini hanya menunjukkan jalurnya dan syarat yang perlu kamu penuhi lebih dulu.">
          Kalau penyelenggara belum menyelesaikan
        </Judul>

        <Kartu className="mb-6">
          <h2 className="mb-4 text-subjudul">Pastikan tiga hal ini sudah kamu lalui</h2>
          <ul className="flex flex-col gap-4">
            {PRASYARAT.map((p) => (
              <li className="flex gap-4" key={p.judul}>
                <Finder className="mt-1" warna="adukan" />
                <div>
                  <p className="text-isi font-bold text-tinta">{p.judul}</p>
                  <p className="text-kecil text-tinta-70">{p.isi}</p>
                </div>
              </li>
            ))}
          </ul>
        </Kartu>

        {/* Satu-satunya layar tempat kartu Bank Indonesia boleh menonjol. */}
        <Kartu aksen="institusi" className="mb-6">
          <span className="font-mono text-data uppercase text-tinta-55">
            Kanal resmi Bank Indonesia
          </span>
          <h2 className="mb-1 mt-2 text-judul text-tinta">{bankIndonesia.nama}</h2>
          <p className="mb-4 text-kecil text-tinta-70">
            Untuk permasalahan sistem pembayaran yang berada dalam kewenangan Bank Indonesia.
          </p>
          <div className="flex flex-col">
            <a
              className="group flex items-center gap-4 border-b border-garis py-4"
              href={`tel:${bankIndonesia.telepon}`}
            >
              <Phone className="size-5 text-adukan" aria-hidden />
              <span className="text-isi text-tinta group-hover:text-adukan">
                {bankIndonesia.telepon}
              </span>
            </a>
            <a
              className="group flex items-center gap-4 py-4"
              href={bankIndonesia.situs}
              rel="noopener"
              target="_blank"
            >
              <Globe className="size-5 text-adukan" aria-hidden />
              <span className="text-isi text-tinta group-hover:text-adukan">
                {bankIndonesia.situsLabel}
              </span>
            </a>
          </div>
          <div className="mt-4 border-t border-garis pt-4">
            <span className="font-mono text-data uppercase text-tinta-55">
              Diverifikasi terakhir {bankIndonesia.diverifikasi}
            </span>
          </div>
        </Kartu>

        <Kartu className="mb-6 bg-white/60 shadow-none">
          <h2 className="mb-2 text-subjudul">Yang perlu kamu tahu</h2>
          <p className="text-isi text-tinta-70">
            Bank Indonesia menangani hal yang berkaitan dengan penyelenggara jasa pembayaran
            berizin. Dugaan tindak pidana seperti penipuan tetap perlu kamu laporkan ke kepolisian,
            dan penyelesaian dana tetap berjalan melalui penyelenggara.
          </p>
        </Kartu>

        <Peringatan>
          Bank Indonesia dan penyelenggara resmi tidak pernah meminta PIN, password, atau OTP kamu.
        </Peringatan>

        <Tombol className="mb-6" href="/panduan">
          Kembali ke pilihan masalah
        </Tombol>

        <p className="text-center text-kecil text-tinta-70">
          Aplikasi ini tidak menerima laporan, tidak meneruskan laporan, dan tidak menyimpan data
          aduanmu. Semua langkah di atas kamu lakukan langsung ke kanal resmi.
        </p>
      </Halaman>
    </AppShell>
  );
}
