"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Gamepad2, Gavel, Home, LayoutGrid } from "lucide-react";

/**
 * Di ponsel navigasi ada di bawah (jangkauan ibu jari); mulai tablet pindah
 * ke atas, karena ruang bawah layar terbuang dan jempol bukan lagi alat utama.
 *
 * Alur linear — persetujuan, kuis, simulasi, kuesioner — sengaja TIDAK memakai
 * navigasi ini: memberi jalan keluar di tengah pengukuran merusak datanya.
 */

const TAB = [
  { href: "/", label: "Beranda", Ikon: Home },
  { href: "/belajar", label: "Belajar", Ikon: BookOpen },
  { href: "/simulasi", label: "Simulasi", Ikon: Gamepad2 },
  { href: "/adukan", label: "Adukan", Ikon: Gavel },
];

const aktifkah = (path: string, href: string) =>
  href === "/" ? path === "/" : path.startsWith(href);

export default function Nav() {
  const path = usePathname();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-institusi">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-5 md:px-8">
          <Link className="flex shrink-0 items-center gap-3 text-white" href="/">
            <LayoutGrid className="size-6" aria-hidden />
            <span className="text-judul tracking-tight">PeKA</span>
          </Link>

          <nav aria-label="Navigasi utama" className="hidden h-16 items-center gap-8 md:flex">
            {TAB.map(({ href, label }) => {
              const on = aktifkah(path, href);
              return (
                <Link
                  aria-current={on ? "page" : undefined}
                  className={`border-b-2 px-1 py-5 text-base transition-colors ${
                    on ? "border-white font-bold text-white" : "border-transparent text-white/70 hover:text-white"
                  }`}
                  href={href}
                  key={href}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <nav
        aria-label="Navigasi utama"
        className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-garis bg-white px-4 md:hidden"
      >
        {TAB.map(({ href, label, Ikon }) => {
          const on = aktifkah(path, href);
          return (
            <Link
              aria-current={on ? "page" : undefined}
              className={`flex flex-1 flex-col items-center justify-center py-1 ${
                on ? "border-t-2 border-institusi text-institusi" : "text-tinta-70"
              }`}
              href={href}
              key={href}
            >
              <Ikon className="mb-1 size-5" aria-hidden />
              <span className={on ? "text-xs font-bold" : "text-kecil"}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
