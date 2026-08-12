import Link from "next/link";
import Nav from "@/components/Nav";
import { Finder, Halaman, Judul } from "@/components/dasar";
import { materi } from "@/lib/konten";

const PILAR = [
  {
    warna: "peduli" as const,
    judul: "Peduli",
    isi: "Periksa identitas penerima sebelum kamu membayar.",
    href: `/belajar/materi/${materi[0].id}`,
    keterangan: `${materi.length} materi singkat`,
  },
  {
    warna: "kenali" as const,
    judul: "Kenali",
    isi: "Hadapi skenario nyata dan lihat akibat dari pilihanmu.",
    href: "/simulasi",
    keterangan: "Simulasi bercabang",
  },
  {
    warna: "adukan" as const,
    judul: "Adukan",
    isi: "Kenali kanal resmi yang sesuai dengan jenis masalahmu.",
    href: "/adukan",
    keterangan: "Pengarah kanal",
  },
];

export default function ModulBelajar() {
  return (
    <>
      <Nav />
      <Halaman>
        <Judul sub="Tingkatkan literasi digitalmu melalui tiga pilar perlindungan transaksi keuangan.">
          Modul Belajar
        </Judul>

        <div className="grid gap-4 md:grid-cols-3 md:items-start">
          {PILAR.map((p) => (
            <Link
              className="block rounded-kartu border border-garis bg-white p-6 shadow-kartu transition-colors hover:bg-black/2"
              href={p.href}
              key={p.judul}
            >
              <Finder className="mb-4" warna={p.warna} />
              <h2 className="mb-2 text-judul text-tinta">{p.judul}</h2>
              <p className="text-isi text-tinta-70">{p.isi}</p>
              <div className="mt-6 border-t border-garis pt-4">
                <span
                  className="font-mono text-data uppercase"
                  style={{ color: `var(--color-${p.warna})` }}
                >
                  {p.keterangan}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <Link
            className="font-mono text-data uppercase text-tinta-70 underline decoration-1 underline-offset-4 hover:text-institusi"
            href="/belajar/checklist"
          >
            Checklist Sebelum Bayar
          </Link>
        </div>
      </Halaman>
    </>
  );
}
