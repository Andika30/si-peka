import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

type Warna = "peduli" | "kenali" | "adukan" | "institusi";
type Status = "kosong" | "berjalan" | "selesai";

/** Signature PeKA — kotak bersudut tajam, meniru finder pattern kode QR. */
export function Finder({
  warna,
  status = "selesai",
  className = "",
}: {
  warna?: Warna;
  status?: Status;
  className?: string;
}) {
  return (
    <span aria-hidden className={`finder ${className}`} data-status={status} data-warna={warna} />
  );
}

/** Baris kecil di atas judul: penanda + label monospace. */
export function Eyebrow({
  warna,
  children,
  status = "selesai",
}: {
  warna?: Warna;
  children: ReactNode;
  status?: Status;
}) {
  return (
    <div className="flex items-center gap-2">
      <Finder warna={warna} status={status} />
      <span className="font-mono text-data uppercase text-tinta-55">{children}</span>
    </div>
  );
}

/**
 * Wadah halaman. `sempit` untuk layar membaca dan menjawab — baris teks yang
 * terlalu panjang justru lebih sulit dibaca, jadi tidak semua ikut melebar.
 */
export function Halaman({
  children,
  sempit = false,
  className = "",
}: {
  children: ReactNode;
  sempit?: boolean;
  className?: string;
}) {
  return (
    <main
      className={`mx-auto w-full px-5 pt-24 pb-32 md:px-8 md:pt-28 md:pb-16 ${
        sempit ? "max-w-[42.5rem]" : "max-w-[40rem] md:max-w-3xl lg:max-w-5xl"
      } ${className}`}
    >
      {children}
    </main>
  );
}

export function Judul({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <h1 className="text-display text-tinta">{children}</h1>
      {sub ? <p className="text-isi text-tinta-70">{sub}</p> : null}
    </div>
  );
}

/** Merah hanya untuk ini. Tidak pernah untuk penekanan biasa. */
export function Peringatan({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-4 rounded-tombol border-[1.5px] border-waspada bg-waspada-lembut p-5">
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-waspada" aria-hidden />
      <p className="text-isi font-bold text-tinta">{children}</p>
    </div>
  );
}

export function Kartu({
  children,
  className = "",
  aksen,
}: {
  children: ReactNode;
  className?: string;
  aksen?: Warna;
}) {
  const garisAksen = aksen
    ? { peduli: "border-l-4 border-l-peduli", kenali: "border-l-4 border-l-kenali", adukan: "border-l-4 border-l-adukan", institusi: "border-l-4 border-l-institusi" }[aksen]
    : "";
  return (
    <div
      className={`rounded-kartu border border-garis bg-white p-5 shadow-kartu ${garisAksen} ${className}`}
    >
      {children}
    </div>
  );
}

type TombolProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  jenis?: "utama" | "garis" | "teks";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function Tombol({
  children,
  href,
  onClick,
  jenis = "utama",
  className = "",
  type = "button",
  disabled,
}: TombolProps) {
  const gaya = {
    utama: "bg-adukan text-white hover:opacity-90",
    garis: "border border-garis text-tinta hover:bg-black/[0.03]",
    teks: "text-adukan hover:bg-adukan/5",
  }[jenis];

  // 52px: sasaran sentuh nyaman untuk ibu jari, bukan angka acak.
  const dasar = `flex h-[52px] items-center justify-center gap-2 rounded-tombol px-6 text-base font-bold transition-colors ${gaya} ${className}`;

  if (href) {
    return (
      <Link className={dasar} href={href}>
        {children}
      </Link>
    );
  }
  return (
    <button className={dasar} disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  );
}

/** Pilihan selalu kartu besar, tidak pernah radio kecil. */
export function KartuPilihan({
  children,
  onClick,
  href,
  keadaan = "netral",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  keadaan?: "netral" | "benar" | "salah" | "redup";
  disabled?: boolean;
}) {
  const gaya = {
    netral: "border-garis bg-white hover:border-adukan",
    benar: "border-2 border-peduli bg-peduli-lembut",
    salah: "border-2 border-waspada bg-waspada-lembut",
    redup: "border-garis bg-white opacity-50",
  }[keadaan];

  const dasar = `block w-full rounded-kartu border p-5 text-left transition-colors ${gaya}`;

  if (href) {
    return (
      <Link className={dasar} href={href}>
        {children}
      </Link>
    );
  }
  return (
    <button className={dasar} disabled={disabled} onClick={onClick} type="button">
      {children}
    </button>
  );
}
