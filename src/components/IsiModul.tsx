"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { ambilIkon } from "@/components/ikon";
import Ilustrasi, { ilustrasiModul } from "@/components/Ilustrasi";
import {
  BarProgres,
  Chip,
  Eyebrow,
  Halaman,
  Kartu,
  Peringatan,
  Tombol,
  warnaTeks,
} from "@/components/ui";
import type { Modul } from "@/lib/konten";
import { langgan, progresModul, snapshot, snapshotServer, tandaiMateri } from "@/lib/skor";
import { useSyncExternalStore } from "react";

export default function IsiModul({
  m,
  sebelum,
  sesudah,
  nomorUrut,
  total,
}: {
  m: Modul;
  sebelum?: { id: string; judul: string };
  sesudah?: { id: string; judul: string };
  nomorUrut: number;
  total: number;
}) {
  const sesi = useSyncExternalStore(langgan, snapshot, snapshotServer);
  const Ikon = ambilIkon(m.ikon);
  const hasil = sesi.kuis[m.id];

  // Membaca materi sampai halaman ini terbuka dihitung setengah progres modul.
  // Efek dipakai untuk menulis ke sistem luar (localStorage), bukan mengatur
  // state React — itu pemakaian effect yang memang dianjurkan.
  useEffect(() => {
    tandaiMateri(m.id);
  }, [m.id]);

  return (
    <Halaman sempit>
      <Link
        className="mb-4 inline-flex items-center gap-2 text-kecil font-bold text-tinta-55 hover:text-institusi"
        href="/materi"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Materi &amp; Kuis
      </Link>

      <div className="mb-4">
        <Eyebrow warna={m.warna}>
          Modul {m.nomor} &middot; {nomorUrut} dari {total}
        </Eyebrow>
      </div>

      {/* Ilustrasi jadi pembuka materi: di ponsel ia berdiri di atas judul,
          di layar lebar berdampingan supaya teks tidak terdorong ke bawah. */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="shrink-0 rounded-kartu bg-white p-3 shadow-kartu sm:p-4">
          <Ilustrasi className="mx-auto w-40 sm:w-44" nama={ilustrasiModul(m.ikon)} warna={m.warna} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 sm:hidden">
            <Chip Ikon={Ikon} warna={m.warna} />
          </div>
          <h1 className="text-display text-tinta">{m.judul}</h1>
          <p className="mt-1 text-isi text-tinta-70">{m.ringkas}</p>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex-1">
          <BarProgres nilai={progresModul(sesi, m.id)} warna={m.warna} />
        </div>
        <span className={`font-mono text-data ${warnaTeks(m.warna)}`}>
          {progresModul(sesi, m.id)}%
        </span>
      </div>

      <article className="mb-6 flex flex-col gap-4">
        {m.materi.paragraf.map((p) => (
          <p className="text-isi leading-relaxed text-tinta-70" key={p.slice(0, 24)}>
            {p}
          </p>
        ))}
      </article>

      <Kartu className="mb-6" aksen={m.warna}>
        <h2 className="mb-4 text-subjudul text-tinta">Materi ini membahas</h2>
        <ul className="flex flex-col gap-3">
          {m.materi.poin.map((p) => (
            <li className="flex gap-3" key={p}>
              <CheckCircle2 className={`mt-0.5 size-5 shrink-0 ${warnaTeks(m.warna)}`} aria-hidden />
              <span className="text-isi text-tinta">{p}</span>
            </li>
          ))}
        </ul>
      </Kartu>

      {m.materi.peringatan ? <Peringatan>{m.materi.peringatan}</Peringatan> : null}

      <div className="mb-8 flex flex-col gap-2 sm:flex-row">
        <Tombol className="sm:flex-1" href={`/kuis/${m.id}`}>
          {hasil ? "Ulangi kuis modul" : "Mulai kuis"}
          <ArrowRight className="size-4" aria-hidden />
        </Tombol>
        {hasil ? (
          <span className="flex h-12 items-center justify-center gap-2 rounded-tombol bg-peduli-lembut px-5 text-sm font-bold text-peduli">
            <CheckCircle2 className="size-4" aria-hidden />
            Skor terakhir {hasil.skor}%
          </span>
        ) : null}
      </div>

      <nav className="flex items-center justify-between gap-3 border-t border-garis pt-5">
        {sebelum ? (
          <Link
            className="flex min-w-0 items-center gap-2 text-kecil text-tinta-70 hover:text-institusi"
            href={`/materi/${sebelum.id}`}
          >
            <ArrowLeft className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{sebelum.judul}</span>
          </Link>
        ) : (
          <span />
        )}
        {sesudah ? (
          <Link
            className="flex min-w-0 items-center gap-2 text-right text-kecil text-tinta-70 hover:text-institusi"
            href={`/materi/${sesudah.id}`}
          >
            <span className="truncate">{sesudah.judul}</span>
            <ArrowRight className="size-4 shrink-0" aria-hidden />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </Halaman>
  );
}
