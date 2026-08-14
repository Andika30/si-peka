"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, XCircle } from "lucide-react";
import Ilustrasi from "@/components/Ilustrasi";
import { Angka, Rayakan } from "@/components/gerak";
import { Halaman, Kartu, KotakStat, Tombol, warnaTeks } from "@/components/ui";
import type { Kuis, Topik } from "@/lib/tipe";
import { langgan, snapshot, snapshotServer } from "@/lib/skor";

/**
 * Hasil kuis. Sesuai blok konsep, keluarannya bukan sekadar nilai melainkan
 * pembahasan jawaban dan rekomendasi materi yang perlu dibaca ulang — kuis di
 * sini alat belajar, bukan alat menilai.
 */
export default function HasilKuis({ k, t }: { k: Kuis; t: Topik }) {
  const sesi = useSyncExternalStore(langgan, snapshot, snapshotServer);
  const hasil = sesi.kuis[k.id];

  const skor = hasil?.skor ?? 0;
  const benar = hasil?.benar ?? 0;
  const total = hasil?.total ?? k.soal.length;
  const keliru = hasil?.keliru ?? [];
  const kuat = keliru.length === 0;

  return (
    <Halaman sempit>
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          {/* Nada gambarnya ikut hasil, bukan selalu merayakan. */}
          <Rayakan>
            <Ilustrasi
              className="mx-auto mb-4 w-48"
              nama={kuat ? "piala" : "kosong"}
              warna={kuat ? "emas" : t.warna}
            />
          </Rayakan>

          <h1 className="text-display text-tinta">
            {kuat ? "Semua benar" : "Ada yang perlu dibaca ulang"}
          </h1>
          <p className="mt-2 text-isi text-tinta-70">{k.judul}</p>

          <div className="my-8 rounded-kartu border border-garis bg-white p-6 shadow-kartu">
            <p className="font-mono text-data uppercase text-tinta-55">Jawaban benar</p>
            <p className={`text-6xl font-extrabold ${warnaTeks(t.warna)}`}>
              <Angka akhiran="%" durasi={1} nilai={skor} />
            </p>
            <p className="mt-1 text-kecil text-tinta-55">
              {benar} dari {total} pertanyaan
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <KotakStat label="Benar" nilai={benar} warna="peduli" />
              <KotakStat label="Belum tepat" nilai={total - benar} warna="waspada" />
            </div>
          </div>
        </div>

        {/* Rekomendasi materi: inti dari kuis ini. Yang dilihat pengguna bukan
            "kamu gagal", melainkan bagian mana yang belum nyangkut. */}
        {keliru.length > 0 ? (
          <Kartu aksen={t.warna} className="mb-6">
            <h2 className="mb-1 text-subjudul text-tinta">Yang belum tepat</h2>
            <p className="mb-4 text-kecil text-tinta-55">
              Baca ulang bagian ini di materinya, lalu coba kuisnya lagi.
            </p>
            <ul className="flex flex-col gap-4">
              {keliru.map((i) => (
                <li className="flex gap-3" key={i}>
                  <XCircle className="mt-0.5 size-5 shrink-0 text-waspada" aria-hidden />
                  <span>
                    <span className="block text-isi font-bold text-tinta">
                      {k.soal[i].pertanyaan}
                    </span>
                    <span className="mt-1 block text-isi text-tinta-70">{k.soal[i].pembahasan}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Kartu>
        ) : (
          <Kartu aksen="peduli" className="mb-6">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-peduli" aria-hidden />
              <p className="text-isi text-tinta">
                Semua pertanyaan terjawab benar. Lanjut ke materi berikutnya atau uji dirimu lewat
                simulasi transaksi.
              </p>
            </div>
          </Kartu>
        )}

        <Link
          className="mb-6 flex items-center gap-3 rounded-dalam border border-garis bg-white p-4 transition-colors hover:border-adukan"
          href={`/materi/${t.id}`}
        >
          <BookOpen className={`size-5 shrink-0 ${warnaTeks(t.warna)}`} aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="block font-mono text-data uppercase text-tinta-55">Materi terkait</span>
            <span className="block text-kecil font-bold text-tinta">{t.judul}</span>
          </span>
          <ArrowRight className="size-4 shrink-0 text-tinta-55" aria-hidden />
        </Link>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Tombol className="sm:flex-1" href={`/kuis/${k.id}`} jenis="garis">
            Ulangi kuis
          </Tombol>
          <Tombol className="sm:flex-1" href="/materi">
            Materi lainnya
          </Tombol>
        </div>
      </div>
    </Halaman>
  );
}
