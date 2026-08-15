ALTER TABLE `isi_topik` MODIFY COLUMN `jenis` enum('paragraf','poin','gambar') NOT NULL;--> statement-breakpoint
ALTER TABLE `isi_topik` ADD `keterangan` varchar(255);--> statement-breakpoint
ALTER TABLE `skenario` ADD `gambar` varchar(255);--> statement-breakpoint
ALTER TABLE `skenario` ADD `gambar_alt` varchar(255);--> statement-breakpoint
ALTER TABLE `isi_topik` ADD INDEX `idx_isi_topik_baru` (`topik_id`,`urutan`);--> statement-breakpoint
DROP INDEX `idx_isi_topik` ON `isi_topik`;--> statement-breakpoint
ALTER TABLE `isi_topik` RENAME INDEX `idx_isi_topik_baru` TO `idx_isi_topik`;
