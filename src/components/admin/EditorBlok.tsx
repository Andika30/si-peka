"use client";

import { useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Heading,
  ImagePlus,
  Layers,
  ListChecks,
  Pilcrow,
  Trash2,
  Video,
} from "lucide-react";
import type { BlokIsi } from "@/lib/tipe";

/**
 * Penyunting isi materi.
 *
 * Sengaja BUKAN editor WYSIWYG. Isi disimpan sebagai blok bertipe, bukan
 * HTML, sehingga:
 *
 *  - tipografi tetap dikendalikan aplikasi — tempelan dari Word tidak bisa
 *    membawa serta font, ukuran, dan warnanya sendiri;
 *  - tidak ada HTML dari luar yang perlu dibersihkan sebelum ditampilkan;
 *  - satu blok bisa dipindah tanpa menyentuh yang lain.
 *
 * Gambar diperlakukan sebagai blok setara paragraf, jadi ia bisa diselipkan
 * di mana saja di antara teks — yang secara praktik sama dengan "menyisipkan
 * gambar di dalam editor", tanpa menanggung biaya editor kaya.
 */

type Baris = {
  kunci: number;
  jenis: BlokIsi["jenis"];
  teks: string;
  keterangan: string;
  /** Nama berkas yang sudah tersimpan; kosong untuk gambar yang belum diunggah. */
  lama: string;
  /** Pratinjau berkas yang baru dipilih, belum tersimpan di server. */
  pratinjau?: string;
};

const IKON = {
  subjudul: Heading,
  paragraf: Pilcrow,
  poin: ListChecks,
  gambar: ImagePlus,
  "kartu-flip": Layers,
  video: Video,
} as const;

const NAMA = {
  subjudul: "Sub materi",
  paragraf: "Paragraf",
  poin: "Poin",
  gambar: "Gambar",
  "kartu-flip": "Kartu terbalik",
  video: "Video YouTube",
} as const;

const JENIS_BAWAAN = ["subjudul", "paragraf", "poin", "gambar"] as const;

export default function EditorBlok({
  awal,
  jenisTersedia = JENIS_BAWAAN,
}: {
  awal: BlokIsi[];
  /** Berita tidak mendukung `kartu-flip` maupun `subjudul` di skemanya —
      jadi jenis blok yang bisa ditambahkan dibatasi per pemakai, bukan
      dipukul rata untuk semua penyunting blok. */
  jenisTersedia?: readonly BlokIsi["jenis"][];
}) {
  const [baris, setBaris] = useState<Baris[]>(() =>
    (awal.length > 0 ? awal : [{ jenis: "paragraf" as const, teks: "" }]).map((b, i) => ({
      kunci: i,
      jenis: b.jenis,
      teks: b.jenis === "gambar" ? "" : b.teks,
      keterangan: b.keterangan ?? "",
      lama: b.jenis === "gambar" ? b.teks : "",
    })),
  );
  const berikutnya = useRef(baris.length);

  const tambah = (jenis: BlokIsi["jenis"]) => {
    setBaris((b) => [
      ...b,
      { kunci: berikutnya.current++, jenis, teks: "", keterangan: "", lama: "" },
    ]);
  };

  const buang = (kunci: number) => setBaris((b) => b.filter((x) => x.kunci !== kunci));

  const geser = (i: number, arah: -1 | 1) => {
    setBaris((b) => {
      const j = i + arah;
      if (j < 0 || j >= b.length) return b;
      const salin = [...b];
      [salin[i], salin[j]] = [salin[j], salin[i]];
      return salin;
    });
  };

  const pilihBerkas = (kunci: number, berkas: File | undefined) => {
    if (!berkas) return;
    const url = URL.createObjectURL(berkas);
    setBaris((b) => b.map((x) => (x.kunci === kunci ? { ...x, pratinjau: url } : x)));
  };

  return (
    <section className="mb-6 rounded-kartu border border-garis bg-kertas-tua/40 p-5">
      <h2 className="text-subjudul text-tinta">Isi materi</h2>
      <p className="mt-1 text-kecil text-tinta-55">
        Susun dari blok. Gambar bisa diselipkan di antara paragraf mana pun — urutan di sini persis
        urutan yang dibaca peserta.
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {baris.map((b, i) => {
          const Ikon = IKON[b.jenis];
          const gambarTampil = b.pratinjau ?? (b.lama ? `/gambar/${b.lama}` : null);

          return (
            <div className="rounded-dalam border border-garis bg-white p-4" key={b.kunci}>
              <input name={`blok.${b.kunci}.jenis`} type="hidden" value={b.jenis} />
              <input name={`blok.${b.kunci}.urutan`} type="hidden" value={i} />

              <div className="mb-3 flex items-center gap-2">
                <Ikon className="size-4 shrink-0 text-tinta-55" aria-hidden />
                <span className="font-mono text-data uppercase text-tinta-55">{NAMA[b.jenis]}</span>

                <div className="ml-auto flex items-center gap-1">
                  <button
                    aria-label="Pindahkan ke atas"
                    className="grid size-8 place-content-center rounded text-tinta-55 hover:bg-kertas hover:text-institusi disabled:opacity-25"
                    disabled={i === 0}
                    onClick={() => geser(i, -1)}
                    type="button"
                  >
                    <ChevronUp className="size-4" aria-hidden />
                  </button>
                  <button
                    aria-label="Pindahkan ke bawah"
                    className="grid size-8 place-content-center rounded text-tinta-55 hover:bg-kertas hover:text-institusi disabled:opacity-25"
                    disabled={i === baris.length - 1}
                    onClick={() => geser(i, 1)}
                    type="button"
                  >
                    <ChevronDown className="size-4" aria-hidden />
                  </button>
                  <button
                    aria-label="Hapus blok"
                    className="grid size-8 place-content-center rounded text-tinta-55 hover:bg-waspada-lembut hover:text-waspada disabled:opacity-25"
                    disabled={baris.length === 1}
                    onClick={() => buang(b.kunci)}
                    type="button"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>
              </div>

              {b.jenis === "gambar" ? (
                <>
                  <input name={`blok.${b.kunci}.lama`} type="hidden" value={b.lama} />

                  {gambarTampil ? (
                    <img
                      alt=""
                      className="mb-3 max-h-56 rounded-dalam border border-garis"
                      src={gambarTampil}
                    />
                  ) : null}

                  <input
                    accept="image/jpeg,image/png,image/webp"
                    className="block w-full text-kecil text-tinta-70 file:mr-3 file:rounded-tombol file:border-0 file:bg-adukan-lembut file:px-4 file:py-2 file:text-kecil file:font-bold file:text-adukan"
                    name={`blok.${b.kunci}.berkas`}
                    onChange={(e) => pilihBerkas(b.kunci, e.target.files?.[0])}
                    type="file"
                  />
                  <p className="mt-1 text-kecil text-tinta-55">
                    JPG, PNG, atau WEBP. Maksimal 2 MB.{" "}
                    {b.lama ? "Biarkan kosong kalau gambarnya tidak diganti." : ""}
                  </p>

                  <input
                    className="mt-3 h-11 w-full rounded-dalam border border-garis bg-kertas px-3 text-isi text-tinta"
                    defaultValue={b.keterangan}
                    name={`blok.${b.kunci}.keterangan`}
                    placeholder="Keterangan gambar — juga dipakai sebagai teks alternatif"
                    type="text"
                  />
                </>
              ) : b.jenis === "kartu-flip" ? (
                <>
                  <textarea
                    className="w-full rounded-dalam border border-garis bg-kertas p-3 text-isi leading-relaxed text-tinta"
                    defaultValue={b.teks}
                    maxLength={120}
                    name={`blok.${b.kunci}.teks`}
                    placeholder="Sisi depan — judul singkat atau pertanyaan"
                    rows={2}
                  />
                  <textarea
                    className="mt-3 w-full rounded-dalam border border-garis bg-kertas p-3 text-isi leading-relaxed text-tinta"
                    defaultValue={b.keterangan}
                    maxLength={255}
                    name={`blok.${b.kunci}.keterangan`}
                    placeholder="Sisi belakang — terlihat saat kartu diarahkan kursor atau diketuk"
                    rows={3}
                  />
                  <p className="mt-1 text-kecil text-tinta-55">
                    Muncul di antara paragraf sebagai kartu yang bisa dibalik. Sisi belakang
                    maksimal 255 karakter — dipakai untuk detail singkat, bukan penjelasan panjang.
                  </p>
                </>
              ) : b.jenis === "video" ? (
                <>
                  <input
                    className="h-11 w-full rounded-dalam border border-garis bg-kertas px-3 text-isi text-tinta"
                    defaultValue={b.teks}
                    name={`blok.${b.kunci}.teks`}
                    placeholder="Tempel tautan YouTube, mis. https://youtu.be/dQw4w9WgXcQ"
                    type="text"
                  />
                  <input
                    className="mt-3 h-11 w-full rounded-dalam border border-garis bg-kertas px-3 text-isi text-tinta"
                    defaultValue={b.keterangan}
                    name={`blok.${b.kunci}.keterangan`}
                    placeholder="Keterangan di bawah video (opsional)"
                    type="text"
                  />
                  <p className="mt-1 text-kecil text-tinta-55">
                    Videonya tetap di YouTube — cuma ditampilkan (embed) di halaman materi.
                    Tersimpan setelah dicek benar tautan YouTube saat disimpan.
                  </p>
                </>
              ) : (
                <textarea
                  className="w-full rounded-dalam border border-garis bg-kertas p-3 text-isi leading-relaxed text-tinta"
                  defaultValue={b.teks}
                  name={`blok.${b.kunci}.teks`}
                  placeholder={
                    b.jenis === "poin"
                      ? "Satu poin yang perlu diingat"
                      : "Satu paragraf penjelasan"
                  }
                  rows={b.jenis === "poin" ? 2 : 4}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {jenisTersedia.map((j) => {
          const Ikon = IKON[j];
          return (
            <button
              className="flex h-10 items-center gap-2 rounded-tombol border border-garis bg-white px-4 text-kecil font-bold text-adukan hover:bg-kertas"
              key={j}
              onClick={() => tambah(j)}
              type="button"
            >
              <Ikon className="size-4" aria-hidden />
              Tambah {NAMA[j].toLowerCase()}
            </button>
          );
        })}
      </div>
    </section>
  );
}
