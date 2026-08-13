import Link from "next/link";
import { TriangleAlert, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { Warna } from "@/lib/konten";

type Status = "kosong" | "berjalan" | "selesai";

/* Peta warna ditulis penuh, bukan dirangkai string, supaya Tailwind bisa
   melihat setiap kelas saat memindai berkas. */
const CHIP: Record<Warna, string> = {
  institusi: "bg-adukan-lembut text-institusi",
  adukan: "bg-adukan-lembut text-adukan",
  peduli: "bg-peduli-lembut text-peduli",
  kenali: "bg-kenali-lembut text-kenali",
  waspada: "bg-waspada-lembut text-waspada",
  ungu: "bg-ungu-lembut text-ungu",
  emas: "bg-emas-lembut text-emas",
};

const ISI: Record<Warna, string> = {
  institusi: "bg-institusi",
  adukan: "bg-adukan",
  peduli: "bg-peduli",
  kenali: "bg-kenali",
  waspada: "bg-waspada",
  ungu: "bg-ungu",
  emas: "bg-emas",
};

const TEKS: Record<Warna, string> = {
  institusi: "text-institusi",
  adukan: "text-adukan",
  peduli: "text-peduli",
  kenali: "text-kenali",
  waspada: "text-waspada",
  ungu: "text-ungu",
  emas: "text-emas",
};

export const warnaIsi = (w: Warna) => ISI[w];
export const warnaTeks = (w: Warna) => TEKS[w];

/** Kotak ikon bertinta lembut — bahasa visual utama daftar dan menu. */
export function Chip({
  Ikon,
  warna = "adukan",
  besar = false,
}: {
  Ikon: LucideIcon;
  warna?: Warna;
  besar?: boolean;
}) {
  return (
    <span
      className={`grid shrink-0 place-content-center rounded-chip ${CHIP[warna]} ${
        besar ? "size-14" : "size-11"
      }`}
    >
      <Ikon className={besar ? "size-7" : "size-5"} aria-hidden />
    </span>
  );
}

/** Signature PeKA — kotak bersudut tajam, meniru finder pattern kode QR. */
export function Finder({
  warna,
  status = "selesai",
  className = "",
}: {
  warna?: Warna | "putih";
  status?: Status;
  className?: string;
}) {
  return (
    <span aria-hidden className={`finder ${className}`} data-status={status} data-warna={warna} />
  );
}

export function Eyebrow({ children, warna }: { children: ReactNode; warna?: Warna }) {
  return (
    <div className="flex items-center gap-2">
      <Finder warna={warna} />
      <span className="font-mono text-data uppercase text-tinta-55">{children}</span>
    </div>
  );
}

export function BarProgres({ nilai, warna = "adukan" }: { nilai: number; warna?: Warna }) {
  return (
    <div aria-hidden className="progres">
      <div className={`progres__isi ${ISI[warna]}`} style={{ width: `${nilai}%` }} />
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
      className={`mx-auto w-full px-4 pb-28 pt-6 sm:px-6 md:pb-10 md:pt-8 lg:px-10 ${
        sempit ? "max-w-3xl" : "max-w-6xl"
      } ${className}`}
    >
      {children}
    </main>
  );
}

export function Judul({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-1.5">
      <h1 className="text-display text-tinta">{children}</h1>
      {sub ? <p className="text-isi text-tinta-70">{sub}</p> : null}
    </div>
  );
}

const NADA: Record<Warna, string> = {
  institusi: "bg-adukan-lembut border-institusi/15",
  adukan: "bg-adukan-lembut border-adukan/15",
  peduli: "bg-peduli-lembut border-peduli/20",
  kenali: "bg-kenali-lembut border-kenali/20",
  waspada: "bg-waspada-lembut border-waspada/20",
  ungu: "bg-ungu-lembut border-ungu/20",
  emas: "bg-emas-lembut border-emas/25",
};

/**
 * `aksen` memberi garis tebal di tepi kiri; `nada` mengganti latarnya jadi
 * warna lembut. Nada disediakan sebagai properti — bukan lewat `className` —
 * karena `bg-white` bawaan dan `bg-*` tambahan punya kekhususan CSS yang sama,
 * jadi yang menang ditentukan urutan di stylesheet, bukan urutan yang ditulis.
 */
export function Kartu({
  children,
  className = "",
  aksen,
  nada,
}: {
  children: ReactNode;
  className?: string;
  aksen?: Warna;
  nada?: Warna;
}) {
  const garis: Record<Warna, string> = {
    institusi: "border-l-4 border-l-institusi",
    adukan: "border-l-4 border-l-adukan",
    peduli: "border-l-4 border-l-peduli",
    kenali: "border-l-4 border-l-kenali",
    waspada: "border-l-4 border-l-waspada",
    ungu: "border-l-4 border-l-ungu",
    emas: "border-l-4 border-l-emas",
  };
  return (
    <div
      className={`rounded-kartu border p-5 ${
        nada ? NADA[nada] : "border-garis bg-white shadow-kartu"
      } ${aksen ? garis[aksen] : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/** Merah hanya untuk ini. Tidak pernah untuk penekanan biasa. */
export function Peringatan({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-dalam border border-waspada/30 bg-waspada-lembut p-4">
      <TriangleAlert className="mt-0.5 size-5 shrink-0 text-waspada" aria-hidden />
      <p className="text-isi font-bold text-tinta">{children}</p>
    </div>
  );
}

type TombolProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  jenis?: "utama" | "garis" | "teks" | "putih";
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
    utama: "bg-adukan text-white hover:bg-adukan-tua",
    garis: "border border-garis bg-white text-tinta hover:bg-kertas",
    teks: "text-adukan hover:bg-adukan/5",
    putih: "bg-white text-adukan hover:bg-white/90",
  }[jenis];

  // 48px minimum: sasaran sentuh nyaman untuk ibu jari, bukan angka acak.
  const dasar = `flex h-12 items-center justify-center gap-2 rounded-tombol px-5 text-sm font-bold transition-[color,background-color,transform] duration-150 motion-safe:active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 ${gaya} ${className}`;

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
  huruf,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  keadaan?: "netral" | "benar" | "salah" | "redup";
  disabled?: boolean;
  huruf?: string;
}) {
  const gaya = {
    netral: "border-garis bg-white hover:border-adukan",
    benar: "border-peduli bg-peduli-lembut",
    salah: "border-waspada bg-waspada-lembut",
    redup: "border-garis bg-white opacity-50",
  }[keadaan];

  const hurufGaya = {
    netral: "border-garis text-tinta-55",
    benar: "border-peduli bg-peduli text-white",
    salah: "border-waspada bg-waspada text-white",
    redup: "border-garis text-tinta-55",
  }[keadaan];

  const isi = (
    <span className="flex w-full items-center gap-3 text-left">
      {huruf ? (
        <span
          className={`grid size-7 shrink-0 place-content-center rounded-md border text-xs font-bold ${hurufGaya}`}
        >
          {huruf}
        </span>
      ) : null}
      <span className="flex-1">{children}</span>
    </span>
  );

  const dasar = `block w-full rounded-dalam border p-4 text-left transition-[color,background-color,border-color,transform] duration-150 motion-safe:active:scale-[0.985] disabled:active:scale-100 ${gaya}`;

  if (href) {
    return (
      <Link className={dasar} href={href}>
        {isi}
      </Link>
    );
  }
  return (
    <button className={dasar} disabled={disabled} onClick={onClick} type="button">
      {isi}
    </button>
  );
}

export function KotakStat({
  nilai,
  label,
  warna = "institusi",
}: {
  nilai: ReactNode;
  label: string;
  warna?: Warna;
}) {
  return (
    <div className="rounded-dalam bg-white p-4 text-center">
      <p className={`text-judul ${TEKS[warna]}`}>{nilai}</p>
      <p className="mt-0.5 text-kecil text-tinta-55">{label}</p>
    </div>
  );
}
