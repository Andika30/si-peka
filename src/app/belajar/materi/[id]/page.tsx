import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowLeftRight,
  CheckCircle2,
  KeyRound,
  QrCode,
  ScanLine,
  ShieldCheck,
} from "lucide-react";
import { Eyebrow, Halaman, Kartu, Peringatan, Tombol } from "@/components/dasar";
import { materi } from "@/lib/konten";

const IKON = {
  qr: QrCode,
  pindai: ScanLine,
  transfer: ArrowLeftRight,
  kunci: KeyRound,
  berizin: ShieldCheck,
} as const;

/** Semua materi dibuat statis saat build — tidak ada pemanggilan jaringan. */
export function generateStaticParams() {
  return materi.map((m) => ({ id: m.id }));
}

export default async function HalamanMateri({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const indeks = materi.findIndex((m) => m.id === id);
  if (indeks === -1) notFound();

  const m = materi[indeks];
  const Ikon = IKON[m.ikon as keyof typeof IKON] ?? QrCode;
  const sebelum = materi[indeks - 1];
  const sesudah = materi[indeks + 1];

  return (
    <>
      <Halaman sempit>
        <div className="mb-6">
          <Eyebrow warna="peduli">
            Peduli &middot; {indeks + 1} dari {materi.length}
          </Eyebrow>
        </div>

        {/* Satu layar, satu konsep. Bukan halaman panjang yang digulir. */}
        <div className="md:grid md:grid-cols-5 md:items-start md:gap-10">
          <div className="md:col-span-3">
            <h1 className="mb-4 text-judul text-tinta">{m.judul}</h1>
            <p className="mb-6 text-isi text-tinta-70">{m.isi}</p>
          </div>

          <Kartu className="mb-6 flex flex-col items-center md:col-span-2 md:mb-0">
            <div className="mb-4 flex size-20 items-center justify-center rounded-kartu bg-peduli-lembut">
              <Ikon className="size-10 text-peduli" aria-hidden />
            </div>
            <span className="font-mono text-data uppercase text-tinta-55">Ilustrasi</span>
          </Kartu>
        </div>

        <ul className="mb-6 mt-6 flex flex-col gap-4">
          {m.poin.map((p) => (
            <li className="flex gap-3" key={p}>
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-peduli" aria-hidden />
              <span className="text-isi text-tinta">{p}</span>
            </li>
          ))}
        </ul>

        {m.peringatan ? <Peringatan>{m.peringatan}</Peringatan> : null}
      </Halaman>

      <div className="fixed inset-x-0 bottom-0 border-t border-garis bg-kertas px-5 py-4 md:px-8">
        <div className="mx-auto flex max-w-[42.5rem] gap-2">
          {sebelum ? (
            <Tombol href={`/belajar/materi/${sebelum.id}`} jenis="garis">
              <ArrowLeft className="size-5" aria-hidden />
              Kembali
            </Tombol>
          ) : null}

          {sesudah ? (
            <Tombol className="flex-1" href={`/belajar/materi/${sesudah.id}`}>
              Lanjut
              <ArrowRight className="size-5" aria-hidden />
            </Tombol>
          ) : (
            /* Materi terakhir menutup modul dengan checklist, bukan buntu. */
            <Tombol className="flex-1" href="/belajar/checklist">
              Buka Checklist Sebelum Bayar
              <ArrowRight className="size-5" aria-hidden />
            </Tombol>
          )}
        </div>
      </div>
    </>
  );
}
