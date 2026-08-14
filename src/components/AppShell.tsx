"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Gamepad2,
  History,
  Home,
  LifeBuoy,
  MessageSquare,
  PanelLeft,
  User,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Navigasi menyesuaikan alat, bukan sekadar mengecil.
 *
 *  < 768px  bilah bawah 4 tab — jangkauan ibu jari
 *  ≥ 768px  rail kiri beringkas, ikon saja
 *  ≥ 1280px sidebar penuh dengan dua kelompok
 *
 * Kelompok "Belajar" memuat fitur yang dikunci blok konsep. Kuis tidak berdiri
 * sebagai menu sendiri: ia melekat pada materinya, jadi jalan masuknya lewat
 * halaman materi. Tidak ada menu di luar itu, supaya cakupannya tidak melebar.
 */

type Butir = { href: string; label: string; Ikon: LucideIcon };

const UTAMA: Butir[] = [
  { href: "/beranda", label: "Beranda", Ikon: Home },
  { href: "/materi", label: "Materi", Ikon: BookOpen },
  { href: "/simulasi", label: "Simulasi", Ikon: Gamepad2 },
  { href: "/panduan", label: "Panduan Pengaduan", Ikon: LifeBuoy },
];

const AKUN: Butir[] = [
  { href: "/riwayat", label: "Riwayat", Ikon: History },
  { href: "/feedback", label: "Feedback", Ikon: MessageSquare },
  { href: "/profil", label: "Profil", Ikon: User },
];

/* Di ponsel Panduan dicapai lewat kisi menu di Beranda — bilah bawah cukup
   memuat empat tujuan yang paling sering dituju. */
const TAB_PONSEL: Butir[] = [
  { href: "/beranda", label: "Beranda", Ikon: Home },
  { href: "/materi", label: "Materi", Ikon: BookOpen },
  { href: "/simulasi", label: "Simulasi", Ikon: Gamepad2 },
  { href: "/profil", label: "Profil", Ikon: User },
];

const aktifkah = (path: string, href: string) =>
  href === "/beranda" ? path === "/beranda" : path.startsWith(href);

/* Satu label untuk kedua keadaan. Menuliskan "Ciutkan" / "Bentangkan" sesuai
   keadaan berarti keadaan itu harus diketahui React — padahal ia hidup di
   atribut <html>, dan membacanya saat render akan merusak hidrasi. */
const LABEL_TOGGLE = "Ciutkan atau bentangkan menu samping";

/**
 * Membuka dan menutup sidebar.
 *
 * Keadaannya hidup di atribut <html>, bukan di state React — sebab tiap
 * halaman merender AppShell-nya sendiri, jadi state komponen akan hilang
 * setiap kali berpindah halaman. Lebarnya diurus CSS; fungsi ini hanya
 * membalik atribut dan mencatat pilihannya.
 */
function bukaTutupSisi() {
  const akar = document.documentElement;
  const berikutnya = akar.dataset.sisi === "lebar" ? "kuncup" : "lebar";
  akar.dataset.sisi = berikutnya;
  try {
    window.localStorage.setItem("peka.sisi", berikutnya);
  } catch {
    /* mode privat menolak menulis — sidebarnya tetap bisa dibuka-tutup,
       hanya pilihannya yang tidak diingat */
  }
}

function TautanSisi({ butir, aktif }: { butir: Butir; aktif: boolean }) {
  const { href, label, Ikon } = butir;
  return (
    <Link
      aria-current={aktif ? "page" : undefined}
      className={`baris-sisi relative flex h-11 items-center gap-3 rounded-dalam px-3 transition-colors ${
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
      <span className="label-sisi relative z-10 whitespace-nowrap text-sm font-bold">{label}</span>
    </Link>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();

  return (
    <div className="min-h-screen md:flex">
      <aside className="sisi fixed inset-y-0 left-0 z-40 hidden flex-col overflow-hidden border-r border-garis bg-kertas-tua/60 md:flex">
        {/* Kepala: merek saja. Tombol buka-tutup sengaja TIDAK di sini —
            menaruhnya di sebelah logo membuat keduanya berebut perhatian dan
            memaksa logo bergeser tiap kali sidebar dibuka-tutup. */}
        <Link
          className="baris-sisi flex h-16 shrink-0 items-center gap-3 border-b border-garis px-3"
          href="/beranda"
        >
          <span className="grid size-10 shrink-0 place-content-center rounded-dalam gradien-merek">
            <span className="grid grid-cols-2 gap-0.5" aria-hidden>
              <span className="size-1.5 bg-white" />
              <span className="size-1.5 bg-white/70" />
              <span className="size-1.5 bg-white/70" />
              <span className="size-1.5 bg-transparent" />
            </span>
          </span>
          <span className="label-sisi text-judul tracking-tight text-institusi">PeKA</span>
        </Link>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="label-sisi mb-2 px-3 font-mono text-data uppercase text-tinta-55">Belajar</p>
          <nav aria-label="Navigasi utama" className="flex flex-col gap-1">
            {UTAMA.map((b) => (
              <TautanSisi aktif={aktifkah(path, b.href)} butir={b} key={b.href} />
            ))}
          </nav>

          <p className="label-sisi mb-2 mt-6 px-3 font-mono text-data uppercase text-tinta-55">
            Akun
          </p>
          <nav aria-label="Navigasi akun" className="flex flex-col gap-1">
            {AKUN.map((b) => (
              <TautanSisi aktif={aktifkah(path, b.href)} butir={b} key={b.href} />
            ))}
          </nav>

          <div className="label-sisi mt-8 rounded-dalam bg-white p-4">
            <p className="text-kecil font-bold text-institusi">Media pendukung edukasi</p>
            <p className="mt-1 text-kecil text-tinta-55">
              Kantor Perwakilan Bank Indonesia Provinsi Sulawesi Tenggara.
            </p>
          </div>
        </div>

        {/* Kaki: tombol buka-tutup. Tempat yang lazim dan tidak mengganggu —
            ia sejajar dengan butir menu, bukan mengambang di dekat logo. */}
        <div className="shrink-0 border-t border-garis px-3 py-3">
          <button
            aria-label={LABEL_TOGGLE}
            className="baris-sisi flex h-11 w-full items-center gap-3 rounded-dalam px-3 text-tinta-55 transition-colors hover:bg-white hover:text-institusi"
            onClick={bukaTutupSisi}
            title={LABEL_TOGGLE}
            type="button"
          >
            <PanelLeft className="size-5 shrink-0" aria-hidden />
            <span className="label-sisi whitespace-nowrap text-sm font-bold">Ciutkan menu</span>
          </button>
        </div>
      </aside>

      <div className="isi-sisi flex-1">{children}</div>

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
              <Ikon className="size-5" aria-hidden />
              <span className={`text-[11px] ${on ? "font-bold" : ""}`}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
