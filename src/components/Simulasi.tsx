"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { Finder, Halaman, KartuPilihan } from "@/components/dasar";
import type { Skenario } from "@/lib/konten";

type Tahap = { jenis: "soal" } | { jenis: "konsekuensi"; opsi: number } | { jenis: "alasan" };

export default function Simulasi({
  skenario,
  nomor,
  total,
}: {
  skenario: Skenario;
  nomor: number;
  total: number;
}) {
  const [tahap, setTahap] = useState<Tahap>({ jenis: "soal" });
  const [dipilih, setDipilih] = useState<number | null>(null);

  function jawab(i: number) {
    setDipilih(i);
    // Pilihan keliru tidak langsung divonis. Akibatnya diperlihatkan lebih
    // dulu — itu yang membuatnya terasa simulasi, bukan kuis bersampul.
    setTahap(skenario.opsi[i].aman ? { jenis: "alasan" } : { jenis: "konsekuensi", opsi: i });
  }

  const berikutnya = nomor < total ? `/simulasi/${nomor + 1}` : "/cek/akhir";
  const labelBerikutnya = nomor < total ? "Skenario berikutnya" : "Selesai, lanjut ke cek akhir";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between bg-institusi px-5 md:px-8">
        <span className="w-10" />
        <span className="text-judul tracking-tight text-white">PeKA</span>
        <Link aria-label="Tutup simulasi" className="flex size-10 items-center justify-center text-white" href="/">
          <X className="size-6" aria-hidden />
        </Link>
      </header>

      <Halaman className="pb-56">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            {Array.from({ length: total }, (_, i) => (
              <Finder
                key={i}
                status={i + 1 < nomor ? "selesai" : i + 1 === nomor ? "berjalan" : "kosong"}
                warna={i + 1 <= nomor ? "kenali" : undefined}
              />
            ))}
          </div>
          <span className="font-mono text-data uppercase text-tinta-55">
            Kenali &middot; Skenario {nomor} dari {total}
          </span>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-10">
          {/* Kartu konteks meniru layar konfirmasi pembayaran sungguhan.
              Tidak ada bagian yang diberi warna merah: menyadari sendiri
              kejanggalannya justru yang sedang diuji. */}
          <div className="mb-6 rounded-kartu border border-garis bg-white p-6 shadow-kartu lg:mb-0">
            <div className="mb-6 rounded-tombol border border-garis bg-kertas p-4">
              {skenario.konteks.map((k, i) => (
                <div key={k.label}>
                  {i > 0 ? <div className="my-4 border-t border-dashed border-garis" /> : null}
                  <p className="mb-1 font-mono text-data uppercase text-tinta-55">{k.label}</p>
                  <p className="text-subjudul text-tinta">{k.nilai}</p>
                </div>
              ))}
            </div>
            <p className="text-isi text-tinta">{skenario.situasi}</p>
          </div>

          <div className="flex flex-col gap-2">
            {skenario.opsi.map((o, i) => {
              const keadaan =
                dipilih === null
                  ? "netral"
                  : dipilih === i
                    ? o.aman
                      ? "benar"
                      : "salah"
                    : "redup";
              return (
                <KartuPilihan
                  disabled={dipilih !== null}
                  keadaan={keadaan}
                  key={o.teks}
                  onClick={() => jawab(i)}
                >
                  <span className={`text-isi text-tinta ${dipilih === i ? "font-bold" : ""}`}>
                    {o.teks}
                  </span>
                </KartuPilihan>
              );
            })}
          </div>
        </div>
      </Halaman>

      {tahap.jenis !== "soal" ? (
        <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-kartu border-t border-garis bg-white px-5 pt-4 pb-6 shadow-[0_-4px_20px_rgb(11_27_51_/_0.08)] md:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-black/10" />

            {tahap.jenis === "konsekuensi" ? (
              <>
                <div className="mb-3 flex items-center gap-2">
                  <AlertCircle className="size-5 text-waspada" aria-hidden />
                  <span className="font-mono text-data uppercase text-waspada">
                    Yang terjadi berikutnya
                  </span>
                </div>
                <p className="mb-5 text-judul text-tinta">{skenario.opsi[tahap.opsi].konsekuensi}</p>
                <button
                  className="flex h-[52px] w-full items-center justify-center rounded-tombol bg-adukan px-6 text-base font-bold text-white transition-opacity hover:opacity-90"
                  onClick={() => setTahap({ jenis: "alasan" })}
                  type="button"
                >
                  Lalu apa yang lebih aman?
                </button>
              </>
            ) : (
              <>
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-peduli" aria-hidden />
                  <span className="font-mono text-data uppercase text-peduli">
                    Langkah yang aman
                  </span>
                </div>
                {/* Penjelasannya yang paling besar, bukan vonisnya —
                    "benar/salah" tidak mengajarkan apa pun. */}
                <p className="mb-5 text-judul text-tinta">{skenario.alasan}</p>
                <Link
                  className="flex h-[52px] w-full items-center justify-center rounded-tombol bg-adukan px-6 text-base font-bold text-white transition-opacity hover:opacity-90"
                  href={berikutnya}
                >
                  {labelBerikutnya}
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
