"use client";

import { useEffect, useState } from "react";
import { Eye, Newspaper, X } from "lucide-react";
import IsiBlok from "@/components/IsiBlok";
import type { BlokIsi } from "@/lib/tipe";

/**
 * Pratinjau berita dari isian yang sedang diketik.
 *
 * Nilainya dibaca dari FormData saat tombol ditekan, bukan lewat state yang
 * dijaga terus-menerus. Alasannya sederhana: seluruh medan di form ini tidak
 * terkendali (memakai `defaultValue`), dan mengubahnya jadi terkendali hanya
 * demi pratinjau berarti tiap ketikan memicu render ulang seluruh form.
 *
 * Gambar yang baru dipilih belum ada di server, jadi ditampilkan dari blob
 * peramban. Blob-nya dilepas saat pratinjau ditutup — kalau tidak, memori
 * peramban terus bertambah setiap kali pratinjau dibuka.
 */

type Isi = {
  judul: string;
  ringkas: string;
  tanggal: string;
  sumber: string;
  sampul: string | null;
  sampulAlt: string;
  blok: BlokIsi[];
};

const tanggalPanjang = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? "Tanggal belum diisi"
    : d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};

/** Membaca form jadi bentuk yang siap dirender, sekaligus mengumpulkan blob
    gambar baru supaya bisa dilepas lagi nanti. */
function bacaForm(form: HTMLFormElement, blobDibuat: string[]): Isi {
  const data = new FormData(form);
  const s = (n: string) => String(data.get(n) ?? "").trim();

  const alamatDari = (berkas: FormDataEntryValue | null, lama: string): string | null => {
    if (berkas instanceof File && berkas.size > 0) {
      const url = URL.createObjectURL(berkas);
      blobDibuat.push(url);
      return url;
    }
    return lama ? `/gambar/${lama}` : null;
  };

  const kunci = new Set<string>();
  for (const k of data.keys()) {
    const cocok = /^blok\.([^.]+)\./.exec(k);
    if (cocok) kunci.add(cocok[1]);
  }

  const blok: (BlokIsi & { urutan: number })[] = [];
  for (const k of kunci) {
    const jenis = String(data.get(`blok.${k}.jenis`) ?? "paragraf") as BlokIsi["jenis"];
    const urutan = Number(data.get(`blok.${k}.urutan`) ?? 0);
    const keterangan = String(data.get(`blok.${k}.keterangan`) ?? "").trim();

    if (jenis === "gambar") {
      const alamat = alamatDari(
        data.get(`blok.${k}.berkas`),
        String(data.get(`blok.${k}.lama`) ?? "").trim(),
      );
      if (alamat) blok.push({ jenis, teks: alamat, keterangan, urutan });
      continue;
    }

    const teks = String(data.get(`blok.${k}.teks`) ?? "").trim();
    if (teks) blok.push({ jenis, teks, keterangan, urutan });
  }

  return {
    judul: s("judul") || "Judul belum diisi",
    ringkas: s("ringkas"),
    tanggal: s("tanggal"),
    sumber: s("sumber"),
    sampul: alamatDari(data.get("gambar"), s("gambarLama")),
    sampulAlt: s("gambarAlt"),
    blok: blok.sort((a, b) => a.urutan - b.urutan),
  };
}

export default function PratinjauBerita({ formId }: { formId: string }) {
  const [isi, setIsi] = useState<Isi | null>(null);
  const [blob, setBlob] = useState<string[]>([]);

  const tutup = () => {
    blob.forEach((u) => URL.revokeObjectURL(u));
    setBlob([]);
    setIsi(null);
  };

  // Escape menutup pratinjau — kebiasaan yang berlaku di hampir semua overlay.
  useEffect(() => {
    if (!isi) return;
    const pada = (e: KeyboardEvent) => {
      if (e.key === "Escape") tutup();
    };
    window.addEventListener("keydown", pada);
    return () => window.removeEventListener("keydown", pada);
  });

  function buka() {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return;
    const dibuat: string[] = [];
    setIsi(bacaForm(form, dibuat));
    setBlob(dibuat);
  }

  return (
    <>
      <button
        className="flex h-11 items-center gap-2 rounded-tombol border border-garis bg-white px-5 text-sm font-bold text-tinta transition-colors hover:bg-kertas"
        onClick={buka}
        type="button"
      >
        <Eye className="size-4" aria-hidden />
        Pratinjau
      </button>

      {isi ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 sm:p-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="text-kecil font-bold text-white">
                Pratinjau — belum tersimpan
              </p>
              <button
                className="flex h-10 items-center gap-2 rounded-tombol bg-white px-4 text-kecil font-bold text-tinta"
                onClick={tutup}
                type="button"
              >
                <X className="size-4" aria-hidden />
                Tutup
              </button>
            </div>

            <div className="overflow-hidden rounded-kartu bg-kertas">
              {/* Dua tampilan sekaligus: kartu di halaman depan, lalu halaman
                  beritanya. Keduanya memakai komponen yang sama persis dengan
                  sisi peserta, jadi yang terlihat di sini benar-benar yang
                  akan terlihat nanti. */}
              <div className="border-b border-garis bg-kertas-tua/60 p-5">
                <p className="mb-3 font-mono text-data uppercase text-tinta-55">
                  Kartu di halaman depan
                </p>
                <div className="max-w-sm overflow-hidden rounded-kartu border border-garis bg-white shadow-kartu">
                  {isi.sampul ? (
                    <span className="block h-44 overflow-hidden bg-kertas-tua">
                      <img alt="" className="size-full object-cover" src={isi.sampul} />
                    </span>
                  ) : (
                    <span className="flex h-44 items-center justify-center bg-adukan-lembut">
                      <Newspaper className="size-10 text-adukan/40" aria-hidden />
                    </span>
                  )}
                  <span className="block p-5">
                    <span className="font-mono text-data uppercase text-tinta-55">
                      {tanggalPanjang(isi.tanggal)}
                    </span>
                    <span className="mt-2 block text-subjudul text-tinta">{isi.judul}</span>
                    <span className="mt-2 line-clamp-3 block text-kecil leading-relaxed text-tinta-70">
                      {isi.ringkas || "Ringkasan belum diisi."}
                    </span>
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-8">
                <p className="mb-4 font-mono text-data uppercase text-tinta-55">Halaman berita</p>

                <span className="font-mono text-data uppercase text-tinta-55">
                  {tanggalPanjang(isi.tanggal)}
                </span>
                <h1 className="mt-2 text-display text-tinta">{isi.judul}</h1>
                {isi.ringkas ? (
                  <p className="mt-3 text-isi leading-relaxed text-tinta-70">{isi.ringkas}</p>
                ) : null}

                {isi.sampul ? (
                  <img
                    alt={isi.sampulAlt}
                    className="mt-6 w-full rounded-kartu border border-garis"
                    src={isi.sampul}
                  />
                ) : null}

                {isi.blok.length > 0 ? (
                  <div className="mt-6">
                    <IsiBlok
                      alamatGambar={(u) => u}
                      isi={isi.blok}
                      judulPoin="Ringkasnya"
                      warna="adukan"
                    />
                  </div>
                ) : (
                  <p className="mt-6 rounded-dalam border border-dashed border-garis p-6 text-center text-kecil text-tinta-55">
                    Isi berita masih kosong.
                  </p>
                )}

                <p className="mt-8 border-t border-garis pt-5 font-mono text-data uppercase text-tinta-55">
                  Sumber: {isi.sumber || "belum diisi"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
