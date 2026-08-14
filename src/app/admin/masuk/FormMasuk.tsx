"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, LogIn, ShieldAlert, TriangleAlert } from "lucide-react";
import { Finder } from "@/components/ui";
import { masukAdmin, type HasilMasuk } from "./aksi";

const AWAL: HasilMasuk = {};

export default function FormMasuk() {
  const [hasil, kirim, sedang] = useActionState(masukAdmin, AWAL);

  return (
    <main className="grid min-h-screen place-items-center bg-institusi px-4 py-10">
      <div aria-hidden className="pointer-events-none fixed inset-0 pola-finder opacity-50" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="grid size-12 place-content-center rounded-dalam bg-white/15 ring-1 ring-white/25">
            <span className="grid grid-cols-2 gap-1" aria-hidden>
              <Finder className="size-3" warna="putih" />
              <Finder className="size-3" warna="putih" />
              <Finder className="size-3" warna="putih" />
              <span className="size-3" />
            </span>
          </span>
          <div>
            <h1 className="text-judul text-white">Pengelolaan Konten</h1>
            <p className="mt-1 text-kecil text-white/70">
              Halaman ini untuk pengelola. Peserta tidak perlu masuk ke sini.
            </p>
          </div>
        </div>

        <form action={kirim} className="rounded-kartu bg-white p-6 shadow-angkat">
          {hasil.galat ? (
            <p
              className="mb-4 flex items-start gap-2 rounded-dalam border border-waspada/30 bg-waspada-lembut p-3 text-kecil font-bold text-waspada"
              role="alert"
            >
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              {hasil.galat}
            </p>
          ) : null}

          <label className="mb-1.5 block text-kecil font-bold text-tinta" htmlFor="pengguna">
            Nama pengguna
          </label>
          <input
            autoComplete="username"
            autoFocus
            className="mb-4 h-12 w-full rounded-tombol border border-garis bg-kertas px-4 text-isi text-tinta"
            id="pengguna"
            name="pengguna"
            required
            type="text"
          />

          <label className="mb-1.5 block text-kecil font-bold text-tinta" htmlFor="sandi">
            Kata sandi
          </label>
          <input
            autoComplete="current-password"
            className="mb-5 h-12 w-full rounded-tombol border border-garis bg-kertas px-4 text-isi text-tinta"
            id="sandi"
            name="sandi"
            required
            type="password"
          />

          <button
            className="flex h-12 w-full items-center justify-center gap-2 rounded-tombol bg-adukan px-5 text-sm font-bold text-white transition-colors hover:bg-adukan-tua disabled:opacity-50"
            disabled={sedang}
            type="submit"
          >
            <LogIn className="size-4" aria-hidden />
            {sedang ? "Memeriksa…" : "Masuk"}
          </button>

          <p className="mt-5 flex items-start gap-2 border-t border-garis pt-4 text-kecil text-tinta-55">
            <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            Lupa kata sandi diatur ulang lewat terminal:{" "}
            <code className="font-mono">npm run db:admin</code>
          </p>
        </form>

        <Link
          className="mt-6 flex items-center justify-center gap-2 text-kecil font-bold text-white/70 transition-colors hover:text-white"
          href="/"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Kembali ke aplikasi
        </Link>
      </div>
    </main>
  );
}
