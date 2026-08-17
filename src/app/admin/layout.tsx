import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Pengelolaan Konten — Kalosara",
  // Panel admin tidak punya urusan dengan mesin pencari.
  robots: { index: false, follow: false },
};

/**
 * Tata letak ini sengaja tidak menjaga apa pun — halaman masuk ada di
 * bawahnya, dan penjaga di sini akan mengalihkannya ke dirinya sendiri
 * tanpa henti. Penjagaan dilakukan di `(panel)/layout.tsx`, yang hanya
 * membungkus halaman-halaman yang memang butuh sesi.
 */
export default function TataLetakAdmin({ children }: { children: ReactNode }) {
  return children;
}
