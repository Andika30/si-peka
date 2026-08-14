CREATE TABLE `feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jenis` varchar(32) NOT NULL,
	`komentar` text NOT NULL,
	`dibuat` varchar(32) NOT NULL,
	`dibaca` boolean NOT NULL DEFAULT false,
	CONSTRAINT `feedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `log_admin` (
	`id` int AUTO_INCREMENT NOT NULL,
	`admin_id` int,
	`nama_admin` varchar(120) NOT NULL,
	`aksi` enum('tambah','ubah','hapus','masuk') NOT NULL,
	`jenis` varchar(32) NOT NULL,
	`sasaran` varchar(255) NOT NULL,
	`waktu` varchar(32) NOT NULL,
	CONSTRAINT `log_admin_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `peristiwa` (
	`jenis` enum('kunjungan','materi_dibuka','kuis_selesai','simulasi_selesai','panduan_dibuka') NOT NULL,
	`rujukan` varchar(64) NOT NULL DEFAULT '',
	`tanggal` varchar(10) NOT NULL,
	`jumlah` int NOT NULL DEFAULT 0,
	CONSTRAINT `peristiwa_jenis_rujukan_tanggal_pk` PRIMARY KEY(`jenis`,`rujukan`,`tanggal`)
);
--> statement-breakpoint
CREATE TABLE `statistik_kuis` (
	`kuis_id` varchar(64) NOT NULL,
	`dikerjakan` int NOT NULL DEFAULT 0,
	`jumlah_skor` int NOT NULL DEFAULT 0,
	CONSTRAINT `statistik_kuis_kuis_id` PRIMARY KEY(`kuis_id`)
);
--> statement-breakpoint
CREATE TABLE `statistik_skenario` (
	`skenario_id` varchar(64) NOT NULL,
	`dicoba` int NOT NULL DEFAULT 0,
	`aman` int NOT NULL DEFAULT 0,
	CONSTRAINT `statistik_skenario_skenario_id` PRIMARY KEY(`skenario_id`)
);
--> statement-breakpoint
CREATE TABLE `statistik_soal` (
	`soal_id` int NOT NULL,
	`dijawab` int NOT NULL DEFAULT 0,
	`keliru` int NOT NULL DEFAULT 0,
	CONSTRAINT `statistik_soal_soal_id` PRIMARY KEY(`soal_id`)
);
--> statement-breakpoint
ALTER TABLE `statistik_kuis` ADD CONSTRAINT `statistik_kuis_kuis_id_kuis_id_fk` FOREIGN KEY (`kuis_id`) REFERENCES `kuis`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `statistik_skenario` ADD CONSTRAINT `statistik_skenario_skenario_id_skenario_id_fk` FOREIGN KEY (`skenario_id`) REFERENCES `skenario`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `statistik_soal` ADD CONSTRAINT `statistik_soal_soal_id_soal_id_fk` FOREIGN KEY (`soal_id`) REFERENCES `soal`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_feedback_dibuat` ON `feedback` (`dibuat`);--> statement-breakpoint
CREATE INDEX `idx_log_waktu` ON `log_admin` (`waktu`);--> statement-breakpoint
CREATE INDEX `idx_peristiwa_tanggal` ON `peristiwa` (`tanggal`);