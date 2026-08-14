import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Plus Jakarta Sans dibuat untuk Jakarta — identitas Indonesia, dan bukan
// tipografi bawaan yang dipakai semua orang. IBM Plex Mono khusus data:
// skor, tanggal verifikasi, kode. Itu memberi baris data rasa struk.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PeKA — Peduli, Kenali, Adukan",
  description:
    "Media edukasi dan simulasi keamanan pembayaran digital untuk masyarakat Sulawesi Tenggara. Peduli, Kenali, Adukan.",
};

export const viewport: Viewport = {
  themeColor: "#0e2f6b",
};

/**
 * Pilihan buka-tutup sidebar dipasang sebelum halaman digambar.
 *
 * Kalau menunggu React hidrasi, sidebar sempat tampil lebar lalu menguncup —
 * satu lompatan tata letak di setiap perpindahan halaman. Skrip sekecil ini
 * berjalan lebih dulu, jadi lebarnya sudah benar sejak gambar pertama.
 *
 * Kunjungan pertama belum punya pilihan tersimpan, jadi bawaannya ditentukan
 * di sini: sidebar penuh kalau layarnya memang lapang, rail kalau tidak.
 */
const PILIHAN_SIDEBAR = `try{var r=document.documentElement,s=localStorage.getItem("peka.sisi");r.dataset.sisi=s==="lebar"||s==="kuncup"?s:matchMedia("(min-width:80rem)").matches?"lebar":"kuncup";r.dataset.sisiAdmin=localStorage.getItem("peka.sisi.admin")==="kuncup"?"kuncup":"lebar"}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: skrip di atas mengubah atribut <html> sebelum
    // React hidrasi, jadi markup server dan klien memang sengaja berbeda.
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PILIHAN_SIDEBAR }} />
      </head>
      <body className={`${jakarta.variable} ${plexMono.variable}`}>{children}</body>
    </html>
  );
}
