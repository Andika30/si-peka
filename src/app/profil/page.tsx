"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ChevronRight,
  CircleHelp,
  Info,
  LineChart,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import { Halaman, Judul, Kartu, KotakStat, Tombol } from "@/components/ui";
import { modul, skenario } from "@/lib/konten";
import {
  gantiNama,
  hapusSesi,
  langgan,
  modulSelesai,
  snapshot,
  snapshotServer,
  totalPoin,
} from "@/lib/skor";

const TAUTAN = [
  { href: "/hasil", label: "Hasil pengukuran", Ikon: LineChart },
  { href: "/checklist", label: "Checklist Sebelum Bayar", Ikon: ShieldCheck },
  { href: "/feedback", label: "Kirim masukan", Ikon: CircleHelp },
  { href: "/tentang", label: "Tentang aplikasi", Ikon: Info },
];

export default function Profil() {
  const sesi = useSyncExternalStore(langgan, snapshot, snapshotServer);
  const [ubah, setUbah] = useState(false);
  const [draf, setDraf] = useState("");
  const [konfirmasi, setKonfirmasi] = useState(false);

  return (
    <AppShell>
      <Halaman>
        <Judul>Profil</Judul>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Kartu className="mb-4">
              <div className="flex items-center gap-4">
                <span className="grid size-16 shrink-0 place-content-center rounded-full bg-adukan-lembut">
                  <UserRound className="size-8 text-adukan" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  {ubah ? (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        aria-label="Nama panggilan"
                        autoFocus
                        className="h-11 flex-1 rounded-tombol border border-garis bg-white px-3 text-isi"
                        maxLength={40}
                        onChange={(e) => setDraf(e.target.value)}
                        placeholder={sesi.nama}
                        value={draf}
                      />
                      <Tombol
                        onClick={() => {
                          gantiNama(draf);
                          setUbah(false);
                        }}
                      >
                        Simpan
                      </Tombol>
                    </div>
                  ) : (
                    <>
                      <p className="truncate text-judul text-tinta">{sesi.nama}</p>
                      <p className="font-mono text-data uppercase text-tinta-55">
                        Sesi {sesi.id}
                      </p>
                      <button
                        className="mt-1 text-kecil font-bold text-adukan"
                        onClick={() => {
                          setDraf(sesi.nama);
                          setUbah(true);
                        }}
                        type="button"
                      >
                        Ubah nama panggilan
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 rounded-dalam bg-kertas p-2">
                <KotakStat label={`dari ${modul.length} modul`} nilai={modulSelesai(sesi)} warna="adukan" />
                <KotakStat
                  label={`dari ${skenario.length} simulasi`}
                  nilai={sesi.simulasi.length}
                  warna="peduli"
                />
                <KotakStat label="poin" nilai={totalPoin(sesi)} warna="emas" />
              </div>
            </Kartu>

            <ul className="overflow-hidden rounded-kartu border border-garis bg-white shadow-kartu">
              {TAUTAN.map(({ href, label, Ikon }, i) => (
                <li className={i > 0 ? "border-t border-garis" : ""} key={href}>
                  <Link
                    className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-kertas"
                    href={href}
                  >
                    <Ikon className="size-5 shrink-0 text-tinta-55" aria-hidden />
                    <span className="flex-1 text-isi text-tinta">{label}</span>
                    <ChevronRight className="size-5 shrink-0 text-tinta-55" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Privasi ditulis terbuka, bukan disembunyikan di halaman terpisah. */}
          <div>
            <Kartu aksen="institusi" className="mb-4">
              <h2 className="mb-2 text-subjudul text-tinta">Data kamu</h2>
              <p className="text-kecil leading-relaxed text-tinta-70">
                Semua progres dan skor tersimpan di peramban perangkat ini saja. PeKA tidak
                mengumpulkan nama asli, nomor telepon, nomor rekening, atau data transaksi — dan
                tidak pernah meminta PIN, password, atau OTP.
              </p>
            </Kartu>

            <Kartu>
              <h2 className="mb-2 text-subjudul text-tinta">Mulai ulang</h2>
              <p className="mb-4 text-kecil text-tinta-70">
                Menghapus seluruh progres, skor, dan lencana di perangkat ini. Tidak bisa
                dibatalkan.
              </p>
              {konfirmasi ? (
                <div className="flex flex-col gap-2">
                  <button
                    className="flex h-12 items-center justify-center gap-2 rounded-tombol bg-waspada px-5 text-sm font-bold text-white"
                    onClick={() => {
                      hapusSesi();
                      setKonfirmasi(false);
                    }}
                    type="button"
                  >
                    <Trash2 className="size-4" aria-hidden />
                    Ya, hapus semuanya
                  </button>
                  <Tombol jenis="teks" onClick={() => setKonfirmasi(false)}>
                    Batal
                  </Tombol>
                </div>
              ) : (
                <Tombol jenis="garis" onClick={() => setKonfirmasi(true)}>
                  <Trash2 className="size-4" aria-hidden />
                  Hapus data belajar
                </Tombol>
              )}
            </Kartu>
          </div>
        </div>
      </Halaman>
    </AppShell>
  );
}
