"use client";

import { useActionState, useState } from "react";
import { BookOpen, Gamepad2, Gavel, LayoutGrid, MessageSquare } from "lucide-react";
import AppShell from "@/components/AppShell";
import Ilustrasi from "@/components/Ilustrasi";
import { Chip, Halaman, Judul, Kartu, Tombol } from "@/components/ui";
import type { Warna } from "@/lib/tipe";
import { kirimFeedback, type HasilKirimFeedback } from "@/app/aksi-peserta";

const AWAL: HasilKirimFeedback = {};

const JENIS: { id: string; label: string; Ikon: typeof BookOpen; warna: Warna }[] = [
  { id: "materi", label: "Materi", Ikon: BookOpen, warna: "adukan" },
  { id: "simulasi", label: "Simulasi", Ikon: Gamepad2, warna: "peduli" },
  { id: "aplikasi", label: "Aplikasi", Ikon: LayoutGrid, warna: "kenali" },
  { id: "adukan", label: "Informasi pengaduan", Ikon: Gavel, warna: "ungu" },
  { id: "lainnya", label: "Lainnya", Ikon: MessageSquare, warna: "institusi" },
];

const BATAS = 500;

export default function Feedback() {
  const [pilih, setPilih] = useState("materi");
  const [komentar, setKomentar] = useState("");
  const [hasil, kirim, sedang] = useActionState(kirimFeedback, AWAL);

  if (hasil.berhasil) {
    return (
      <AppShell>
        <Halaman sempit>
          <div className="mx-auto max-w-md py-12 text-center">
            <Ilustrasi className="mx-auto mb-4 w-48" nama="feedback" warna="peduli" />
            <h1 className="text-display text-tinta">Terima kasih</h1>
            <p className="mt-2 text-isi text-tinta-70">
Masukanmu terkirim dan akan dibaca saat evaluasi media. Yang tersimpan hanya
              tulisanmu — tanpa nama, tanpa kontak, tanpa penanda perangkat.
            </p>
            <div className="mt-8 flex flex-col gap-2">
              <Tombol href="/beranda">Kembali ke beranda</Tombol>
<Tombol href="/feedback" jenis="teks">
                Tulis masukan lain
              </Tombol>
            </div>
          </div>
        </Halaman>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Halaman sempit>
        <form action={kirim}>
        <input name="jenis" type="hidden" value={pilih} />
        <Judul sub="Masukan kamu membantu kami memperbaiki media ini sebelum dipakai lebih luas.">
          Kirim masukan
        </Judul>

        <Kartu aksen="ungu" className="mb-4 flex flex-col items-center gap-4 sm:flex-row" nada="ungu">
          <Ilustrasi className="w-40 shrink-0 sm:w-32" nama="feedback" warna="ungu" />
          <p className="text-center text-isi text-tinta-70 sm:text-left">
            Kami ingin mendengar pendapatmu. Bagian mana yang membingungkan, mana yang membantu,
            dan apa yang sebaiknya ditambahkan.
          </p>
        </Kartu>

        <Kartu className="mb-4">
          <h2 className="mb-3 text-subjudul text-tinta">Masukan tentang apa?</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {JENIS.map(({ id, label, Ikon, warna }) => {
              const aktif = pilih === id;
              return (
                <button
                  aria-pressed={aktif}
                  className={`flex flex-col items-center gap-2 rounded-dalam border p-4 transition-colors ${
                    aktif ? "border-adukan bg-adukan-lembut" : "border-garis bg-white hover:bg-kertas"
                  }`}
                  key={id}
                  onClick={() => setPilih(id)}
                  type="button"
                >
                  <Chip Ikon={Ikon} warna={warna} />
                  <span className="text-center text-kecil font-bold text-tinta">{label}</span>
                </button>
              );
            })}
          </div>
        </Kartu>

        <Kartu className="mb-6">
          <label className="mb-2 block text-subjudul text-tinta" htmlFor="komentar">
            Tulis komentar
          </label>
          <textarea
            className="min-h-40 w-full resize-y rounded-dalam border border-garis bg-kertas p-4 text-isi text-tinta placeholder:text-tinta-55"
            id="komentar"
            maxLength={BATAS}
            name="komentar"
            onChange={(e) => setKomentar(e.target.value)}
            placeholder="Tuliskan komentar atau saran kamu di sini…"
            value={komentar}
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="text-kecil text-tinta-55">
              Jangan tulis nomor rekening, PIN, atau OTP di sini.
            </p>
            <span className="font-mono text-data text-tinta-55">
              {komentar.length}/{BATAS}
            </span>
          </div>
        </Kartu>

        {hasil.galat ? (
          <p className="mb-4 rounded-dalam border border-waspada/30 bg-waspada-lembut p-3 text-kecil font-bold text-waspada">
            {hasil.galat}
          </p>
        ) : null}

        <Tombol
          className="w-full sm:w-auto"
          disabled={sedang || komentar.trim().length === 0}
          type="submit"
        >
          {sedang ? "Mengirim…" : "Kirim masukan"}
        </Tombol>
        </form>
      </Halaman>
    </AppShell>
  );
}
