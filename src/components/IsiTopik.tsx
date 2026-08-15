"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, LifeBuoy } from "lucide-react";
import { ambilIkon } from "@/components/ikon";
import Ilustrasi, { ilustrasiModul } from "@/components/Ilustrasi";
import { Chip, Eyebrow, Halaman, Peringatan, Tombol } from "@/components/ui";
import BacaBertahap from "@/components/BacaBertahap";
import type { Masalah, Topik } from "@/lib/tipe";
import { langgan, snapshot, snapshotServer, tandaiMateri } from "@/lib/skor";
import { catatMateriDibuka } from "@/app/aksi-peserta";

/**
 * Satu materi. Selesai berarti dibuka sampai habis — tidak ada persentase
 * bertahap, karena materinya memang pendek dan progres berbutir hanya
 * menambah angka tanpa menambah arti.
 */
export default function IsiTopik({
  t,
  kategori,
  panduan,
}: {
  t: Topik;
  kategori?: string;
  /** Panduan pengaduan yang relevan — jembatan dari "tahu" ke "kalau kena". */
  panduan?: Pick<Masalah, "id" | "label">;
}) {
  const sesi = useSyncExternalStore(langgan, snapshot, snapshotServer);
  const Ikon = ambilIkon(t.ikon);
  const hasil = sesi.kuis[t.kuisTerkait];

  // Menulis ke sistem luar — localStorage untuk progres pribadi, dan
  // penghitung anonim di server untuk dasbor pengelola. Keduanya pemakaian
  // effect yang memang dianjurkan.
  useEffect(() => {
    tandaiMateri(t.id);
    void catatMateriDibuka(t.id);
  }, [t.id]);

  return (
    <Halaman sempit>
      <Link
        className="mb-4 inline-flex items-center gap-2 text-kecil font-bold text-tinta-55 hover:text-institusi"
        href="/materi"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Materi
      </Link>

      <div className="mb-4">
        <Eyebrow warna={t.warna}>{kategori ?? "Materi"}</Eyebrow>
      </div>

      {/* Ilustrasi jadi pembuka: di ponsel berdiri di atas judul, di layar
          lebar berdampingan supaya teks tidak terdorong ke bawah. */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="shrink-0 rounded-kartu bg-white p-3 shadow-kartu sm:p-4">
          <Ilustrasi className="mx-auto w-40 sm:w-44" nama={ilustrasiModul(t.ikon)} warna={t.warna} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 sm:hidden">
            <Chip Ikon={Ikon} warna={t.warna} />
          </div>
          <h1 className="text-display text-tinta">{t.judul}</h1>
          <p className="mt-1 text-isi text-tinta-70">{t.ringkas}</p>
        </div>
      </div>

      <BacaBertahap
        isi={t.isi}
        selesai={
          <>
            {t.peringatan ? <Peringatan>{t.peringatan}</Peringatan> : null}

            <div className="mb-6 flex flex-col gap-2 sm:flex-row">
        <Tombol className="sm:flex-1" href={`/kuis/${t.kuisTerkait}`}>
          {hasil ? "Ulangi kuis materi ini" : "Uji pemahaman"}
          <ArrowRight className="size-4" aria-hidden />
        </Tombol>
        {hasil ? (
          <span className="flex h-12 items-center justify-center gap-2 rounded-tombol bg-peduli-lembut px-5 text-sm font-bold text-peduli">
            <CheckCircle2 className="size-4" aria-hidden />
            Skor terakhir {hasil.skor}%
          </span>
        ) : null}
      </div>

      {panduan ? (
        <Link
          className="mb-8 flex items-center gap-3 rounded-dalam border border-garis bg-white p-4 transition-colors hover:border-adukan"
          href={`/panduan/hasil/${panduan.id}`}
        >
          <LifeBuoy className="size-5 shrink-0 text-adukan" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="block text-kecil font-bold text-tinta">
              Kalau kamu mengalaminya: {panduan.label}
            </span>
            <span className="block text-kecil text-tinta-55">
              Lihat langkah dan ke mana harus mengadu
            </span>
          </span>
          <ArrowRight className="size-4 shrink-0 text-tinta-55" aria-hidden />
        </Link>
      ) : null}

            <p className="mb-6 font-mono text-data uppercase text-tinta-55">
              Sumber: {t.sumber}
            </p>
          </>
        }
        warna={t.warna}
      />

      {/* Tidak ada tautan ke materi sebelumnya atau berikutnya. Tiap materi
          berdiri sendiri — orang datang karena satu pertanyaan tertentu, dan
          tidak seharusnya terseret ke materi lain begitu selesai. Kembali ke
          daftar sudah tersedia di tautan atas. */}
    </Halaman>
  );
}
