CREATE TABLE `info_awal` (
	`id` varchar(64) NOT NULL,
	`judul` varchar(160) NOT NULL,
	`keterangan` varchar(500),
	`urutan` int NOT NULL DEFAULT 0,
	`aktif` boolean NOT NULL DEFAULT true,
	CONSTRAINT `info_awal_id` PRIMARY KEY(`id`)
);
