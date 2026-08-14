CREATE TABLE `isi_topik` (
	`id` int AUTO_INCREMENT NOT NULL,
	`topik_id` varchar(64) NOT NULL,
	`jenis` enum('paragraf','poin') NOT NULL,
	`teks` text NOT NULL,
	`urutan` int NOT NULL DEFAULT 0,
	CONSTRAINT `isi_topik_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kategori` (
	`id` varchar(64) NOT NULL,
	`nama` varchar(120) NOT NULL,
	`ringkas` varchar(255) NOT NULL,
	`warna` enum('institusi','adukan','peduli','kenali','waspada','ungu','emas') NOT NULL DEFAULT 'adukan',
	`ikon` varchar(48) NOT NULL,
	`urutan` int NOT NULL DEFAULT 0,
	`aktif` boolean NOT NULL DEFAULT true,
	CONSTRAINT `kategori_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `konteks_skenario` (
	`skenario_id` varchar(64) NOT NULL,
	`urutan` int NOT NULL,
	`label` varchar(120) NOT NULL,
	`nilai` varchar(255) NOT NULL,
	CONSTRAINT `konteks_skenario_skenario_id_urutan_pk` PRIMARY KEY(`skenario_id`,`urutan`)
);
--> statement-breakpoint
CREATE TABLE `kuis` (
	`id` varchar(64) NOT NULL,
	`judul` varchar(200) NOT NULL,
	`topik_id` varchar(64) NOT NULL,
	`urutan` int NOT NULL DEFAULT 0,
	`aktif` boolean NOT NULL DEFAULT true,
	CONSTRAINT `kuis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `langkah_masalah` (
	`masalah_id` varchar(64) NOT NULL,
	`urutan` int NOT NULL,
	`teks` text NOT NULL,
	CONSTRAINT `langkah_masalah_masalah_id_urutan_pk` PRIMARY KEY(`masalah_id`,`urutan`)
);
--> statement-breakpoint
CREATE TABLE `layanan` (
	`id` varchar(64) NOT NULL,
	`nama` varchar(120) NOT NULL,
	`ringkas` varchar(255) NOT NULL,
	`ikon` varchar(48) NOT NULL,
	`urutan` int NOT NULL DEFAULT 0,
	`aktif` boolean NOT NULL DEFAULT true,
	CONSTRAINT `layanan_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `masalah` (
	`id` varchar(64) NOT NULL,
	`label` varchar(160) NOT NULL,
	`ringkas` varchar(255) NOT NULL,
	`judul` varchar(200) NOT NULL,
	`pembuka` text NOT NULL,
	`segera` varchar(500),
	`peringatan_utama` varchar(500),
	`pihak` varchar(255) NOT NULL,
	`eskalasi_bi` boolean NOT NULL DEFAULT false,
	`topik_id` varchar(64),
	`sumber` varchar(255) NOT NULL,
	`urutan` int NOT NULL DEFAULT 0,
	`aktif` boolean NOT NULL DEFAULT true,
	CONSTRAINT `masalah_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `opsi_skenario` (
	`skenario_id` varchar(64) NOT NULL,
	`urutan` int NOT NULL,
	`teks` text NOT NULL,
	`aman` boolean NOT NULL DEFAULT false,
	`konsekuensi` text,
	CONSTRAINT `opsi_skenario_skenario_id_urutan_pk` PRIMARY KEY(`skenario_id`,`urutan`)
);
--> statement-breakpoint
CREATE TABLE `opsi_soal` (
	`soal_id` int NOT NULL,
	`urutan` int NOT NULL,
	`teks` text NOT NULL,
	CONSTRAINT `opsi_soal_soal_id_urutan_pk` PRIMARY KEY(`soal_id`,`urutan`)
);
--> statement-breakpoint
CREATE TABLE `pengaturan` (
	`kunci` varchar(96) NOT NULL,
	`nilai` text NOT NULL,
	CONSTRAINT `pengaturan_kunci` PRIMARY KEY(`kunci`)
);
--> statement-breakpoint
CREATE TABLE `penyelenggara` (
	`id` varchar(64) NOT NULL,
	`nama` varchar(160) NOT NULL,
	`jenis` varchar(120) NOT NULL,
	`telepon` varchar(120) NOT NULL,
	`aplikasi` varchar(160) NOT NULL,
	`situs` varchar(255) NOT NULL,
	`diverifikasi` varchar(64) NOT NULL,
	`urutan` int NOT NULL DEFAULT 0,
	`aktif` boolean NOT NULL DEFAULT true,
	CONSTRAINT `penyelenggara_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skenario` (
	`id` varchar(64) NOT NULL,
	`situasi` text NOT NULL,
	`alasan` text NOT NULL,
	`urutan` int NOT NULL DEFAULT 0,
	`aktif` boolean NOT NULL DEFAULT true,
	CONSTRAINT `skenario_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `soal` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kuis_id` varchar(64) NOT NULL,
	`pertanyaan` text NOT NULL,
	`kunci` int NOT NULL,
	`pembahasan` text NOT NULL,
	`urutan` int NOT NULL DEFAULT 0,
	CONSTRAINT `soal_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sus` (
	`urutan` int NOT NULL,
	`teks` varchar(500) NOT NULL,
	`positif` boolean NOT NULL,
	CONSTRAINT `sus_urutan` PRIMARY KEY(`urutan`)
);
--> statement-breakpoint
CREATE TABLE `topik` (
	`id` varchar(64) NOT NULL,
	`kategori_id` varchar(64) NOT NULL,
	`judul` varchar(200) NOT NULL,
	`ringkas` varchar(255) NOT NULL,
	`ikon` varchar(48) NOT NULL,
	`warna` enum('institusi','adukan','peduli','kenali','waspada','ungu','emas') NOT NULL DEFAULT 'adukan',
	`peringatan` varchar(500),
	`sumber` varchar(255) NOT NULL,
	`urutan` int NOT NULL DEFAULT 0,
	`aktif` boolean NOT NULL DEFAULT true,
	CONSTRAINT `topik_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `isi_topik` ADD CONSTRAINT `isi_topik_topik_id_topik_id_fk` FOREIGN KEY (`topik_id`) REFERENCES `topik`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `konteks_skenario` ADD CONSTRAINT `konteks_skenario_skenario_id_skenario_id_fk` FOREIGN KEY (`skenario_id`) REFERENCES `skenario`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `kuis` ADD CONSTRAINT `kuis_topik_id_topik_id_fk` FOREIGN KEY (`topik_id`) REFERENCES `topik`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `langkah_masalah` ADD CONSTRAINT `langkah_masalah_masalah_id_masalah_id_fk` FOREIGN KEY (`masalah_id`) REFERENCES `masalah`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `masalah` ADD CONSTRAINT `masalah_topik_id_topik_id_fk` FOREIGN KEY (`topik_id`) REFERENCES `topik`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `opsi_skenario` ADD CONSTRAINT `opsi_skenario_skenario_id_skenario_id_fk` FOREIGN KEY (`skenario_id`) REFERENCES `skenario`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `opsi_soal` ADD CONSTRAINT `opsi_soal_soal_id_soal_id_fk` FOREIGN KEY (`soal_id`) REFERENCES `soal`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `soal` ADD CONSTRAINT `soal_kuis_id_kuis_id_fk` FOREIGN KEY (`kuis_id`) REFERENCES `kuis`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `topik` ADD CONSTRAINT `topik_kategori_id_kategori_id_fk` FOREIGN KEY (`kategori_id`) REFERENCES `kategori`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_isi_topik` ON `isi_topik` (`topik_id`,`jenis`,`urutan`);--> statement-breakpoint
CREATE INDEX `idx_kuis_topik` ON `kuis` (`topik_id`);--> statement-breakpoint
CREATE INDEX `idx_soal_kuis` ON `soal` (`kuis_id`,`urutan`);--> statement-breakpoint
CREATE INDEX `idx_topik_kategori` ON `topik` (`kategori_id`);