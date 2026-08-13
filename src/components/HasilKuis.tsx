"use client";

import { useSyncExternalStore } from "react";
import Ilustrasi from "@/components/Ilustrasi";
import { Angka, Rayakan } from "@/components/gerak";
import { Halaman, KotakStat, Tombol } from "@/components/ui";
import type { Modul } from "@/lib/konten";
import { langgan, snapshot, snapshotServer } from "@/lib/skor";

export default function HasilKuis({ m }: { m: Modul }) {
  const sesi = useSyncExternalStore(langgan, snapshot, snapshotServer);
  const hasil = sesi.kuis[m.id];

  const skor = hasil?.skor ?? 0;
  const benar = hasil?.benar ?? 0;
  const total = hasil?.total ?? m.soal.length;
  const lulus = skor >= 60;

  return (
    <Halaman sempit>
      <div className="mx-auto max-w-md text-center">
        {/* Piala untuk yang lulus, kotak kosong untuk yang belum — nada
            gambarnya ikut hasilnya, bukan selalu merayakan.
            Perayaan bermusim per aplikasi: hanya di sini, sekali. */}
        <Rayakan>
          <Ilustrasi
            className="mx-auto mb-4 w-48"
            nama={lulus ? "piala" : "kosong"}
            warna={lulus ? "emas" : m.warna}
          />
        </Rayakan>

        <h1 className="text-display text-tinta">
          {lulus ? "Kuis selesai" : "Belum lulus, coba lagi"}
        </h1>
        <p className="mt-2 text-isi text-tinta-70">
          Modul {m.nomor} &middot; {m.judul}
        </p>

        <div className="my-8 rounded-kartu border border-garis bg-white p-6 shadow-kartu">
          <p className="font-mono text-data uppercase text-tinta-55">Skor kamu</p>
          <p className={`text-6xl font-extrabold ${lulus ? "text-peduli" : "text-waspada"}`}>
            <Angka akhiran="%" durasi={1} nilai={skor} />
          </p>
          <p className="mt-1 text-kecil text-tinta-55">
            {benar} dari {total} jawaban benar
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <KotakStat label="Benar" nilai={benar} warna="peduli" />
            <KotakStat label="Salah" nilai={total - benar} warna="waspada" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Tombol href={`/kuis/${m.id}`} jenis="garis">
            Ulangi kuis
          </Tombol>
          <Tombol href="/materi">Kembali ke daftar modul</Tombol>
        </div>

        {/* Poin hanya diberikan untuk kuis modul dan simulasi. Cek awal dan
            cek akhir sengaja tidak berpoin dan tidak bisa diulang — kalau bisa,
            orang akan mengulangnya demi poin dan data N-Gain jadi tidak sahih. */}
        <p className="mt-6 text-kecil text-tinta-55">
          {lulus ? "Kuis lulus menambah 50 poin ke pencapaianmu." : "Skor minimal lulus adalah 60%."}
        </p>
      </div>
    </Halaman>
  );
}
