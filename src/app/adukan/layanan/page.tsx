import { ArrowLeftRight, ChevronRight, CreditCard, QrCode, Wallet } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Eyebrow, Halaman, KartuPilihan, Peringatan } from "@/components/ui";
import { cariKasus, layanan } from "@/lib/konten";

const IKON = {
  qr: QrCode,
  transfer: ArrowLeftRight,
  dompet: Wallet,
  kartu: CreditCard,
} as const;

export default async function AdukanLangkah2({
  searchParams,
}: {
  searchParams: Promise<{ kasus?: string }>;
}) {
  const { kasus: idKasus } = await searchParams;
  // Jenis masalah dibawa terus sampai layar hasil — di sanalah isinya berbeda.
  const k = cariKasus(idKasus ?? "");
  const lanjut = (idLayanan: string) =>
    `/adukan/penyelenggara?kasus=${k?.id ?? "qris"}&layanan=${idLayanan}`;

  return (
    <AppShell>
      <Halaman>
        <div className="mb-2">
          <Eyebrow warna="adukan">Adukan &middot; Langkah 2 dari 3</Eyebrow>
        </div>
        <h1 className="mb-2 text-display text-tinta">Kamu memakai layanan apa?</h1>
        <p className="mb-6 text-isi text-tinta-70">
          {k ? `Terkait: ${k.label}. ` : ""}Jenis layanan menentukan siapa yang bisa menelusuri
          transaksimu.
        </p>

        <div className="mb-6 grid gap-2 md:grid-cols-2">
          {layanan.map((l) => {
            const Ikon = IKON[l.ikon as keyof typeof IKON] ?? QrCode;
            return (
              <KartuPilihan href={lanjut(l.id)} key={l.id}>
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
