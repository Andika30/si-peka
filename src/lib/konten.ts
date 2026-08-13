/**
 * Satu-satunya pintu ke isi aplikasi.
 * Komponen tidak pernah mengimpor JSON langsung — supaya kalau sumbernya
 * nanti pindah (mis. ke Google Sheets), hanya berkas ini yang berubah.
 */
import modulJson from "@/content/modul.json";
import skenarioJson from "@/content/skenario.json";
import kasusJson from "@/content/kasus.json";
import soalJson from "@/content/soal.json";
import checklistJson from "@/content/checklist.json";
import penyelenggaraJson from "@/content/penyelenggara.json";
import susJson from "@/content/sus.json";
import lencanaJson from "@/content/lencana.json";

export type Dimensi = "peduli" | "kenali" | "adukan";
export type Warna = "institusi" | "adukan" | "peduli" | "kenali" | "waspada" | "ungu" | "emas";

export const DIMENSI: { id: Dimensi; label: string }[] = [
  { id: "peduli", label: "Peduli" },
  { id: "kenali", label: "Kenali" },
  { id: "adukan", label: "Adukan" },
];

export type SoalModul = {
  pertanyaan: string;
  opsi: string[];
  kunci: number;
  pembahasan: string;
};

export type Modul = {
  id: string;
  nomor: string;
  judul: string;
  ringkas: string;
  ikon: string;
  warna: Warna;
  dimensi: Dimensi;
  materi: { paragraf: string[]; poin: string[]; peringatan?: string };
  soal: SoalModul[];
};

export type OpsiSkenario = {
  teks: string;
  aman: boolean;
  /** Hanya ada pada pilihan keliru: akibat yang diperlihatkan lebih dulu. */
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
  segera?: string;
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

export type Lencana = {
  id: string;
  nama: string;
  syarat: string;
  ikon: string;
  warna: Warna;
  jenis: "modul" | "simulasi" | "skor" | "checklist" | "kasus";
  ambang: number;
};

export const modul = modulJson as Modul[];
export const skenario = skenarioJson as Skenario[];
export const kasus = kasusJson as Kasus[];
export const soal = soalJson as Soal[];
export const checklist = checklistJson as ButirChecklist[];
export const layanan = penyelenggaraJson.layanan;
export const penyelenggara = penyelenggaraJson.daftar as Penyelenggara[];
export const bankIndonesia = penyelenggaraJson.bankIndonesia;
export const sus = susJson.pernyataan;
export const lencana = lencanaJson.daftar as Lencana[];
export const nilaiPoin = lencanaJson.poin;

export const cariModul = (id: string) => modul.find((m) => m.id === id);
export const cariKasus = (id: string) => kasus.find((k) => k.id === id);
export const indeksModul = (id: string) => modul.findIndex((m) => m.id === id);
