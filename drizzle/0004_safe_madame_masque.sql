CREATE TABLE `berita` (
	`id` varchar(96) NOT NULL,
	`judul` varchar(220) NOT NULL,
	`ringkas` varchar(300) NOT NULL,
	`gambar` varchar(255),
	`gambar_alt` varchar(255),
	`sumber` varchar(255) NOT NULL,
	`tanggal` varchar(10) NOT NULL,
	`aktif` boolean NOT NULL DEFAULT true,
	CONSTRAINT `berita_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `isi_berita` (
	`id` int AUTO_INCREMENT NOT NULL,
	`berita_id` varchar(96) NOT NULL,
	`jenis` enum('paragraf','poin','gambar') NOT NULL,
	`teks` text NOT NULL,
	`keterangan` varchar(255),
	`urutan` int NOT NULL DEFAULT 0,
	CONSTRAINT `isi_berita_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `isi_berita` ADD CONSTRAINT `isi_berita_berita_id_berita_id_fk` FOREIGN KEY (`berita_id`) REFERENCES `berita`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_berita_tanggal` ON `berita` (`tanggal`);--> statement-breakpoint
CREATE INDEX `idx_isi_berita` ON `isi_berita` (`berita_id`,`urutan`);