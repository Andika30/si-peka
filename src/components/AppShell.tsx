"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BookOpen,
  Gamepad2,
  Gavel,
  History,
  Home,
  MessageSquare,
  User,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Navigasi menyesuaikan alat, bukan sekadar mengecil.
 *
 *  < 768px  bilah bawah 4 tab — jangkauan ibu jari
 *  ≥ 768px  rail kiri beringkas, ikon + label kecil
 *  ≥ 1280px sidebar penuh dengan dua kelompok
 *
 * Di ponsel fitur (Materi, Simulasi, Adukan) dicapai lewat kisi di Beranda;
 * di layar lebar tidak ada alasan menyembunyikannya, jadi semuanya tampil.
 */

type Butir = { href: string; label: string; Ikon: LucideIcon };

const UTAMA: Butir[] = [
  { href: "/beranda", label: "Beranda", Ikon: Home },
  { href: "/materi", label: "Materi & Kuis", Ikon: BookOpen },
  { href: "/simulasi", label: "Simulasi", Ikon: Gamepad2 },
  { href: "/adukan", label: "Adukan", Ikon: Gavel },
  { href: "/feedback", label: "Feedback", Ikon: MessageSquare },
];

const AKUN: Butir[] = [
  { href: "/riwayat", label: "Riwayat", Ikon: History },
  { href: "/pencapaian", label: "Pencapaian", Ikon: Award },
  { href: "/profil", label: "Profil", Ikon: User },
];

const TAB_PONSEL: Butir[] = [
  { href: "/beranda", label: "Beranda", Ikon: Home },
  { href: "/riwayat", label: "Riwayat", Ikon: History },
  { href: "/pencapaian", label: "Pencapaian", Ikon: Award },
  { href: "/profil", label: "Profil", Ikon: User },
];

const aktifkah = (path: string, href: string) =>
  href === "/beranda" ? path === "/beranda" : path.startsWith(href);

/**
 * Penanda aktif tidak muncul-hilang, tapi meluncur dari menu lama ke menu
 * baru lewat `layoutId`. Itu yang membuat perpindahan terbaca sebagai satu
 * benda yang berpindah, bukan dua benda yang berkedip.
 */
function TautanSisi({ butir, aktif }: { butir: Butir; aktif: boolean }) {
  const { href, label, Ikon } = butir;
  return (
    <Link
      aria-current={aktif ? "page" : undefined}
      className={`relative flex items-center gap-3 rounded-dalam px-3 py-2.5 transition-colors xl:px-4 ${
        aktif ? "text-white" : "text-tinta-70 hover:bg-white hover:text-institusi"
      }`}
      href={href}
      title={label}
    >
      {aktif ? (
        <motion.span
          className="absolute inset-0 rounded-dalam bg-adukan"
          layoutId="penanda-sisi"
          transition={{ type: "spring", stiffness: 420, damping: 36 }}
        />
      ) : null}
      <Ikon className="relative z-10 size-5 shrink-0" aria-hidden />
      <span className="relative z-10 hidden text-sm font-bold xl:inline">{label}</span>
    </Link>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();

  return (
    <div className="min-h-screen md:flex">
      {/* Rail (tablet) / sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-20 flex-col border-r border-garis bg-kertas-tua/60 px-3 py-5 md:flex xl:w-64 xl:px-4">
        <Link className="mb-8 flex items-center gap-3 px-1 xl:px-2" href="/beranda">
          <span className="grid size-10 shrink-0 place-content-center rounded-dalam gradien-merek">
            <span className="grid grid-cols-2 gap-0.5" aria-hidden>
              <span className="size-1.5 bg-white" />
              <span className="size-1.5 bg-white/70" />
              <span className="size-1.5 bg-white/70" />
              <span className="size-1.5 bg-transparent" />
            </span>
          </span>
          <span className="hidden text-judul tracking-tight text-institusi xl:inline">PeKA</span>
        </Link>

        <p className="mb-2 hidden px-4 font-mono text-data uppercase text-tinta-55 xl:block">
          Belajar
        </p>
        <nav aria-label="Navigasi utama" className="flex flex-col gap-1">
          {UTAMA.map((b) => (
            <TautanSisi aktif={aktifkah(path, b.href)} butir={b} key={b.href} />
          ))}
        </nav>

        <p className="mb-2 mt-6 hidden px-4 font-mono text-data uppercase text-tinta-55 xl:block">
          Akun
        </p>
        <nav aria-label="Navigasi akun" className="flex flex-col gap-1">
          {AKUN.map((b) => (
            <TautanSisi aktif={aktifkah(path, b.href)} butir={b} key={b.href} />
          ))}
        </nav>

        <div className="mt-auto hidden rounded-dalam bg-white p-4 xl:block">
          <p className="text-kecil font-bold text-institusi">Peduli · Kenali · Adukan</p>
          <p className="mt-1 text-kecil text-tinta-55">
            Program edukasi KPw Bank Indonesia Provinsi Sulawesi Tenggara.
          </p>
        </div>
      </aside>

      <div className="flex-1 md:ml-20 xl:ml-64">{children}</div>

      {/* Bilah bawah hanya di ponsel */}
      <nav
        aria-label="Navigasi utama"
        className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-garis bg-white md:hidden"
      >
        {TAB_PONSEL.map(({ href, label, Ikon }) => {
          const on = aktifkah(path, href);
          return (
            <Link
              aria-current={on ? "page" : undefined}
              className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1 transition-colors ${
                on ? "text-adukan" : "text-tinta-55"
              }`}
              href={href}
              key={href}
            >
              {on ? (
                <motion.span
                  className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-adukan"
                  layoutId="penanda-bawah"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              ) : null}
              <motion.span animate={{ scale: on ? 1.1 : 1 }} transition={{ type: "spring", stiffness: 400, damping: 24 }}>
                <Ikon className="size-5" aria-hidden />
              </motion.span>
              <span className={`text-[11px] ${on ? "font-bold" : ""}`}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
