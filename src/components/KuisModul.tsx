"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, X, XCircle } from "lucide-react";
import { Getar, Muncul, Tukar } from "@/components/gerak";
import { BarProgres, Halaman, KartuPilihan, Tombol, warnaTeks } from "@/components/ui";
import type { Kuis, Topik } from "@/lib/tipe";
import { simpanKuis } from "@/lib/skor";
import { catatKuisSelesai } from "@/app/aksi-peserta";

const HURUF = ["A", "B", "C", "D", "E"];

export default function KuisModul({ k, t }: { k: Kuis; t: Topik }) {
  const router = useRouter();
  const [ke, setKe] = useState(0);
  const [dipilih, setDipilih] = useState<number | null>(null);
  const [benar, setBenar] = useState(0);
  // Nomor soal yang keliru dicatat supaya halaman hasil bisa membahasnya
  // satu per satu, bukan hanya menampilkan angka skor.
  const [keliru, setKeliru] = useState<number[]>([]);

  const s = k.soal[ke];
  const terakhir = ke === k.soal.length - 1;
  const tepat = dipilih === s.kunci;

  function jawab(i: number) {
    if (dipilih !== null) return;
    setDipilih(i);
    if (i === s.kunci) setBenar((n) => n + 1);
    else setKeliru((d) => [...d, ke]);
  }

  function lanjut() {
    if (terakhir) {
      // Skor final dihitung di sini karena state `benar` sudah termasuk
      // jawaban terakhir saat tombol ini muncul.
      simpanKuis(k.id, benar, k.soal.length, keliru);
      // Yang dikirim ke server hanya angka dan nomor soal — tanpa penanda
      // siapa pun. Hasil pribadinya tetap di peramban lewat simpanKuis.
      void catatKuisSelesai(k.id, Math.round((benar / k.soal.length) * 100), keliru);
      router.push(`/kuis/${k.id}/hasil`);
      return;
    }
    setKe((n) => n + 1);
    setDipilih(null);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-garis bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-kecil font-bold text-tinta">{k.judul}</p>
            <p className="font-mono text-data uppercase text-tinta-55">
              Pertanyaan {ke + 1} dari {k.soal.length}
            </p>
          </div>
          <Link
            aria-label="Keluar dari kuis"
            className="grid size-10 shrink-0 place-content-center rounded-tombol text-tinta-55 hover:bg-kertas"
            href={`/materi/${t.id}`}
          >
            <X className="size-5" aria-hidden />
          </Link>
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-3 sm:px-6">
          <BarProgres nilai={((ke + (dipilih === null ? 0 : 1)) / k.soal.length) * 100} warna={t.warna} />
        </div>
      </header>

      <Halaman sempit>
        {/* Soal bertukar mendatar — arah gerakannya menandakan maju ke soal
            berikutnya, bukan sekadar isi yang berganti. */}
        <Tukar arah="mendatar" kunci={ke}>
          <h1 className="mb-6 text-judul text-tinta">{s.pertanyaan}</h1>
        </Tukar>

        <div className="mb-6 flex flex-col gap-3">
          {s.opsi.map((o, i) => {
            const keadaan =
              dipilih === null
                ? "netral"
                : i === s.kunci
                  ? "benar"
                  : dipilih === i
                    ? "salah"
                    : "redup";
            return (
              // Hanya kartu yang salah dipilih yang bergetar — getaran adalah
              // bahasa "ada yang salah", jadi tidak boleh mengenai yang lain.
              <Getar aktif={dipilih === i && i !== s.kunci} key={o}>
                <KartuPilihan
                  disabled={dipilih !== null}
                  huruf={HURUF[i]}
                  keadaan={keadaan}
                  onClick={() => jawab(i)}
                >
                  <span className="text-isi text-tinta">{o}</span>
                </KartuPilihan>
              </Getar>
            );
          })}
        </div>

        {dipilih !== null ? (
          <>
            {/* Pembahasan naik sedikit saat muncul — supaya terbaca sebagai
                jawaban atas pilihan barusan, bukan teks yang sedari tadi ada. */}
            <Muncul
              className={`mb-6 rounded-dalam border p-4 ${
                tepat ? "border-peduli/30 bg-peduli-lembut" : "border-waspada/30 bg-waspada-lembut"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                {tepat ? (
                  <CheckCircle2 className="size-5 text-peduli" aria-hidden />
                ) : (
                  <XCircle className="size-5 text-waspada" aria-hidden />
                )}
                <span
                  className={`font-mono text-data uppercase ${tepat ? "text-peduli" : "text-waspada"}`}
                >
                  {tepat ? "Benar" : "Belum tepat"}
                </span>
              </div>
              {/* Penjelasannya yang penting, bukan vonisnya. */}
              <p className="text-isi text-tinta">{s.pembahasan}</p>
            </Muncul>

            <Tombol className="w-full sm:w-auto" onClick={lanjut}>
              {terakhir ? "Lihat hasil" : "Selanjutnya"}
              <ArrowRight className="size-4" aria-hidden />
            </Tombol>
          </>
        ) : (
          <p className={`text-kecil ${warnaTeks(t.warna)}`}>Pilih satu jawaban untuk lanjut.</p>
        )}
      </Halaman>
    </>
  );
}
