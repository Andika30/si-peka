import Link from "next/link";
import Nav from "@/components/Nav";
import { Finder, Halaman } from "@/components/dasar";

const MODUL = [
  {
    href: "/belajar",
    warna: "peduli" as const,
    judul: "Peduli",
    isi: "Pahami risikonya sebelum kamu bayar",
  },
  {
    href: "/simulasi",
    warna: "kenali" as const,
    judul: "Kenali",
    isi: "Hadapi skenario nyata dan lihat akibat pilihanmu",
  },
  {
    href: "/adukan",
    warna: "adukan" as const,
    judul: "Adukan",
    isi: "Tahu harus ke mana saat transaksi bermasalah",
  },
];

export default function Beranda() {
  return (
    <>
      <Nav />
      <Halaman className="flex flex-col gap-10">
        <section className="flex flex-col gap-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <h1 className="max-w-3xl flex-1 text-display text-institusi">
              Sudah PeKA dengan Pembayaran Digital?
            </h1>
            <div className="flex shrink-0 gap-2 sm:mt-2 sm:flex-col">
              <Finder className="size-6" status="kosong" warna="peduli" />
              <Finder className="size-6" status="kosong" warna="kenali" />
              <Finder className="size-6" status="kosong" warna="adukan" />
            </div>
          </div>
          <p className="mt-2 font-mono text-data uppercase text-tinta-70">
            Peduli &middot; Kenali &middot; Adukan
          </p>
        </section>

        {/* Dua pintu masuk. Orang yang saldonya baru terpotong tidak boleh
            dipaksa membaca materi lebih dulu. */}
        <section className="flex flex-col gap-4 sm:flex-row">
          <Link
            className="flex h-[52px] w-full items-center justify-center rounded-tombol bg-adukan px-8 text-base font-bold text-white transition-opacity hover:opacity-90 sm:w-auto sm:min-w-64"
            href="/persetujuan"
          >
            Mulai PEKA DULU
          </Link>
          <Link
            className="flex h-[52px] w-full items-center justify-center rounded-tombol border-2 border-adukan px-8 text-base font-bold text-adukan transition-colors hover:bg-adukan/5 sm:w-auto sm:min-w-64"
            href="/adukan"
          >
            Saya punya kendala sekarang
          </Link>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {MODUL.map((m) => (
            <Link
              className="flex items-start gap-4 rounded-kartu border border-garis bg-white p-4 shadow-kartu transition-colors hover:border-[color:currentColor] md:flex-col"
              href={m.href}
              key={m.href}
              style={{ color: `var(--color-${m.warna})` }}
            >
              <Finder className="mt-1 size-8 shrink-0 md:mt-0" warna={m.warna} />
              <span className="flex flex-col gap-1">
                <span className="text-subjudul text-institusi">{m.judul}</span>
                <span className="text-kecil text-tinta-70">{m.isi}</span>
              </span>
            </Link>
          ))}
        </section>

        <footer className="flex justify-center pt-6">
          <Link
            className="font-mono text-data uppercase text-tinta-70 underline decoration-1 underline-offset-4 hover:text-institusi"
            href="/belajar/checklist"
          >
            Checklist Sebelum Bayar
          </Link>
        </footer>
      </Halaman>
    </>
  );
}
