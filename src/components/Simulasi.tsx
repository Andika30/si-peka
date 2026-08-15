"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, X } from "lucide-react";
import { Getar, Muncul } from "@/components/gerak";
import { BarProgres, Halaman, KartuPilihan, Tombol } from "@/components/ui";
import type { Skenario } from "@/lib/tipe";
import { tandaiSimulasi } from "@/lib/skor";
import { catatSimulasiSelesai } from "@/app/aksi-peserta";

/**
 * Susunan layarnya sengaja sama persis dengan kuis: bilah lengket berisi
 * kemajuan di atas, kolom sempit untuk membaca, lalu pembahasan yang muncul
 * di bawah pilihan. Yang membedakan hanya isinya — bukan cara memakainya.
 */

const HURUF = ["A", "B", "C", "D", "E"];

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
    if (dipilih !== null) return;
    setDipilih(i);
    // Pilihan keliru tidak langsung divonis. Akibatnya diperlihatkan lebih
    // dulu — itu yang membuatnya terasa simulasi, bukan kuis bersampul.
    setTahap(skenario.opsi[i].aman ? { jenis: "alasan" } : { jenis: "konsekuensi", opsi: i });
    // Skenario dihitung selesai begitu dijawab — benar atau keliru sama saja,
    // karena yang dinilai di sini adalah berlatihnya, bukan skornya.
    tandaiSimulasi(nomor);
    // Penghitung anonim untuk dasbor: skenario mana yang sering keliru
    // menunjukkan modus mana yang paling belum dikenali orang.
    void catatSimulasiSelesai(skenario.id, skenario.opsi[i].aman);
  }

  // Tiap skenario berdiri sendiri: selesai satu berarti kembali ke daftar,
  // bukan terseret ke skenario berikutnya. Peserta yang datang karena satu
  // situasi tertentu tidak seharusnya dipaksa menjalani sisanya.
  const sudahDijawab = dipilih !== null;

  return (
    <>
      {/* md:top-14 supaya bilah kemajuan ini berhenti tepat di bawah bilah
          atas aplikasi, bukan bertumpuk dengannya. */}
      <header className="sticky top-0 z-20 border-b border-garis bg-white md:top-14">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-kecil font-bold text-tinta">Simulasi transaksi</p>
            <p className="font-mono text-data uppercase text-tinta-55">
              Skenario {nomor} dari {total}
            </p>
          </div>
          <Link
            aria-label="Keluar dari simulasi"
            className="grid size-10 shrink-0 place-content-center rounded-tombol text-tinta-55 hover:bg-kertas"
            href="/simulasi"
          >
            <X className="size-5" aria-hidden />
          </Link>
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-3 sm:px-6">
          {/* Kemajuan skenario INI, bukan kemajuan seluruh rangkaian —
              skenarionya berdiri sendiri, jadi bar yang mengisi sedikit demi
              sedikit sepanjang empat skenario akan menyesatkan. */}
          <BarProgres nilai={sudahDijawab ? 100 : 0} warna="kenali" />
        </div>
      </header>

      <Halaman sempit>
        {/* Kartu konteks meniru layar konfirmasi pembayaran sungguhan.
            Tidak ada bagian yang diberi warna merah: menyadari sendiri
            kejanggalannya justru yang sedang diuji. */}
        <div className="mb-6 rounded-kartu border border-garis bg-white p-5 shadow-kartu sm:p-6">
          {/* Tangkapan layar situasinya, kalau ada — ditaruh paling atas
              supaya terbaca sebagai "inilah yang kamu lihat di ponselmu". */}
          {skenario.gambar ? (
            <img
              alt={skenario.gambarAlt ?? "Tangkapan layar situasi"}
              className="mb-5 w-full rounded-tombol border border-garis"
              src={`/gambar/${skenario.gambar}`}
            />
          ) : null}

          <div className="mb-5 rounded-tombol border border-garis bg-kertas p-4">
            {skenario.konteks.map((k, i) => (
              <div key={k.label}>
                {i > 0 ? <div className="my-4 border-t border-dashed border-garis" /> : null}
                <p className="mb-1 font-mono text-data uppercase text-tinta-55">{k.label}</p>
                <p className="text-subjudul text-tinta">{k.nilai}</p>
              </div>
            ))}
          </div>
          <h1 className="text-judul text-tinta">{skenario.situasi}</h1>
        </div>

        <div className="mb-6 flex flex-col gap-3">
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
              // Hanya kartu yang salah dipilih yang bergetar — getaran adalah
              // bahasa "ada yang salah", jadi tidak boleh mengenai yang lain.
              <Getar aktif={dipilih === i && !o.aman} key={o.teks}>
                <KartuPilihan
                  disabled={dipilih !== null}
                  huruf={HURUF[i]}
                  keadaan={keadaan}
                  onClick={() => jawab(i)}
                >
                  <span className="text-isi text-tinta">{o.teks}</span>
                </KartuPilihan>
              </Getar>
            );
          })}
        </div>

        {tahap.jenis === "soal" ? (
          <p className="text-kecil text-kenali">Pilih satu tindakan untuk lanjut.</p>
        ) : null}

        {/* Akibat dari pilihan keliru. Diperlihatkan lebih dulu, sendirian,
            sebelum langkah yang aman — supaya sempat terbaca. */}
        {tahap.jenis === "konsekuensi" ? (
          <Muncul className="mb-6 rounded-dalam border border-waspada/30 bg-waspada-lembut p-4">
            <div className="mb-2 flex items-center gap-2">
              <AlertCircle className="size-5 text-waspada" aria-hidden />
              <span className="font-mono text-data uppercase text-waspada">
                Yang terjadi berikutnya
              </span>
            </div>
            <p className="mb-4 text-isi text-tinta">{skenario.opsi[tahap.opsi].konsekuensi}</p>
            <Tombol className="w-full sm:w-auto" onClick={() => setTahap({ jenis: "alasan" })}>
              Lalu apa yang lebih aman?
              <ArrowRight className="size-4" aria-hidden />
            </Tombol>
          </Muncul>
        ) : null}

        {tahap.jenis === "alasan" ? (
          <Muncul className="mb-6 rounded-dalam border border-peduli/30 bg-peduli-lembut p-4">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="size-5 text-peduli" aria-hidden />
              <span className="font-mono text-data uppercase text-peduli">Langkah yang aman</span>
            </div>
            {/* Penjelasannya yang penting, bukan vonisnya —
                "benar/salah" tidak mengajarkan apa pun. */}
            <p className="mb-4 text-isi text-tinta">{skenario.alasan}</p>
            <Tombol className="w-full sm:w-auto" href="/simulasi">
              Selesai, kembali ke daftar skenario
              <ArrowRight className="size-4" aria-hidden />
            </Tombol>
          </Muncul>
        ) : null}
      </Halaman>
    </>
  );
}
