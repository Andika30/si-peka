import AppShell from "@/components/AppShell";
import { Halaman, Judul, Kartu, Peringatan } from "@/components/ui";

const TIDAK = [
  "menerima laporan masyarakat",
  "menyimpan data pengaduan",
  "meminta data finansial",
  "meminta OTP atau PIN",
  "memproses transaksi",
  "menggantikan kanal resmi Bank Indonesia maupun penyelenggara",
];

export default function Tentang() {
  return (
    <AppShell>
      <Halaman sempit>
        <Judul sub="Media edukasi dan simulasi keamanan pembayaran digital untuk masyarakat Sulawesi Tenggara.">
          Tentang PeKA
        </Judul>

        <Kartu className="mb-4">
          <h2 className="mb-2 text-subjudul text-tinta">PeKA singkatan dari</h2>
          <p className="text-isi leading-relaxed text-tinta-70">
            <strong className="text-peduli">Peduli</strong> terhadap manfaat, risiko, dan keamanan
            transaksi pembayaran. <strong className="text-kenali">Kenali</strong> penyelenggara dan
            gunakan saluran resmi dalam bertransaksi.{" "}
            <strong className="text-adukan">Adukan</strong> permasalahan yang dialami kepada
            penyelenggara, dan kepada Bank Indonesia apabila diperlukan tindak lanjut.
          </p>
        </Kartu>

        <Kartu className="mb-4" aksen="institusi">
          <h2 className="mb-3 text-subjudul text-tinta">Batasan aplikasi</h2>
          <p className="mb-3 text-isi text-tinta-70">PeKA adalah pengarah kanal, bukan sistem pengaduan. Aplikasi ini tidak:</p>
          <ul className="flex flex-col gap-2">
            {TIDAK.map((t) => (
              <li className="flex gap-3 text-isi text-tinta" key={t}>
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-waspada" />
                {t}
              </li>
            ))}
          </ul>
        </Kartu>

        <Peringatan>
          Bank Indonesia dan penyelenggara resmi tidak pernah meminta PIN, password, atau OTP kamu.
        </Peringatan>

        <Kartu>
          <h2 className="mb-2 text-subjudul text-tinta">Pengembang</h2>
          <p className="text-isi leading-relaxed text-tinta-70">
            Dikembangkan pada kegiatan magang di Kantor Perwakilan Bank Indonesia Provinsi Sulawesi
            Tenggara, sebagai media pendukung edukasi dan pelindungan konsumen di bidang sistem
            pembayaran.
          </p>
        </Kartu>
      </Halaman>
    </AppShell>
  );
}
