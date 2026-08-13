"use client";

import { useSyncExternalStore } from "react";
import { AlertTriangle } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Eyebrow, Halaman, Tombol } from "@/components/ui";
import { checklist } from "@/lib/konten";
import { langgan, simpanChecklist, snapshot, snapshotServer } from "@/lib/skor";

export default function Checklist() {
  // Centangan hidup di localStorage, bukan di state React — supaya masih ada
  // saat pengguna membukanya lagi di kasir minggu depan.
  const sesi = useSyncExternalStore(langgan, snapshot, snapshotServer);
  const dicentang = sesi.checklist ?? [];

  const ubah = (id: string) =>
    simpanChecklist(
      dicentang.includes(id) ? dicentang.filter((x) => x !== id) : [...dicentang, id],
    );

  return (
    <AppShell>
      <Halaman>
        <div className="mb-2">
          <Eyebrow warna="peduli">Peduli &middot; Checklist</Eyebrow>
        </div>
        <h1 className="mb-2 text-display text-tinta">Checklist Sebelum Bayar</h1>
        <p className="mb-10 text-isi text-tinta-70">
          Lima hal yang perlu kamu periksa setiap kali membayar. Simpan dan buka lagi kapan pun.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {checklist.map((b) => (
            <label
              className={`flex cursor-pointer items-center gap-4 rounded-kartu border bg-white p-5 shadow-kartu transition-colors hover:bg-black/2 ${
                b.waspada ? "border-waspada/40" : "border-garis"
              }`}
              key={b.id}
            >
              <input
                checked={dicentang.includes(b.id)}
                className="peka-check"
                onChange={() => ubah(b.id)}
                type="checkbox"
              />
              <span className="flex-1 text-isi text-tinta">{b.teks}</span>
              {b.waspada ? (
                <AlertTriangle className="size-5 shrink-0 text-waspada" aria-hidden />
              ) : null}
            </label>
          ))}
        </div>

        <p className="mt-6 font-mono text-data uppercase text-tinta-55">
          {dicentang.length} dari {checklist.length} tercentang
        </p>

        <div className="mt-6 max-w-sm">
          <Tombol href="/materi" jenis="garis">
            Kembali ke modul
          </Tombol>
        </div>
      </Halaman>
    </AppShell>
  );
}
