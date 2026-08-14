CREATE TABLE `admin` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(120) NOT NULL,
	`pengguna` varchar(64) NOT NULL,
	`sandi` varchar(255) NOT NULL,
	`aktif` boolean NOT NULL DEFAULT true,
	`dibuat` varchar(32) NOT NULL,
	`terakhir_masuk` varchar(32),
	CONSTRAINT `admin_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_pengguna_unique` UNIQUE(`pengguna`)
);
