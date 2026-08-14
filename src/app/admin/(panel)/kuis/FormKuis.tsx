"use client";

import { useActionState, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Bagian, Centang, GalatKotak, Medan, Pilih, TombolUtama } from "@/components/admin/ui";
import { simpanKuis } from "./aksi";
import type { HasilAksi } from "@/lib/admin/jaga";

const AWAL: HasilAksi = {};
const HURUF = ["A", "B", "C", "D", "E", "F"];

export type SoalNilai = {
  pertanyaan: string;
  opsi: string[];
  kunci: number;
  pembahasan: string;
};

export type NilaiKuis = {
  id: string;
  judul: string;
  topikId: string;
  urutan: number;
  aktif: boolean;
  soal: SoalNilai[];
};

const soalKosong = (): SoalNilai => ({
  pertanyaan: "",
  opsi: ["", "", "", ""],
  kunci: 0,
  pembahasan: "",
});

/**
 * Nomor soal dipegang di state, bukan indeks array, supaya menghapus soal
 * di tengah tidak membuat React memakai ulang isi medan soal berikutnya.
 */
type Baris = { kunciBaris: number; nilai: SoalNilai };

export default function FormKuis({
  nilai,
  topik,
}: {
  nilai?: NilaiKuis;
  topik: { id: string; judul: string }[];
}) {
  const [hasil, kirim, sedang] = useActionState(simpanKuis, AWAL);
  const [baris, setBaris] = useState<Baris[]>(() =>
    (nilai?.soal ?? [soalKosong()]).map((s, i) => ({ kunciBaris: i, nilai: s })),
  );
  const [berikutnya, setBerikutnya] = useState(baris.length);

  function tambah() {
    setBaris((b) => [...b, { kunciBaris: berikutnya, nilai: soalKosong() }]);
    setBerikutnya((n) => n + 1);
  }

  function buang(kunciBaris: number) {
    setBaris((b) => b.filter((x) => x.kunciBaris !== kunciBaris));
  }

  return (
    <form action={kirim}>
      <GalatKotak pesan={hasil.galat} />
      {hasil.pesan ? (
        <p className="mb-5 rounded-dalam border border-peduli/30 bg-peduli-lembut p-3 text-kecil font-bold text-peduli">
          {hasil.pesan}
        </p>
      ) : null}

      <input name="idLama" type="hidden" value={nilai?.id ?? ""} />

      <Bagian judul="Identitas kuis">
        <Medan label="Judul" maks={200} nama="judul" nilai={nilai?.judul} wajib />
        <div className="grid gap-4 sm:grid-cols-2">
          <Pilih
            label="Materi terkait"
            nama="topikId"
            nilai={nilai?.topikId}
            opsi={topik.map((t) => ({ nilai: t.id, label: t.judul }))}
            petunjuk="Menentukan materi mana yang direkomendasikan saat jawaban keliru."
          />
          <Medan jenis="number" label="Urutan tampil" nama="urutan" nilai={nilai?.urutan} />
        </div>
        <Centang label="Aktif" nama="aktif" nilai={nilai?.aktif ?? true} />
      </Bagian>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-subjudul text-tinta">Soal ({baris.length})</h2>
        <button
          className="flex h-10 items-center gap-2 rounded-tombol border border-garis bg-white px-4 text-kecil font-bold text-adukan hover:bg-kertas"
          onClick={tambah}
          type="button"
        >
          <Plus className="size-4" aria-hidden />
          Tambah soal
        </button>
      </div>

      {baris.map(({ kunciBaris, nilai: s }, i) => (
        <fieldset
          className="mb-4 rounded-kartu border border-garis bg-white p-5"
          key={kunciBaris}
        >
          <div className="mb-4 flex items-center justify-between">
            <legend className="font-mono text-data uppercase text-tinta-55">Soal {i + 1}</legend>
            <button
              aria-label={`Hapus soal ${i + 1}`}
              className="grid size-9 place-content-center rounded-tombol text-tinta-55 hover:bg-waspada-lembut hover:text-waspada disabled:opacity-30"
              disabled={baris.length === 1}
              onClick={() => buang(kunciBaris)}
              type="button"
            >
              <Trash2 className="size-4" aria-hidden />
            </button>
          </div>

          <label className="mb-4 block">
            <span className="mb-1.5 block text-kecil font-bold text-tinta">Pertanyaan</span>
            <textarea
              className="w-full rounded-dalam border border-garis bg-kertas p-3 text-isi text-tinta"
              defaultValue={s.pertanyaan}
              name={`soal.${kunciBaris}.pertanyaan`}
              rows={2}
            />
          </label>

          <p className="mb-2 text-kecil font-bold text-tinta">
            Pilihan jawaban{" "}
            <span className="font-normal text-tinta-55">
              — pilih lingkaran di kiri untuk menandai kunci. Kosongkan yang tidak dipakai.
            </span>
          </p>
          <div className="mb-4 flex flex-col gap-2">
            {[0, 1, 2, 3, 4, 5].map((m) => (
              <label className="flex items-center gap-3" key={m}>
                <input
                  aria-label={`Jadikan pilihan ${HURUF[m]} sebagai kunci`}
                  className="size-4 shrink-0"
                  defaultChecked={s.kunci === m}
                  name={`soal.${kunciBaris}.kunci`}
                  type="radio"
                  value={m}
                />
                <span className="grid size-7 shrink-0 place-content-center rounded-md border border-garis text-xs font-bold text-tinta-55">
                  {HURUF[m]}
                </span>
                <input
                  className="h-10 flex-1 rounded-dalam border border-garis bg-kertas px-3 text-isi text-tinta"
                  defaultValue={s.opsi[m] ?? ""}
                  name={`soal.${kunciBaris}.opsi.${m}`}
                  type="text"
                />
              </label>
            ))}
          </div>

          <label className="block">
            <span className="mb-1.5 block text-kecil font-bold text-tinta">Pembahasan</span>
            <textarea
              className="w-full rounded-dalam border border-garis bg-kertas p-3 text-isi text-tinta"
              defaultValue={s.pembahasan}
              name={`soal.${kunciBaris}.pembahasan`}
              rows={2}
            />
            <span className="mt-1 block text-kecil text-tinta-55">
              Inilah yang dibaca peserta saat jawabannya keliru. Jelaskan alasannya, jangan cuma
              menyatakan mana yang benar.
            </span>
          </label>
        </fieldset>
      ))}

      <TombolUtama sedang={sedang}>
        <Save className="size-4" aria-hidden />
        {sedang ? "Menyimpan…" : "Simpan kuis"}
      </TombolUtama>
    </form>
  );
}
