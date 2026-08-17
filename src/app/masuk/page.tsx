"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Info, LogIn, ShieldCheck } from "lucide-react";
import Ilustrasi from "@/components/Ilustrasi";
import { Muncul } from "@/components/gerak";
import { Finder, Halaman, Kartu, Tombol } from "@/components/ui";
import {
  gantiNama,
  kuisDikerjakan,
  langgan,
  materiSelesai,
  snapshot,
  snapshotServer,
} from "@/lib/skor";

/**
 * Gerbang masuk — bukan autentikasi.
 *
 * Aplikasi ini dikunci tanpa akun, tanpa backend, dan tanpa data pribadi;
 * halaman persetujuan bahkan berjanji tidak pernah meminta nama, nomor
 * telepon, atau surel. Jadi "masuk" di sini hanya menanyakan nama panggilan
 * yang tersimpan di perangkat sendiri — tanpa kata sandi, tanpa server, dan
 * tanpa apa pun yang bisa dipakai mengenali orangnya.
 *
 * Kalau suatu saat butuh autentikasi sungguhan, itu berarti menambah backend
 * dan merevisi batasan proyek — bukan sekadar menambah halaman.
 */
export default function Masuk() {
  const router = useRouter();
  const sesi = useSyncExternalStore(langgan, snapshot, snapshotServer);
  const [nama, setNama] = useState("");

  const adaProgres =
    materiSelesai(sesi) > 0 || kuisDikerjakan(sesi) > 0 || sesi.simulasi.length > 0;
  const sudahBernama = sesi.nama !== "Pengguna";

  function masuk() {
    if (nama.trim()) gantiNama(nama);
    router.push("/beranda");
  }

  return (
    <Halaman sempit className="pt-10">
      <Link
        className="mb-8 inline-flex items-center gap-2 text-kecil font-bold text-tinta-55 transition-colors hover:text-institusi"
        href="/"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Kembali ke halaman depan
      </Link>

      <Muncul className="mb-8 flex flex-col items-center gap-4 text-center">
        <span className="grid size-12 place-content-center rounded-dalam gradien-merek">
          <span className="grid grid-cols-2 gap-1" aria-hidden>
            <Finder className="size-3" warna="putih" />
            <Finder className="size-3" warna="putih" />
            <Finder className="size-3" warna="putih" />
            <span className="size-3" />
          </span>
        </span>
        <div>
          <h1 className="text-display text-tinta">Masuk ke PeKA</h1>
          <p className="mt-2 text-isi text-tinta-70">
            Tidak ada kata sandi dan tidak ada pendaftaran. Cukup nama panggilan supaya progres
            belajarmu punya nama.
          </p>
        </div>
      </Muncul>

      {/* Kalau sudah pernah dipakai di perangkat ini, tawarkan melanjutkan —
          jangan paksa orang mengisi ulang sesuatu yang sudah ada. */}
      {adaProgres || sudahBernama ? (
        <Muncul className="mb-4">
          <Kartu aksen="peduli" className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Ilustrasi className="w-24 shrink-0" nama="piala" warna="emas" />
            <div className="min-w-0 flex-1">
              <span className="font-mono text-data uppercase text-tinta-55">
                Sesi di perangkat ini
              </span>
              <p className="mt-1 truncate text-subjudul text-tinta">{sesi.nama}</p>
              <p className="text-kecil text-tinta-70">
                {materiSelesai(sesi)} materi &middot; {kuisDikerjakan(sesi)} kuis &middot;{" "}
                {sesi.simulasi.length} simulasi
              </p>
            </div>
            <Tombol className="shrink-0" href="/beranda">
              Lanjutkan
              <ArrowRight className="size-4" aria-hidden />
            </Tombol>
          </Kartu>
        </Muncul>
      ) : null}

      <Muncul>
        <Kartu className="mb-4">
          <label className="mb-2 block text-subjudul text-tinta" htmlFor="nama">
            Nama panggilan
          </label>
          <input
            autoComplete="off"
            className="h-12 w-full rounded-tombol border border-garis bg-kertas px-4 text-isi text-tinta placeholder:text-tinta-55"
            id="nama"
            maxLength={40}
            onChange={(e) => setNama(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") masuk();
            }}
            placeholder="Misalnya: Sari, Pak Anto, atau Peserta 12"
            value={nama}
          />
          <p className="mt-2 text-kecil text-tinta-55">
            Boleh nama samaran. Ini hanya tampil di perangkatmu dan tidak dikirim ke mana pun.
          </p>

          <Tombol className="mt-4 w-full" onClick={masuk}>
            <LogIn className="size-4" aria-hidden />
            {nama.trim() ? `Masuk sebagai ${nama.trim()}` : "Masuk tanpa nama panggilan"}
          </Tombol>
        </Kartu>

        <div className="mt-4 flex items-start gap-3 rounded-dalam border border-garis bg-white p-4">
          <Info className="mt-0.5 size-5 shrink-0 text-tinta-55" aria-hidden />
          <p className="text-kecil text-tinta-70">
            Kalau kamu berganti perangkat atau membersihkan data peramban, progres belajarmu
            dimulai dari nol lagi.
          </p>
        </div>
      </Muncul>
    </Halaman>
  );
}
