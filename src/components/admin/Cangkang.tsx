"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  ExternalLink,
  Gamepad2,
  LayoutGrid,
  LifeBuoy,
  ListChecks,
  LogOut,
  Menu,
  MessageSquare,
  Newspaper,
  ScrollText,
  Shapes,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

/**
 * Cangkang panel pengelola.
 *
 * Sengaja berbeda tegas dari sisi peserta: sidebar gelap penuh, menu
 * berkelompok, kepadatan tinggi. Panel ini dipakai untuk bekerja berjam-jam,
 * jadi yang diutamakan orientasi cepat — bukan kelapangan.
 */

type Butir = { href: string; label: string; Ikon: LucideIcon };
type Kelompok = { judul?: string; butir: Butir[] };

const MENU: Kelompok[] = [
  { butir: [{ href: "/admin", label: "Dashboard", Ikon: LayoutGrid }] },
  {
    judul: "Kelola konten",
    butir: [
      { href: "/admin/materi", label: "Materi", Ikon: BookOpen },
      { href: "/admin/kuis", label: "Kuis", Ikon: ListChecks },
      { href: "/admin/simulasi", label: "Simulasi", Ikon: Gamepad2 },
      { href: "/admin/panduan", label: "Panduan Pengaduan", Ikon: LifeBuoy },
    ],
  },
  {
    judul: "Halaman publik",
    butir: [{ href: "/admin/berita", label: "Berita", Ikon: Newspaper }],
  },
  {
    judul: "Interaksi",
    butir: [{ href: "/admin/feedback", label: "Feedback", Ikon: MessageSquare }],
  },
  {
    judul: "Pengaturan",
    butir: [
      { href: "/admin/kanal", label: "Kanal & Kategori", Ikon: Shapes },
      { href: "/admin/akun", label: "Pengaturan Akun", Ikon: UserCog },
      { href: "/admin/log", label: "Log Aktivitas", Ikon: ScrollText },
    ],
  },
];

const aktifkah = (path: string, href: string) =>
  href === "/admin" ? path === "/admin" : path.startsWith(href);

/**
 * Menciutkan sidebar.
 *
 * Keadaannya ditulis di atribut <html>, bukan di state React — sama seperti
 * sidebar peserta. Bukan karena state akan hilang (tata letak panel bertahan
 * antarhalaman), melainkan supaya pilihannya diingat lintas kunjungan dan
 * lebarnya sudah benar sejak gambar pertama, tanpa lompatan tata letak.
 */
function ciutkanSisi() {
  const akar = document.documentElement;
  const berikutnya = akar.dataset.sisiAdmin === "kuncup" ? "lebar" : "kuncup";
  akar.dataset.sisiAdmin = berikutnya;
  try {
    window.localStorage.setItem("peka.sisi.admin", berikutnya);
  } catch {
    /* mode privat menolak menulis — tetap bisa diciutkan, hanya tidak diingat */
  }
}

/** Judul halaman diturunkan dari alamatnya, jadi tiap halaman tidak perlu
    mengirimkannya sendiri lewat props. */
function judulDari(path: string): string {
  for (const k of MENU) {
    for (const b of k.butir) {
      if (aktifkah(path, b.href)) return b.label;
    }
  }
  return "Pengelolaan";
}

export default function Cangkang({
  admin,
  keluar,
  children,
}: {
  admin: { nama: string; pengguna: string };
  keluar: () => Promise<void>;
  children: ReactNode;
}) {
  const path = usePathname();
  const [laciTerbuka, setLaciTerbuka] = useState(false);

  const sidebar = (
    <>
      <Link className="baris-admin kepala-admin flex items-center gap-3 px-6 py-5" href="/admin">
        <span className="grid size-10 shrink-0 place-content-center rounded-dalam bg-adukan">
          <span className="grid grid-cols-2 gap-0.5" aria-hidden>
            <span className="size-1.5 bg-white" />
            <span className="size-1.5 bg-white/70" />
            <span className="size-1.5 bg-white/70" />
            <span className="size-1.5 bg-transparent" />
          </span>
        </span>
        <span className="label-admin min-w-0">
          <span className="block truncate text-sm font-extrabold tracking-tight text-white">
            PeKA
          </span>
          <span className="block truncate text-[11px] text-white/50">
            Edukasi Pembayaran Digital
          </span>
        </span>
      </Link>

      <nav className="gulir-halus gulir-terang flex-1 overflow-y-auto px-3 pb-4">
        {MENU.map((k, i) => (
          <div className={i > 0 ? "mt-6" : ""} key={k.judul ?? "utama"}>
            {k.judul ? (
              <p className="label-admin mb-2 px-3 font-mono text-[10px] uppercase tracking-wider text-white/40">
                {k.judul}
              </p>
            ) : null}
            <div className="flex flex-col gap-1">
              {k.butir.map(({ href, label, Ikon }) => {
                const on = aktifkah(path, href);
                return (
                  <Link
                    aria-current={on ? "page" : undefined}
                    className={`baris-admin flex items-center gap-3 rounded-dalam px-3 py-2.5 text-sm transition-colors ${
                      on
                        ? "bg-adukan font-bold text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                    href={href}
                    key={href}
                    onClick={() => setLaciTerbuka(false)}
                    // Saat ciut labelnya tersembunyi, jadi ini satu-satunya
                    // cara mengetahui isi menunya tanpa membentangkan lagi.
                    title={label}
                  >
                    <Ikon className="size-[18px] shrink-0" aria-hidden />
                    <span className="label-admin truncate">{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <form action={keluar}>
          <button
            className="baris-admin flex w-full items-center gap-3 rounded-dalam px-3 py-2.5 text-sm font-bold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            title="Logout"
            type="submit"
          >
            <LogOut className="size-[18px] shrink-0" aria-hidden />
            <span className="label-admin">Logout</span>
          </button>
        </form>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-kertas">
      {/* Sidebar tetap di layar lebar */}
      <aside className="sisi-admin fixed inset-y-0 left-0 z-40 hidden flex-col overflow-hidden bg-institusi-tua lg:flex">
        {sidebar}
      </aside>

      {/* Laci di layar sempit — sidebar 240px memakan terlalu banyak di sana */}
      {laciTerbuka ? (
        <>
          <button
            aria-label="Tutup menu"
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setLaciTerbuka(false)}
            type="button"
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-institusi-tua lg:hidden">
            {sidebar}
          </aside>
        </>
      ) : null}

      <div className="isi-admin">
        <header className="sticky top-0 z-30 border-b border-garis bg-white">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            {/* Satu tempat, dua tugas: di layar sempit membuka laci, di layar
                lebar menciutkan sidebar. Dipisah jadi dua tombol supaya
                perilakunya ditentukan CSS, bukan pengecekan lebar di JS. */}
            <button
              aria-label="Buka menu"
              className="grid size-10 place-content-center rounded-dalam text-tinta-55 hover:bg-kertas lg:hidden"
              onClick={() => setLaciTerbuka(true)}
              type="button"
            >
              <Menu className="size-5" aria-hidden />
            </button>
            <button
              aria-label="Ciutkan atau bentangkan menu samping"
              className="hidden size-10 place-content-center rounded-dalam text-tinta-55 hover:bg-kertas hover:text-institusi lg:grid"
              onClick={ciutkanSisi}
              title="Ciutkan atau bentangkan menu samping"
              type="button"
            >
              <Menu className="size-5" aria-hidden />
            </button>

            <h1 className="text-subjudul text-tinta">{judulDari(path)}</h1>

            <div className="ml-auto flex items-center gap-2">
              <Link
                className="flex items-center gap-2 rounded-tombol px-3 py-2 text-kecil font-bold text-tinta-55 transition-colors hover:bg-kertas hover:text-institusi"
                href="/"
                target="_blank"
              >
                <ExternalLink className="size-4" aria-hidden />
                <span className="hidden sm:inline">Lihat aplikasi</span>
              </Link>

              <Link
                className="flex items-center gap-3 rounded-tombol py-1.5 pl-2 pr-3 transition-colors hover:bg-kertas"
                href="/admin/akun"
              >
                <span className="grid size-9 shrink-0 place-content-center rounded-full bg-adukan-lembut text-sm font-bold text-adukan">
                  {admin.nama.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-kecil font-bold text-tinta">{admin.nama}</span>
                  <span className="block text-[11px] text-tinta-55">Pengelola konten</span>
                </span>
                <ChevronDown className="hidden size-4 text-tinta-55 sm:block" aria-hidden />
              </Link>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
