CREATE TABLE `penyelenggara_layanan` (
	`penyelenggara_id` varchar(64) NOT NULL,
	`layanan_id` varchar(64) NOT NULL,
	CONSTRAINT `penyelenggara_layanan_penyelenggara_id_layanan_id_pk` PRIMARY KEY(`penyelenggara_id`,`layanan_id`)
);
--> statement-breakpoint
ALTER TABLE `masalah` ADD `perlu_layanan` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `masalah` ADD `perlu_penyelenggara` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `penyelenggara_layanan` ADD CONSTRAINT `penyelenggara_layanan_penyelenggara_id_penyelenggara_id_fk` FOREIGN KEY (`penyelenggara_id`) REFERENCES `penyelenggara`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `penyelenggara_layanan` ADD CONSTRAINT `penyelenggara_layanan_layanan_id_layanan_id_fk` FOREIGN KEY (`layanan_id`) REFERENCES `layanan`(`id`) ON DELETE cascade ON UPDATE no action;