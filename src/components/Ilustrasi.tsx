import type { Warna } from "@/lib/konten";

/**
 * Ilustrasi PeKA — SVG inline, digambar sendiri.
 *
 * Tidak memakai pustaka ilustrasi luar: aplikasi ini berlabel Bank Indonesia,
 * jadi seluruh aset harus jelas asal-usulnya. Keuntungan lain: warnanya ikut
 * palet tiap modul, tajam di resolusi apa pun, dan tidak menambah satu pun
 * berkas gambar maupun permintaan jaringan.
 *
 * Kosakata bentuknya sengaja dibatasi — ponsel, kartu, gelembung pesan, perisai,
 * dan kotak sudut kode QR — supaya dua belas adegan ini terbaca sebagai satu
 * keluarga. Tidak ada wajah manusia: sulit digambar rapi dengan SVG datar, dan
 * menghindari kesan menggambarkan orang tertentu.
 */

const AKSEN: Record<Warna, { kuat: string; lembut: string }> = {
  institusi: { kuat: "#0e2f6b", lembut: "#e8f1fd" },
  adukan: { kuat: "#1d6fe0", lembut: "#e8f1fd" },
  peduli: { kuat: "#0f8a6a", lembut: "#e6f5f0" },
  kenali: { kuat: "#d98a0b", lembut: "#fdf2e0" },
  waspada: { kuat: "#c1362f", lembut: "#fbeae9" },
  ungu: { kuat: "#7c5cf0", lembut: "#efeafe" },
  emas: { kuat: "#eab308", lembut: "#fef6dd" },
};

const NAVY = "#0e2f6b";
const TINTA = "#0b1b33";

export type NamaIlustrasi =
  | "qris"
  | "perisai"
  | "kunci"
  | "waspada"
  | "kartu"
  | "lonceng"
  | "piala"
  | "simulasi"
  | "adukan"
  | "feedback"
  | "kosong"
  | "merek";

/** Kotak sudut kode QR — motif pengenal yang muncul di beberapa adegan. */
function Sudut({ x, y, s = 14, warna }: { x: number; y: number; s?: number; warna: string }) {
  return (
    <>
      <rect fill="none" height={s} stroke={warna} strokeWidth="3" width={s} x={x} y={y} />
      <rect fill={warna} height={s / 3} width={s / 3} x={x + s / 3} y={y + s / 3} />
    </>
  );
}

function Adegan({ nama, kuat, lembut }: { nama: NamaIlustrasi; kuat: string; lembut: string }) {
  switch (nama) {
    /* Ponsel memindai stiker QRIS di meja. */
    case "qris":
      return (
        <>
          <circle cx="100" cy="80" fill={lembut} r="62" />
          <rect fill="#fff" height="96" rx="10" stroke={NAVY} strokeWidth="3" width="60" x="38" y="30" />
          <rect fill={lembut} height="18" width="60" x="38" y="30" />
          <Sudut warna={kuat} x={50} y={58} />
          <Sudut warna={kuat} x={72} y={58} />
          <Sudut warna={kuat} x={50} y={80} />
          <path d="M44 110h48" stroke={kuat} strokeLinecap="round" strokeWidth="3" />
          <rect fill="#fff" height="58" rx="6" stroke={NAVY} strokeWidth="3" width="46" x="118" y="52" />
          <Sudut s={12} warna={NAVY} x={126} y={60} />
          <Sudut s={12} warna={NAVY} x={144} y={60} />
          <Sudut s={12} warna={NAVY} x={126} y={78} />
          <path d="M104 74h10M104 84h6" stroke={kuat} strokeLinecap="round" strokeWidth="3" />
        </>
      );

    /* Perisai dengan centang — data pribadi terjaga. */
    case "perisai":
      return (
        <>
          <circle cx="100" cy="80" fill={lembut} r="62" />
          <path
            d="M100 26l38 15v34c0 26-17 45-38 53-21-8-38-27-38-53V41l38-15z"
            fill="#fff"
            stroke={NAVY}
            strokeLinejoin="round"
            strokeWidth="3"
          />
          <path d="M84 80l12 12 22-24" stroke={kuat} strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
          <circle cx="46" cy="46" fill={kuat} r="4" />
          <circle cx="158" cy="60" fill={kuat} opacity="0.5" r="5" />
          <circle cx="150" cy="118" fill={kuat} opacity="0.3" r="4" />
        </>
      );

    /* Ponsel meminta kode, kunci melayang di sampingnya. */
    case "kunci":
      return (
        <>
          <circle cx="100" cy="80" fill={lembut} r="62" />
          <rect fill="#fff" height="104" rx="10" stroke={NAVY} strokeWidth="3" width="66" x="46" y="26" />
          <path d="M62 52h34" stroke={NAVY} strokeLinecap="round" strokeWidth="3" opacity="0.35" />
          <circle cx="64" cy="76" fill={kuat} r="6" />
          <circle cx="82" cy="76" fill={kuat} r="6" />
          <circle cx="100" cy="76" fill={kuat} r="6" />
          <circle cx="64" cy="76" fill="none" r="6" stroke={NAVY} strokeWidth="0" />
          <rect fill={kuat} height="14" rx="7" width="48" x="55" y="98" opacity="0.25" />
          <circle cx="146" cy="62" fill="#fff" r="16" stroke={NAVY} strokeWidth="3" />
          <circle cx="146" cy="58" fill={kuat} r="5" />
          <path d="M146 63v14m0-6h6" stroke={kuat} strokeLinecap="round" strokeWidth="3" />
        </>
      );

    /* Gelembung pesan dengan kail — modus penipuan. */
    case "waspada":
      return (
        <>
          <circle cx="100" cy="80" fill={lembut} r="62" />
          <path
            d="M44 46h96a8 8 0 018 8v44a8 8 0 01-8 8H74l-20 16v-16h-10a8 8 0 01-8-8V54a8 8 0 018-8z"
            fill="#fff"
            stroke={NAVY}
            strokeLinejoin="round"
            strokeWidth="3"
          />
          <path d="M62 66h44M62 80h30" stroke={NAVY} strokeLinecap="round" strokeWidth="3" opacity="0.3" />
          <path d="M150 24v34a14 14 0 01-28 0" fill="none" stroke={kuat} strokeLinecap="round" strokeWidth="4" />
          <circle cx="150" cy="22" fill={kuat} r="4" />
          <circle cx="122" cy="96" fill={kuat} r="13" />
          <path d="M122 90v7m0 5v.5" stroke="#fff" strokeLinecap="round" strokeWidth="3" />
        </>
      );

    /* Kartu dan ponsel — dasar pembayaran digital. */
    case "kartu":
      return (
        <>
          <circle cx="100" cy="80" fill={lembut} r="62" />
          <rect fill="#fff" height="60" rx="8" stroke={NAVY} strokeWidth="3" width="92" x="30" y="46" />
          <rect fill={kuat} height="12" width="92" x="30" y="60" />
          <rect fill={kuat} height="8" rx="2" width="18" x="40" y="84" opacity="0.35" />
          <rect fill="#fff" height="72" rx="8" stroke={NAVY} strokeWidth="3" width="44" x="128" y="40" />
          <path d="M138 58h24M138 70h16" stroke={NAVY} strokeLinecap="round" strokeWidth="3" opacity="0.3" />
          <circle cx="150" cy="92" fill={kuat} r="7" />
          <path d="M118 122c14 6 30 4 42-6" stroke={kuat} strokeLinecap="round" strokeWidth="3" strokeDasharray="4 6" />
        </>
      );

    /* Daftar mutasi dengan satu baris ditandai. */
    case "lonceng":
      return (
        <>
          <circle cx="100" cy="80" fill={lembut} r="62" />
          <rect fill="#fff" height="98" rx="8" stroke={NAVY} strokeWidth="3" width="84" x="42" y="28" />
          <path d="M56 50h40M56 64h56M56 92h40M56 106h56" stroke={NAVY} strokeLinecap="round" strokeWidth="3" opacity="0.28" />
          <rect fill={lembut} height="18" rx="4" width="70" x="49" y="70" />
          <path d="M56 79h34" stroke={kuat} strokeLinecap="round" strokeWidth="3" />
          <circle cx="146" cy="56" fill="#fff" r="22" stroke={NAVY} strokeWidth="3" />
          <path
            d="M146 46a8 8 0 018 8v6l3 4h-22l3-4v-6a8 8 0 018-8z"
            fill={kuat}
          />
          <path d="M143 66a3 3 0 006 0" fill={kuat} />
        </>
      );

    /* Piala dengan serpih perayaan. */
    case "piala":
      return (
        <>
          <circle cx="100" cy="82" fill={lembut} r="60" />
          <path
            d="M74 34h52v26a26 26 0 01-52 0V34z"
            fill={kuat}
            stroke={NAVY}
            strokeLinejoin="round"
            strokeWidth="3"
          />
          <path d="M74 40H60a12 12 0 0014 22M126 40h14a12 12 0 01-14 22" fill="none" stroke={NAVY} strokeWidth="3" />
          <path d="M100 86v18" stroke={NAVY} strokeLinecap="round" strokeWidth="3" />
          <rect fill="#fff" height="10" rx="3" stroke={NAVY} strokeWidth="3" width="44" x="78" y="104" />
          <rect fill="#fff" height="10" rx="3" stroke={NAVY} strokeWidth="3" width="60" x="70" y="118" />
          <rect fill={kuat} height="7" rx="2" transform="rotate(-25 44 42)" width="7" x="44" y="42" />
          <rect fill={kuat} height="7" rx="2" transform="rotate(20 152 36)" width="7" x="152" y="36" opacity="0.7" />
          <circle cx="40" cy="80" fill={kuat} opacity="0.45" r="4" />
          <circle cx="162" cy="76" fill={kuat} opacity="0.35" r="5" />
        </>
      );

    /* Dua jalur keputusan bercabang — inti simulasi. */
    case "simulasi":
      return (
        <>
          <circle cx="100" cy="80" fill={lembut} r="62" />
          <rect fill="#fff" height="34" rx="8" stroke={NAVY} strokeWidth="3" width="72" x="26" y="30" />
          <path d="M40 42h36M40 52h24" stroke={NAVY} strokeLinecap="round" strokeWidth="3" opacity="0.3" />
          <path d="M62 76v14h44M62 76v14H26" fill="none" stroke={kuat} strokeLinecap="round" strokeWidth="3" />
          <rect fill="#fff" height="30" rx="8" stroke={kuat} strokeWidth="3" width="64" x="106" y="76" />
          <path d="M118 91l7 7 13-14" stroke={kuat} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          <rect fill="#fff" height="30" rx="8" stroke={NAVY} strokeWidth="3" width="52" x="18" y="104" opacity="0.6" />
          <path d="M34 119h20" stroke={NAVY} strokeLinecap="round" strokeWidth="3" opacity="0.4" />
        </>
      );

    /* Arah ke kanal resmi — bukan kotak masuk pengaduan. */
    case "adukan":
      return (
        <>
          <circle cx="100" cy="80" fill={lembut} r="62" />
          <rect fill="#fff" height="52" rx="8" stroke={NAVY} strokeWidth="3" width="60" x="20" y="54" />
          <path d="M32 70h36M32 82h22" stroke={NAVY} strokeLinecap="round" strokeWidth="3" opacity="0.3" />
          <path d="M86 80h34" stroke={kuat} strokeLinecap="round" strokeWidth="4" />
          <path d="M112 72l10 8-10 8" fill="none" stroke={kuat} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          <path d="M128 62h48v50h-48z" fill="#fff" stroke={NAVY} strokeLinejoin="round" strokeWidth="3" />
          <path d="M124 62l28-16 28 16" fill="#fff" stroke={NAVY} strokeLinejoin="round" strokeWidth="3" />
          <rect fill={kuat} height="22" rx="2" width="8" x="140" y="78" />
          <rect fill={kuat} height="22" rx="2" width="8" x="156" y="78" opacity="0.6" />
        </>
      );

    /* Gelembung masukan dengan bintang. */
    case "feedback":
      return (
        <>
          <circle cx="100" cy="80" fill={lembut} r="62" />
          <path
            d="M40 40h104a8 8 0 018 8v50a8 8 0 01-8 8H84l-24 18v-18H40a8 8 0 01-8-8V48a8 8 0 018-8z"
            fill="#fff"
            stroke={NAVY}
            strokeLinejoin="round"
            strokeWidth="3"
          />
          <path d="M56 62h72M56 78h44" stroke={NAVY} strokeLinecap="round" strokeWidth="3" opacity="0.28" />
          <path
            d="M138 26l4.6 9.4 10.4 1.5-7.5 7.3 1.8 10.3-9.3-4.9-9.3 4.9 1.8-10.3-7.5-7.3 10.4-1.5z"
            fill={kuat}
            stroke="#fff"
            strokeWidth="2"
          />
        </>
      );

    /* Keadaan kosong — kotak terbuka bergaris putus. */
    case "kosong":
      return (
        <>
          <circle cx="100" cy="82" fill={lembut} r="56" />
          <path
            d="M46 76h108v46a8 8 0 01-8 8H54a8 8 0 01-8-8V76z"
            fill="#fff"
            stroke={NAVY}
            strokeDasharray="7 7"
            strokeLinejoin="round"
            strokeWidth="3"
          />
          <path d="M46 76l16-26h76l16 26" fill="none" stroke={NAVY} strokeLinejoin="round" strokeWidth="3" opacity="0.5" />
          <path d="M84 96h32" stroke={kuat} strokeLinecap="round" strokeWidth="4" />
        </>
      );

    /* Adegan merek untuk halaman muka. */
    case "merek":
      return (
        <>
          <circle cx="100" cy="80" fill={lembut} opacity="0.18" r="72" />
          <circle cx="100" cy="80" fill={lembut} opacity="0.12" r="54" />
          <rect fill="#fff" height="116" rx="12" stroke={NAVY} strokeWidth="3" width="78" x="61" y="22" />
          <rect fill={lembut} height="116" rx="12" width="78" x="61" y="22" opacity="0.25" />
          <path
            d="M100 50l24 9v21c0 16-10 28-24 33-14-5-24-17-24-33V59l24-9z"
            fill="#fff"
            stroke={NAVY}
            strokeLinejoin="round"
            strokeWidth="3"
          />
          <path d="M90 82l7 7 14-15" stroke={kuat} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          <path d="M74 122h52" stroke={NAVY} strokeLinecap="round" strokeWidth="3" opacity="0.25" />
          <Sudut warna={kuat} x={16} y={26} />
          <Sudut warna={kuat} x={168} y={26} />
          <Sudut warna={kuat} x={16} y={124} />
        </>
      );
  }
}

export default function Ilustrasi({
  nama,
  warna = "adukan",
  className = "",
}: {
  nama: NamaIlustrasi;
  warna?: Warna;
  className?: string;
}) {
  const { kuat, lembut } = AKSEN[warna];
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      role="presentation"
      viewBox="0 0 200 160"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Adegan kuat={kuat} lembut={lembut} nama={nama} />
    </svg>
  );
}

export { TINTA as warnaTintaIlustrasi };

/** Nama ikon di modul.json memakai kosakata ikon; ini menjembatani ke adegan. */
export function ilustrasiModul(ikon: string): NamaIlustrasi {
  const peta: Record<string, NamaIlustrasi> = {
    kartu: "kartu",
    perisai: "perisai",
    kunci: "kunci",
    waspada: "waspada",
    qr: "qris",
    lonceng: "lonceng",
  };
  return peta[ikon] ?? "kartu";
}
