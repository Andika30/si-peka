"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { Centang, GalatKotak, Medan } from "@/components/admin/ui";
import { simpanBankIndonesia, simpanKategori, simpanPenyelenggara } from "./aksi";
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

function Simpan({ sedang }: { sedang: boolean }) {
  return (
    <button
      className="mt-4 flex h-10 items-center gap-2 rounded-tombol border border-garis bg-white px-4 text-kecil font-bold text-adukan hover:bg-kertas disabled:opacity-50"
      disabled={sedang}
      type="submit"
    >
      <Save className="size-4" aria-hidden />
      {sedang ? "Menyimpan…" : "Simpan"}
    </button>
  );
}

export function FormPenyelenggara({
  p,
}: {
  p: {
    id: string;
    nama: string;
    jenis: string;
    telepon: string;
    aplikasi: string;
    situs: string;
    diverifikasi: string;
    urutan: number;
    aktif: boolean;
  };
}) {
  const [hasil, kirim, sedang] = useActionState(simpanPenyelenggara, AWAL);

  return (
    <form action={kirim} className="border-b border-garis p-5 last:border-b-0">
      <Status hasil={hasil} />
      <input name="id" type="hidden" value={p.id} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Medan label="Nama" maks={160} nama="nama" nilai={p.nama} wajib />
        <Medan label="Jenis" maks={120} nama="jenis" nilai={p.jenis} wajib />
        <Medan label="Telepon / call center" maks={120} nama="telepon" nilai={p.telepon} wajib />
        <Medan label="Kanal di aplikasi" maks={160} nama="aplikasi" nilai={p.aplikasi} wajib />
        <Medan label="Situs" maks={255} nama="situs" nilai={p.situs} wajib />
        <Medan
          label="Diverifikasi terakhir"
          maks={64}
          nama="diverifikasi"
          nilai={p.diverifikasi}
          petunjuk="Tampil apa adanya ke peserta. Perbarui setiap kali nomornya dicek ulang."
          wajib
        />
        <Medan jenis="number" label="Urutan" nama="urutan" nilai={p.urutan} />
        <Centang label="Aktif" nama="aktif" nilai={p.aktif} />
      </div>

      <Simpan sedang={sedang} />
    </form>
  );
}

export function FormBankIndonesia({
  bi,
}: {
  bi: { nama: string; telepon: string; situs: string; situsLabel: string; diverifikasi: string };
}) {
  const [hasil, kirim, sedang] = useActionState(simpanBankIndonesia, AWAL);

  return (
    <form action={kirim} className="p-5">
      <Status hasil={hasil} />
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
      <Simpan sedang={sedang} />
    </form>
  );
}

export function FormKategori({
  k,
}: {
  k: { id: string; nama: string; ringkas: string; urutan: number; aktif: boolean };
}) {
  const [hasil, kirim, sedang] = useActionState(simpanKategori, AWAL);

  return (
    <form action={kirim} className="border-b border-garis p-5 last:border-b-0">
      <Status hasil={hasil} />
      <input name="id" type="hidden" value={k.id} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Medan label="Nama kategori" maks={120} nama="nama" nilai={k.nama} wajib />
        <Medan jenis="number" label="Urutan" nama="urutan" nilai={k.urutan} />
      </div>
      <div className="mt-4 grid gap-4">
        <Medan label="Keterangan" maks={255} nama="ringkas" nilai={k.ringkas} wajib />
        <Centang label="Aktif" nama="aktif" nilai={k.aktif} />
      </div>

      <Simpan sedang={sedang} />
    </form>
  );
}
