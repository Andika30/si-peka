import Link from "next/link";
import { ChevronRight, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Perkakas form panel admin.
 *
 * Sengaja polos dan padat: layar ini dipakai untuk bekerja, bukan untuk
 * dipandang. Beda dari sisi peserta yang lapang — di sini yang penting satu
 * layar memuat sebanyak mungkin medan tanpa perlu menggulir.
 */

export function Medan({
  label,
  nama,
  nilai,
  petunjuk,
  wajib,
  jenis = "text",
  maks,
}: {
  label: string;
  nama: string;
  nilai?: string | number | null;
  petunjuk?: string;
  wajib?: boolean;
  jenis?: "text" | "number";
  maks?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-kecil font-bold text-tinta">
        {label}
        {wajib ? <span className="text-waspada"> *</span> : null}
      </span>
      <input
        className="h-11 w-full rounded-dalam border border-garis bg-white px-3 text-isi text-tinta"
        defaultValue={nilai ?? ""}
        maxLength={maks}
        name={nama}
        required={wajib}
        type={jenis}
      />
      {petunjuk ? <span className="mt-1 block text-kecil text-tinta-55">{petunjuk}</span> : null}
    </label>
  );
}

export function AreaTeks({
  label,
  nama,
  nilai,
  petunjuk,
  baris = 4,
  wajib,
  maks,
}: {
  label: string;
  nama: string;
  nilai?: string | null;
  petunjuk?: string;
  baris?: number;
  wajib?: boolean;
  /** Kolomnya `varchar`, bukan `text` — batasi di sini supaya penyimpanan
      gagal dengan pesan jelas di layar, bukan galat SQL mentah dari server. */
  maks?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-kecil font-bold text-tinta">
        {label}
        {wajib ? <span className="text-waspada"> *</span> : null}
      </span>
      <textarea
        className="w-full rounded-dalam border border-garis bg-white p-3 text-isi leading-relaxed text-tinta"
        defaultValue={nilai ?? ""}
        maxLength={maks}
        name={nama}
        required={wajib}
        rows={baris}
      />
      {petunjuk ? <span className="mt-1 block text-kecil text-tinta-55">{petunjuk}</span> : null}
    </label>
  );
}

export function Pilih({
  label,
  nama,
  nilai,
  opsi,
  petunjuk,
}: {
  label: string;
  nama: string;
  nilai?: string | null;
  opsi: { nilai: string; label: string }[];
  petunjuk?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-kecil font-bold text-tinta">{label}</span>
      <select
        className="h-11 w-full rounded-dalam border border-garis bg-white px-3 text-isi text-tinta"
        defaultValue={nilai ?? ""}
        name={nama}
      >
        {opsi.map((o) => (
          <option key={o.nilai} value={o.nilai}>
            {o.label}
          </option>
        ))}
      </select>
      {petunjuk ? <span className="mt-1 block text-kecil text-tinta-55">{petunjuk}</span> : null}
    </label>
  );
}

export function Centang({
  label,
  nama,
  nilai,
  petunjuk,
}: {
  label: string;
  nama: string;
  nilai?: boolean;
  petunjuk?: string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-dalam border border-garis bg-white p-3">
      <input
        className="mt-0.5 size-4 shrink-0"
        defaultChecked={nilai}
        name={nama}
        type="checkbox"
      />
      <span>
        <span className="block text-kecil font-bold text-tinta">{label}</span>
        {petunjuk ? <span className="block text-kecil text-tinta-55">{petunjuk}</span> : null}
      </span>
    </label>
  );
}

export function Bagian({
  judul,
  keterangan,
  children,
}: {
  judul: string;
  keterangan?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-6 rounded-kartu border border-garis bg-kertas-tua/40 p-5">
      <h2 className="text-subjudul text-tinta">{judul}</h2>
      {keterangan ? <p className="mt-1 text-kecil text-tinta-55">{keterangan}</p> : null}
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}

export function Lencana({ aktif }: { aktif: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 font-mono text-data uppercase ${
        aktif ? "bg-peduli-lembut text-peduli" : "bg-kertas-tua text-tinta-55"
      }`}
    >
      {aktif ? "Aktif" : "Nonaktif"}
    </span>
  );
}

export function GalatKotak({ pesan }: { pesan?: string }) {
  if (!pesan) return null;
  return (
    <p
      className="mb-5 flex items-start gap-2 rounded-dalam border border-waspada/30 bg-waspada-lembut p-3 text-kecil font-bold text-waspada"
      role="alert"
    >
      <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      {pesan}
    </p>
  );
}

/** Baris daftar yang bisa diklik — tulang punggung semua layar daftar admin. */
export function BarisDaftar({
  href,
  judul,
  ringkas,
  meta,
  aktif,
}: {
  href: string;
  judul: string;
  ringkas?: string;
  meta?: string;
  aktif?: boolean;
}) {
  return (
    <Link
      className="flex items-center gap-4 border-b border-garis px-4 py-3.5 transition-colors last:border-b-0 hover:bg-kertas"
      href={href}
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-isi font-bold text-tinta">{judul}</span>
        {ringkas ? <span className="block truncate text-kecil text-tinta-55">{ringkas}</span> : null}
        {meta ? (
          <span className="mt-0.5 block font-mono text-data uppercase text-tinta-55">{meta}</span>
        ) : null}
      </span>
      {aktif === undefined ? null : <Lencana aktif={aktif} />}
      <ChevronRight className="size-5 shrink-0 text-tinta-55" aria-hidden />
    </Link>
  );
}

export function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-kartu border border-garis bg-white">{children}</div>
  );
}

export function TombolUtama({
  children,
  sedang,
}: {
  children: ReactNode;
  sedang?: boolean;
}) {
  return (
    <button
      className="flex h-11 items-center justify-center gap-2 rounded-tombol bg-adukan px-5 text-sm font-bold text-white transition-colors hover:bg-adukan-tua disabled:opacity-50"
      disabled={sedang}
      type="submit"
    >
      {children}
    </button>
  );
}
