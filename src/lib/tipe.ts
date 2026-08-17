/**
 * Bentuk isi aplikasi.
 *
 * Sengaja dipisah dari `konten.ts`. Berkas itu menyentuh basis data dan
 * ditandai `server-only`; komponen klien tetap perlu bentuk datanya untuk
 * menerima props. Dengan memisahkannya, tipe bisa diimpor dari mana saja
 * tanpa ikut menarik koneksi MySQL ke dalam berkas klien.
 *
 * Bentuk di sini mengikuti kebutuhan tampilan, bukan bentuk tabel. Pemetaan
 * dari baris tabel ke bentuk ini dikerjakan di `konten.ts`.
 */

export type Warna = "institusi" | "adukan" | "peduli" | "kenali" | "waspada" | "ungu" | "emas";

export type Kategori = {
  id: string;
  nama: string;
  ringkas: string;
  warna: Warna;
  ikon: string;
};

/**
 * Satu blok isi materi. Untuk `gambar`, `teks` berisi nama berkas dan
 * `keterangan` kalimat di bawahnya; untuk `paragraf` dan `poin`, `teks`
 * adalah kalimatnya sendiri.
 */
export type BlokIsi = {
  jenis: "subjudul" | "paragraf" | "poin" | "gambar" | "kartu-flip" | "video";
  /** Untuk `kartu-flip`: teks sisi depan. Untuk `video`: ID video YouTube. */
  teks: string;
  /** Untuk `gambar`: keterangan/alt. Untuk `kartu-flip`: teks sisi belakang.
      Untuk `video`: keterangan di bawah video. */
  keterangan?: string;
};

export type Topik = {
  id: string;
  kategori: string;
  judul: string;
  ringkas: string;
  ikon: string;
  warna: Warna;
  /** Blok berurut — urutan di sini persis urutan tampil di halaman materi. */
  isi: BlokIsi[];
  peringatan?: string;
  sumber: string;
  /** Menghubungkan materi ke kuisnya: dasar rekomendasi setelah kuis. */
  kuisTerkait: string;
};

/**
 * Kabar dan pengumuman di halaman depan.
 *
 * `tanggal` dan `sumber` sengaja wajib, bukan opsional: berita terikat waktu,
 * dan tanpa keduanya pembaca tidak punya cara menilai kabarnya masih berlaku
 * atau tidak.
 */
export type Berita = {
  id: string;
  judul: string;
  ringkas: string;
  gambar?: string;
  gambarAlt?: string;
  sumber: string;
  tanggal: string;
  isi: BlokIsi[];
};

export type SoalKuis = {
  pertanyaan: string;
  opsi: string[];
  kunci: number;
  pembahasan: string;
};

export type Kuis = {
  id: string;
  judul: string;
  materiTerkait: string;
  soal: SoalKuis[];
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
  /** Tangkapan layar situasinya. Kosong berarti cukup dijelaskan teks. */
  gambar?: string;
  gambarAlt?: string;
};

export type Masalah = {
  id: string;
  aktif: boolean;
  label: string;
  ringkas: string;
  judul: string;
  pembuka: string;
  segera?: string;
  peringatanUtama?: string;
  langkah: string[];
  pihak: string;
  /**
   * Langkah yang ditanyakan sebelum jawaban muncul. Tidak semua masalah butuh
   * keduanya — menanyakan hal yang tidak menentukan apa-apa hanya menunda.
   */
  perluLayanan: boolean;
  perluPenyelenggara: boolean;
  /** Hanya masalah yang sudah melewati penyelenggara yang membuka jalur BI. */
  eskalasiBI: boolean;
  materiTerkait: string;
  sumber: string;
};

export type Layanan = {
  id: string;
  nama: string;
  ringkas: string;
  ikon: string;
};

export type InfoAwal = {
  id: string;
  judul: string;
  keterangan: string | null;
};

export type Penyelenggara = {
  id: string;
  nama: string;
  jenis: string;
  telepon: string;
  aplikasi: string;
  situs: string;
  diverifikasi: string;
  /** ID jenis layanan yang ditangani penyelenggara ini — dasar penyaringan
      daftar setelah peserta memilih layanan yang dipakainya. */
  layanan: string[];
};

export type BankIndonesia = {
  nama: string;
  telepon: string;
  situs: string;
  situsLabel: string;
  diverifikasi: string;
};

/**
 * Ringkasan isi yang dibutuhkan komponen klien untuk menghitung progres dan
 * menyusun riwayat. Dikirim dari halaman server sebagai props — supaya
 * `skor.ts`, yang hidup di peramban, tidak perlu tahu apa pun soal basis data.
 */
export type RingkasKonten = {
  topik: Pick<Topik, "id" | "judul" | "ringkas" | "warna" | "kuisTerkait">[];
  kuis: Pick<Kuis, "id" | "judul" | "materiTerkait">[];
  jumlahSkenario: number;
};
