"use client";

import { useActionState } from "react";
import { KeyRound, Save } from "lucide-react";
import { GalatKotak, Medan } from "@/components/admin/ui";
import { gantiNama, gantiSandi } from "./aksi";
import type { HasilAksi } from "@/lib/admin/jaga";

const AWAL: HasilAksi = {};

function Status({ hasil }: { hasil: HasilAksi }) {
  return (
    <>
      <GalatKotak pesan={hasil.galat} />
      {hasil.pesan ? (
        <p className="mb-4 rounded-dalam border border-peduli/30 bg-peduli-lembut p-3 text-kecil font-bold text-peduli">
          {hasil.pesan}
        </p>
      ) : null}
    </>
  );
}

export function FormNama({ nama }: { nama: string }) {
  const [hasil, kirim, sedang] = useActionState(gantiNama, AWAL);

  return (
    <form action={kirim} className="rounded-kartu border border-garis bg-white p-5">
      <h3 className="mb-4 text-subjudul text-tinta">Nama tampilan</h3>
      <Status hasil={hasil} />
      <Medan
        label="Nama"
        maks={120}
        nama="nama"
        nilai={nama}
        petunjuk="Muncul di kanan atas dan di log aktivitas."
        wajib
      />
      <button
        className="mt-4 flex h-10 items-center gap-2 rounded-tombol border border-garis bg-white px-4 text-kecil font-bold text-adukan hover:bg-kertas disabled:opacity-50"
        disabled={sedang}
        type="submit"
      >
        <Save className="size-4" aria-hidden />
        {sedang ? "Menyimpan…" : "Simpan"}
      </button>
    </form>
  );
}

export function FormSandi() {
  const [hasil, kirim, sedang] = useActionState(gantiSandi, AWAL);

  return (
    <form action={kirim} className="rounded-kartu border border-garis bg-white p-5">
      <h3 className="mb-1 text-subjudul text-tinta">Ganti kata sandi</h3>
      <p className="mb-4 text-kecil text-tinta-55">
        Minimal 10 karakter, memuat huruf dan angka. Setelah diganti kamu akan diminta masuk ulang.
      </p>
      <Status hasil={hasil} />

      <div className="flex flex-col gap-4">
        <label className="block">
          <span className="mb-1.5 block text-kecil font-bold text-tinta">Kata sandi lama</span>
          <input
            autoComplete="current-password"
            className="h-11 w-full rounded-dalam border border-garis bg-white px-3 text-isi text-tinta"
            name="lama"
            required
            type="password"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-kecil font-bold text-tinta">Kata sandi baru</span>
          <input
            autoComplete="new-password"
            className="h-11 w-full rounded-dalam border border-garis bg-white px-3 text-isi text-tinta"
            name="baru"
            required
            type="password"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-kecil font-bold text-tinta">Ulangi kata sandi baru</span>
          <input
            autoComplete="new-password"
            className="h-11 w-full rounded-dalam border border-garis bg-white px-3 text-isi text-tinta"
            name="ulang"
            required
            type="password"
          />
        </label>
      </div>

      <button
        className="mt-4 flex h-10 items-center gap-2 rounded-tombol bg-adukan px-4 text-kecil font-bold text-white hover:bg-adukan-tua disabled:opacity-50"
        disabled={sedang}
        type="submit"
      >
        <KeyRound className="size-4" aria-hidden />
        {sedang ? "Menyimpan…" : "Ganti kata sandi"}
      </button>
    </form>
  );
}
