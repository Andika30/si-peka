"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { GalatKotak, Medan } from "@/components/admin/ui";
import { simpanBankIndonesia } from "./aksi";
import type { HasilAksi } from "@/lib/admin/jaga";
import type { BankIndonesia } from "@/lib/tipe";

const AWAL: HasilAksi = {};

export default function FormBankIndonesia({ bi }: { bi: BankIndonesia }) {
  const [hasil, kirim, sedang] = useActionState(simpanBankIndonesia, AWAL);

  return (
    <form action={kirim} className="p-5">
      <GalatKotak pesan={hasil.galat} />
      {hasil.pesan ? (
        <p className="mb-4 rounded-dalam border border-peduli/30 bg-peduli-lembut p-3 text-kecil font-bold text-peduli">
          {hasil.pesan}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Medan label="Nama kanal" maks={160} nama="nama" nilai={bi.nama} wajib />
        <Medan label="Telepon" maks={64} nama="telepon" nilai={bi.telepon} wajib />
        <Medan label="Tautan situs" maks={255} nama="situs" nilai={bi.situs} wajib />
        <Medan label="Teks tautan" maks={160} nama="situsLabel" nilai={bi.situsLabel} wajib />
        <Medan
          label="Diverifikasi terakhir"
          maks={64}
          nama="diverifikasi"
          nilai={bi.diverifikasi}
          wajib
        />
      </div>

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
