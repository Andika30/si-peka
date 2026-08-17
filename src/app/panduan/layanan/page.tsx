import { ArrowLeftRight, ChevronRight, CreditCard, QrCode, Wallet } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Eyebrow, Halaman, KartuPilihan, Peringatan } from "@/components/ui";
import { ambilLayanan, cariMasalah } from "@/lib/konten";
import { jumlahLangkah, setelahLayanan } from "@/lib/panduan";
import { notFound } from "next/navigation";

const IKON = {
  qr: QrCode,
  transfer: ArrowLeftRight,
  dompet: Wallet,
  kartu: CreditCard,
} as const;

export default async function PanduanLangkah2({
  searchParams,
}: {
  searchParams: Promise<{ masalah?: string }>;
}) {
  const { masalah: idMasalah } = await searchParams;
  const [m, layanan] = await Promise.all([cariMasalah(idMasalah ?? ""), ambilLayanan()]);
  if (!m) notFound();

  return (
    <AppShell>
      <Halaman>
        <div className="mb-2">
          <Eyebrow warna="adukan">
            Panduan &middot; Langkah 2 dari {jumlahLangkah(m)}
          </Eyebrow>
        </div>
        <h1 className="mb-2 text-display text-tinta">Kamu memakai layanan apa?</h1>
        <p className="mb-6 text-isi text-tinta-70">
Terkait: {m.label}. Jenis layanan menentukan penyelenggara mana yang bisa menelusuri
          transaksimu — daftarnya menyesuaikan pilihan ini.
        </p>

        <div className="mb-6 grid gap-2 md:grid-cols-2">
          {layanan.map((l) => {
            const Ikon = IKON[l.ikon as keyof typeof IKON] ?? QrCode;
            return (
              <KartuPilihan href={setelahLayanan(m, l.id)} key={l.id}>
                <span className="flex items-center gap-4">
                  <Ikon className="size-7 shrink-0 text-adukan" aria-hidden />
                  <span className="flex-1">
                    <span className="block text-subjudul text-tinta">{l.nama}</span>
                    <span className="block text-kecil text-tinta-70">{l.ringkas}</span>
                  </span>
                  <ChevronRight className="size-5 shrink-0 text-tinta-55" aria-hidden />
                </span>
              </KartuPilihan>
            );
          })}
        </div>

        <Peringatan>
          Jangan pernah memberikan PIN, password, atau OTP kepada siapa pun.
        </Peringatan>
      </Halaman>
    </AppShell>
  );
}
