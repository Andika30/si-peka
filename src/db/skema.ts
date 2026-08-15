import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Skema basis data PeKA.
 *
 * Seluruh isi aplikasi tinggal di sini — materi, kuis, skenario simulasi, dan
 * panduan pengaduan. Tidak ada satu pun tabel untuk data pengguna: progres
 * belajar tetap di peramban masing-masing, dan aplikasi ini memang tidak
 * menerima aduan, jadi tidak ada yang perlu disimpan.
 *
 * Dua kebiasaan yang dipegang seluruh tabel isi:
 *
 *  - `aktif`   admin menonaktifkan sesuatu tanpa menghapusnya, supaya materi
 *              yang ditarik masih bisa ditelusuri dan dikembalikan.
 *  - `urutan`  urutan tampil ditentukan admin, bukan kebetulan urutan sisip.
 *
 * ID sengaja teks yang bermakna ("mengenal-qris"), bukan angka otomatis, sebab
 * ID itu muncul di alamat halaman dan dipakai menyambung materi ke kuis dan
 * panduan. Alamat halaman jadi tetap terbaca dan tidak berubah saat data
 * dimuat ulang.
 */

/** Dipakai untuk mewarnai chip, bar, dan aksen kartu. */
export const WARNA = [
  "institusi",
  "adukan",
  "peduli",
  "kenali",
  "waspada",
  "ungu",
  "emas",
] as const;

/* ── Materi ──────────────────────────────────────────────────────────────── */

export const kategori = mysqlTable("kategori", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nama: varchar("nama", { length: 120 }).notNull(),
  ringkas: varchar("ringkas", { length: 255 }).notNull(),
  warna: mysqlEnum("warna", WARNA).notNull().default("adukan"),
  ikon: varchar("ikon", { length: 48 }).notNull(),
  urutan: int("urutan").notNull().default(0),
  aktif: boolean("aktif").notNull().default(true),
});

export const topik = mysqlTable(
  "topik",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    kategoriId: varchar("kategori_id", { length: 64 })
      .notNull()
      .references(() => kategori.id),
    judul: varchar("judul", { length: 200 }).notNull(),
    ringkas: varchar("ringkas", { length: 255 }).notNull(),
    ikon: varchar("ikon", { length: 48 }).notNull(),
    warna: mysqlEnum("warna", WARNA).notNull().default("adukan"),
    /** Ditampilkan sebagai kotak merah di bawah materi. Tidak semua punya. */
    peringatan: varchar("peringatan", { length: 500 }),
    sumber: varchar("sumber", { length: 255 }).notNull(),
    urutan: int("urutan").notNull().default(0),
    aktif: boolean("aktif").notNull().default(true),
  },
  (t) => [index("idx_topik_kategori").on(t.kategoriId)],
);

/**
 * Isi materi disimpan sebagai BLOK berurut, bukan satu kolom teks panjang.
 *
 * Ada tiga jenis blok: paragraf, poin, dan gambar. Bentuk begini dipilih
 * daripada menyimpan HTML dari editor WYSIWYG karena tiga hal: tampilannya
 * tetap dikendalikan aplikasi (tipografi tidak bisa dirusak tempelan dari
 * Word), tidak ada celah HTML berbahaya yang perlu dibersihkan, dan admin
 * bisa memindahkan satu blok tanpa menyunting seluruh materi.
 *
 * Untuk blok `gambar`, kolom `teks` berisi nama berkasnya dan `keterangan`
 * berisi kalimat di bawah gambar sekaligus teks alternatifnya.
 */
export const isiTopik = mysqlTable(
  "isi_topik",
  {
    id: int("id").autoincrement().primaryKey(),
    topikId: varchar("topik_id", { length: 64 })
      .notNull()
      .references(() => topik.id, { onDelete: "cascade" }),
    jenis: mysqlEnum("jenis", ["paragraf", "poin", "gambar"]).notNull(),
    teks: text("teks").notNull(),
    keterangan: varchar("keterangan", { length: 255 }),
    urutan: int("urutan").notNull().default(0),
  },
  (t) => [index("idx_isi_topik").on(t.topikId, t.urutan)],
);

/* ── Berita ──────────────────────────────────────────────────────────────── */

/**
 * Kabar dan pengumuman di halaman depan.
 *
 * Berbeda dari materi yang bertahan lama, berita terikat waktu — dan itu
 * risikonya sendiri untuk aplikasi berlabel Bank Indonesia. Karena itu dua
 * kolom di bawah ini tidak boleh kosong: `tanggal` supaya pembaca tahu
 * kabarnya sudah lama atau belum, dan `sumber` supaya klaimnya bisa
 * ditelusuri. Berita tanpa keduanya tidak lebih baik daripada tidak ada.
 *
 * Berita sengaja TIDAK jadi menu di dashboard peserta. Empat kelompok fitur
 * di blok konsep tetap empat; ini komunikasi kelembagaan di halaman publik.
 */
export const berita = mysqlTable(
  "berita",
  {
    id: varchar("id", { length: 96 }).primaryKey(),
    judul: varchar("judul", { length: 220 }).notNull(),
    ringkas: varchar("ringkas", { length: 300 }).notNull(),
    /** Gambar sampul, tampil di kartu halaman depan. */
    gambar: varchar("gambar", { length: 255 }),
    gambarAlt: varchar("gambar_alt", { length: 255 }),
    sumber: varchar("sumber", { length: 255 }).notNull(),
    /** Bentuk YYYY-MM-DD. Urutan tampil ditentukan ini, bukan waktu sisip. */
    tanggal: varchar("tanggal", { length: 10 }).notNull(),
    aktif: boolean("aktif").notNull().default(true),
  },
  (t) => [index("idx_berita_tanggal").on(t.tanggal)],
);

/** Isi berita memakai bentuk blok yang sama dengan materi. */
export const isiBerita = mysqlTable(
  "isi_berita",
  {
    id: int("id").autoincrement().primaryKey(),
    beritaId: varchar("berita_id", { length: 96 })
      .notNull()
      .references(() => berita.id, { onDelete: "cascade" }),
    jenis: mysqlEnum("jenis", ["paragraf", "poin", "gambar"]).notNull(),
    teks: text("teks").notNull(),
    keterangan: varchar("keterangan", { length: 255 }),
    urutan: int("urutan").notNull().default(0),
  },
  (t) => [index("idx_isi_berita").on(t.beritaId, t.urutan)],
);

/* ── Kuis ────────────────────────────────────────────────────────────────── */

export const kuis = mysqlTable(
  "kuis",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    judul: varchar("judul", { length: 200 }).notNull(),
    /** Kuis selalu menempel pada satu materi — itu dasar rekomendasi
        "baca ulang bagian ini" di halaman hasil. */
    topikId: varchar("topik_id", { length: 64 })
      .notNull()
      .references(() => topik.id),
    urutan: int("urutan").notNull().default(0),
    aktif: boolean("aktif").notNull().default(true),
  },
  (t) => [index("idx_kuis_topik").on(t.topikId)],
);

export const soal = mysqlTable(
  "soal",
  {
    id: int("id").autoincrement().primaryKey(),
    kuisId: varchar("kuis_id", { length: 64 })
      .notNull()
      .references(() => kuis.id, { onDelete: "cascade" }),
    pertanyaan: text("pertanyaan").notNull(),
    /** Nomor urut opsi yang benar, dihitung dari 0. */
    kunci: int("kunci").notNull(),
    pembahasan: text("pembahasan").notNull(),
    urutan: int("urutan").notNull().default(0),
  },
  (t) => [index("idx_soal_kuis").on(t.kuisId, t.urutan)],
);

export const opsiSoal = mysqlTable(
  "opsi_soal",
  {
    soalId: int("soal_id")
      .notNull()
      .references(() => soal.id, { onDelete: "cascade" }),
    urutan: int("urutan").notNull(),
    teks: text("teks").notNull(),
  },
  (t) => [primaryKey({ columns: [t.soalId, t.urutan] })],
);

/* ── Simulasi ────────────────────────────────────────────────────────────── */

export const skenario = mysqlTable("skenario", {
  id: varchar("id", { length: 64 }).primaryKey(),
  situasi: text("situasi").notNull(),
  /** Penjelasan langkah yang aman — bagian yang paling menentukan. */
  alasan: text("alasan").notNull(),
  /**
   * Tangkapan layar situasinya — misalnya layar konfirmasi QRIS atau pesan
   * masuk yang mencurigakan. Satu gambar per skenario, tampil di atas kartu
   * konteks. Kosong berarti skenarionya cukup dijelaskan dengan teks.
   */
  gambar: varchar("gambar", { length: 255 }),
  gambarAlt: varchar("gambar_alt", { length: 255 }),
  urutan: int("urutan").notNull().default(0),
  aktif: boolean("aktif").notNull().default(true),
});

/** Baris "Nama toko / Nominal / ..." pada kartu konfirmasi palsu. */
export const konteksSkenario = mysqlTable(
  "konteks_skenario",
  {
    skenarioId: varchar("skenario_id", { length: 64 })
      .notNull()
      .references(() => skenario.id, { onDelete: "cascade" }),
    urutan: int("urutan").notNull(),
    label: varchar("label", { length: 120 }).notNull(),
    nilai: varchar("nilai", { length: 255 }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.skenarioId, t.urutan] })],
);

export const opsiSkenario = mysqlTable(
  "opsi_skenario",
  {
    skenarioId: varchar("skenario_id", { length: 64 })
      .notNull()
      .references(() => skenario.id, { onDelete: "cascade" }),
    urutan: int("urutan").notNull(),
    teks: text("teks").notNull(),
    aman: boolean("aman").notNull().default(false),
    /** Hanya diisi pada pilihan keliru: akibat yang diperlihatkan lebih dulu. */
    konsekuensi: text("konsekuensi"),
  },
  (t) => [primaryKey({ columns: [t.skenarioId, t.urutan] })],
);

/* ── Panduan pengaduan ───────────────────────────────────────────────────── */

/**
 * Panduan, bukan pengaduan. Tabel ini menyimpan JAWABAN yang ditampilkan —
 * apa yang harus dilakukan dan ke mana harus mengadu — bukan laporan dari
 * masyarakat. Aplikasi ini tidak punya tabel untuk menerima aduan.
 */
export const masalah = mysqlTable("masalah", {
  id: varchar("id", { length: 64 }).primaryKey(),
  label: varchar("label", { length: 160 }).notNull(),
  ringkas: varchar("ringkas", { length: 255 }).notNull(),
  judul: varchar("judul", { length: 200 }).notNull(),
  pembuka: text("pembuka").notNull(),
  /** Kasus mendesak: kalimat "jangan tunggu besok" di paling atas. */
  segera: varchar("segera", { length: 500 }),
  /** Kasus penipuan: peringatan keamanan yang muncul SEBELUM langkah. */
  peringatanUtama: varchar("peringatan_utama", { length: 500 }),
  pihak: varchar("pihak", { length: 255 }).notNull(),
  /** Hanya masalah yang sudah melewati penyelenggara yang membuka jalur BI. */
  eskalasiBi: boolean("eskalasi_bi").notNull().default(false),
  topikId: varchar("topik_id", { length: 64 }).references(() => topik.id),
  sumber: varchar("sumber", { length: 255 }).notNull(),
  urutan: int("urutan").notNull().default(0),
  aktif: boolean("aktif").notNull().default(true),
});

export const langkahMasalah = mysqlTable(
  "langkah_masalah",
  {
    masalahId: varchar("masalah_id", { length: 64 })
      .notNull()
      .references(() => masalah.id, { onDelete: "cascade" }),
    urutan: int("urutan").notNull(),
    teks: text("teks").notNull(),
  },
  (t) => [primaryKey({ columns: [t.masalahId, t.urutan] })],
);

/* ── Kanal resmi ─────────────────────────────────────────────────────────── */

export const layanan = mysqlTable("layanan", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nama: varchar("nama", { length: 120 }).notNull(),
  ringkas: varchar("ringkas", { length: 255 }).notNull(),
  ikon: varchar("ikon", { length: 48 }).notNull(),
  urutan: int("urutan").notNull().default(0),
  aktif: boolean("aktif").notNull().default(true),
});

/**
 * Nomor dan tautan kanal resmi berubah. `diverifikasi` membuat kebasian
 * datanya terlihat di layar, bukan tersembunyi — halaman hasil menampilkannya
 * apa adanya sebagai "diverifikasi terakhir".
 */
export const penyelenggara = mysqlTable("penyelenggara", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nama: varchar("nama", { length: 160 }).notNull(),
  jenis: varchar("jenis", { length: 120 }).notNull(),
  telepon: varchar("telepon", { length: 120 }).notNull(),
  aplikasi: varchar("aplikasi", { length: 160 }).notNull(),
  situs: varchar("situs", { length: 255 }).notNull(),
  diverifikasi: varchar("diverifikasi", { length: 64 }).notNull(),
  urutan: int("urutan").notNull().default(0),
  aktif: boolean("aktif").notNull().default(true),
});

/**
 * Isi yang berdiri sendiri dan hanya ada satu — kanal resmi Bank Indonesia,
 * syarat eskalasi, nama instansi. Disimpan sebagai pasangan kunci–nilai
 * supaya admin bisa memperbaruinya tanpa perlu tabel baru untuk tiap kalimat.
 */
export const pengaturan = mysqlTable("pengaturan", {
  kunci: varchar("kunci", { length: 96 }).primaryKey(),
  nilai: text("nilai").notNull(),
});

/* ── Statistik pemakaian ─────────────────────────────────────────────────────
   Semua tabel di bawah ini menyimpan ANGKA, bukan orang.

   Tidak ada id pengguna, id perangkat, alamat IP, maupun cap waktu per
   kejadian yang bisa dirangkai jadi jejak seseorang. Yang bertambah hanyalah
   penghitung: "materi X dibuka 12 kali hari ini". Dari satu baris mana pun —
   atau dari seluruh tabel sekaligus — tidak ada cara mengetahui siapa yang
   melakukannya, atau apakah dua kejadian berasal dari orang yang sama.

   Itu batas yang dipegang: dasbor perlu tahu apa yang dipakai, bukan siapa
   yang memakainya. */

export const JENIS_PERISTIWA = [
  "kunjungan",
  "materi_dibuka",
  "kuis_selesai",
  "simulasi_selesai",
  "panduan_dibuka",
] as const;

/**
 * Penghitung harian. Satu baris per (jenis, yang dirujuk, tanggal), dan
 * kolom `jumlah` yang naik. Tanggalnya cukup sampai hari — bukan detik —
 * supaya tidak bisa dipakai mencocokkan kejadian antarpengguna.
 */
export const peristiwa = mysqlTable(
  "peristiwa",
  {
    jenis: mysqlEnum("jenis", JENIS_PERISTIWA).notNull(),
    /** ID materi/kuis/skenario yang dirujuk. Kosong untuk kunjungan umum. */
    rujukan: varchar("rujukan", { length: 64 }).notNull().default(""),
    /** Bentuk YYYY-MM-DD. */
    tanggal: varchar("tanggal", { length: 10 }).notNull(),
    jumlah: int("jumlah").notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.jenis, t.rujukan, t.tanggal] }),
    index("idx_peristiwa_tanggal").on(t.tanggal),
  ],
);

/** Rata-rata skor per kuis, tanpa menyimpan skor siapa pun satu per satu. */
export const statistikKuis = mysqlTable("statistik_kuis", {
  kuisId: varchar("kuis_id", { length: 64 })
    .primaryKey()
    .references(() => kuis.id, { onDelete: "cascade" }),
  dikerjakan: int("dikerjakan").notNull().default(0),
  jumlahSkor: int("jumlah_skor").notNull().default(0),
});

/** Berapa kali sebuah soal dijawab dan berapa kali keliru — dasar daftar
    "soal paling sering salah" yang menunjukkan materi mana yang kurang jelas. */
export const statistikSoal = mysqlTable("statistik_soal", {
  soalId: int("soal_id")
    .primaryKey()
    .references(() => soal.id, { onDelete: "cascade" }),
  dijawab: int("dijawab").notNull().default(0),
  keliru: int("keliru").notNull().default(0),
});

/** Tingkat keberhasilan skenario simulasi. */
export const statistikSkenario = mysqlTable("statistik_skenario", {
  skenarioId: varchar("skenario_id", { length: 64 })
    .primaryKey()
    .references(() => skenario.id, { onDelete: "cascade" }),
  dicoba: int("dicoba").notNull().default(0),
  aman: int("aman").notNull().default(0),
});

/**
 * Masukan dari peserta.
 *
 * Ini satu-satunya tabel yang memuat tulisan peserta — dan hanya karena
 * mereka menuliskannya dengan sengaja untuk dibaca. Tidak ada nama, kontak,
 * atau apa pun yang menyambungkannya ke orangnya; halaman feedback memang
 * tidak menanyakan itu.
 */
export const feedback = mysqlTable(
  "feedback",
  {
    id: int("id").autoincrement().primaryKey(),
    jenis: varchar("jenis", { length: 32 }).notNull(),
    komentar: text("komentar").notNull(),
    dibuat: varchar("dibuat", { length: 32 }).notNull(),
    dibaca: boolean("dibaca").notNull().default(false),
  },
  (t) => [index("idx_feedback_dibuat").on(t.dibuat)],
);

/* ── Pengelola ───────────────────────────────────────────────────────────── */

/**
 * Jejak perubahan isi oleh pengelola.
 *
 * Berbeda dari tabel statistik di atas, di sini identitas justru DIPERLUKAN:
 * kalau materi berubah, harus jelas siapa yang mengubahnya dan kapan.
 */
export const logAdmin = mysqlTable(
  "log_admin",
  {
    id: int("id").autoincrement().primaryKey(),
    adminId: int("admin_id"),
    namaAdmin: varchar("nama_admin", { length: 120 }).notNull(),
    aksi: mysqlEnum("aksi", ["tambah", "ubah", "hapus", "masuk"]).notNull(),
    jenis: varchar("jenis", { length: 32 }).notNull(),
    sasaran: varchar("sasaran", { length: 255 }).notNull(),
    waktu: varchar("waktu", { length: 32 }).notNull(),
  },
  (t) => [index("idx_log_waktu").on(t.waktu)],
);


/**
 * Akun pengelola konten — dan HANYA pengelola.
 *
 * Tidak ada tabel untuk peserta. Progres belajar, hasil kuis, dan riwayat
 * simulasi tetap di peramban masing-masing; aplikasi ini menjanjikan itu di
 * halaman Masuk, Profil, dan Tentang. Yang perlu dibatasi adalah siapa yang
 * boleh mengubah isi aplikasi, bukan siapa yang boleh membacanya.
 *
 * Kata sandi disimpan sebagai hash scrypt beserta garamnya — tidak pernah
 * apa adanya. Lihat `lib/admin/sandi.ts`.
 */
export const admin = mysqlTable("admin", {
  id: int("id").autoincrement().primaryKey(),
  nama: varchar("nama", { length: 120 }).notNull(),
  pengguna: varchar("pengguna", { length: 64 }).notNull().unique(),
  sandi: varchar("sandi", { length: 255 }).notNull(),
  aktif: boolean("aktif").notNull().default(true),
  dibuat: varchar("dibuat", { length: 32 }).notNull(),
  terakhirMasuk: varchar("terakhir_masuk", { length: 32 }),
});

/* ── Penilaian usability ─────────────────────────────────────────────────── */

/**
 * Sepuluh pernyataan System Usability Scale. `positif` menentukan cara
 * menghitungnya: butir positif dikurangi 1, butir negatif dikurangi dari 5.
 * Ini menilai kemudahan aplikasinya — bukan literasi penggunanya.
 */
export const sus = mysqlTable("sus", {
  urutan: int("urutan").primaryKey(),
  teks: varchar("teks", { length: 500 }).notNull(),
  positif: boolean("positif").notNull(),
});

/* ── Relasi ──────────────────────────────────────────────────────────────── */

export const relasiKategori = relations(kategori, ({ many }) => ({
  topik: many(topik),
}));

export const relasiTopik = relations(topik, ({ one, many }) => ({
  kategori: one(kategori, { fields: [topik.kategoriId], references: [kategori.id] }),
  isi: many(isiTopik),
  kuis: many(kuis),
  masalah: many(masalah),
}));

export const relasiIsiTopik = relations(isiTopik, ({ one }) => ({
  topik: one(topik, { fields: [isiTopik.topikId], references: [topik.id] }),
}));

export const relasiBerita = relations(berita, ({ many }) => ({
  isi: many(isiBerita),
}));

export const relasiIsiBerita = relations(isiBerita, ({ one }) => ({
  berita: one(berita, { fields: [isiBerita.beritaId], references: [berita.id] }),
}));

export const relasiKuis = relations(kuis, ({ one, many }) => ({
  topik: one(topik, { fields: [kuis.topikId], references: [topik.id] }),
  soal: many(soal),
}));

export const relasiSoal = relations(soal, ({ one, many }) => ({
  kuis: one(kuis, { fields: [soal.kuisId], references: [kuis.id] }),
  opsi: many(opsiSoal),
}));

export const relasiOpsiSoal = relations(opsiSoal, ({ one }) => ({
  soal: one(soal, { fields: [opsiSoal.soalId], references: [soal.id] }),
}));

export const relasiSkenario = relations(skenario, ({ many }) => ({
  konteks: many(konteksSkenario),
  opsi: many(opsiSkenario),
}));

export const relasiKonteksSkenario = relations(konteksSkenario, ({ one }) => ({
  skenario: one(skenario, {
    fields: [konteksSkenario.skenarioId],
    references: [skenario.id],
  }),
}));

export const relasiOpsiSkenario = relations(opsiSkenario, ({ one }) => ({
  skenario: one(skenario, {
    fields: [opsiSkenario.skenarioId],
    references: [skenario.id],
  }),
}));

export const relasiMasalah = relations(masalah, ({ one, many }) => ({
  topik: one(topik, { fields: [masalah.topikId], references: [topik.id] }),
  langkah: many(langkahMasalah),
}));

export const relasiLangkahMasalah = relations(langkahMasalah, ({ one }) => ({
  masalah: one(masalah, {
    fields: [langkahMasalah.masalahId],
    references: [masalah.id],
  }),
}));
