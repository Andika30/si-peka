/**
 * Satu-satunya pintu ke isi aplikasi.
 * Komponen tidak pernah mengimpor JSON langsung — supaya kalau sumbernya
 * nanti pindah (mis. ke Google Sheets), hanya berkas ini yang berubah.
 */
import materiJson from "@/content/materi.json";
import skenarioJson from "@/content/skenario.json";
import kasusJson from "@/content/kasus.json";
import soalJson from "@/content/soal.json";
import checklistJson from "@/content/checklist.json";
import penyelenggaraJson from "@/content/penyelenggara.json";
import susJson from "@/content/sus.json";

export type Dimensi = "peduli" | "kenali" | "adukan";

export const DIMENSI: { id: Dimensi; label: string; warna: string }[] = [
  { id: "peduli", label: "Peduli", warna: "var(--color-peduli)" },
  { id: "kenali", label: "Kenali", warna: "var(--color-kenali)" },
  { id: "adukan", label: "Adukan", warna: "var(--color-adukan)" },
];

export type Materi = {
  id: string;
  judul: string;
  isi: string;
  poin: string[];
  ikon: string;
  peringatan?: string;
};

export type OpsiSkenario = {
  teks: string;
  aman: boolean;
  /** Hanya ada pada pilihan yang keliru: akibat yang diperlihatkan lebih dulu. */
  konsekuensi?: string;
};

export type Skenario = {
  id: string;
  konteks: { label: string; nilai: string }[];
  situasi: string;
  opsi: OpsiSkenario[];
  alasan: string;
};

export type Kasus = {
  id: string;
  label: string;
  ringkas: string;
  judul: string;
  pembuka: string;
  /** Kasus mendesak menampilkan penanda waktu di paling atas. */
  segera?: string;
  /** Kasus penipuan menaruh peringatan keamanan SEBELUM langkah. */
  peringatanUtama?: string;
  langkah: string[];
  /** Hanya kasus yang sudah melewati penyelenggara yang membuka jalur BI. */
  eskalasiBI: boolean;
};

export type Soal = {
  id: string;
  dimensi: Dimensi;
  indikator: string;
  /** Soal paralel: indikator sama, konteks berbeda. Menjaga N-Gain tetap sahih. */
  awal: string;
  akhir: string;
  opsi: string[];
  kunci: number;
  pembahasan: string;
};

export type ButirChecklist = { id: string; teks: string; waspada?: boolean };

export type Penyelenggara = {
  id: string;
  nama: string;
  jenis: string;
  telepon: string;
  aplikasi: string;
  situs: string;
  diverifikasi: string;
};

export const materi = materiJson as Materi[];
export const skenario = skenarioJson as Skenario[];
export const kasus = kasusJson as Kasus[];
export const soal = soalJson as Soal[];
export const checklist = checklistJson as ButirChecklist[];
export const layanan = penyelenggaraJson.layanan;
export const penyelenggara = penyelenggaraJson.daftar as Penyelenggara[];
export const bankIndonesia = penyelenggaraJson.bankIndonesia;
export const sus = susJson.pernyataan;

export const cariMateri = (id: string) => materi.find((m) => m.id === id);
export const cariKasus = (id: string) => kasus.find((k) => k.id === id);
export const indeksMateri = (id: string) => materi.findIndex((m) => m.id === id);
export const soalPerDimensi = (d: Dimensi) => soal.filter((s) => s.dimensi === d);
