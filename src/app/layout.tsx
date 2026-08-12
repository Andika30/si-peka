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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${jakarta.variable} ${plexMono.variable}`}>{children}</body>
    </html>
  );
}
