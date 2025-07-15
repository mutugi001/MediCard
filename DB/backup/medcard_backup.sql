DROP TABLE IF EXISTS `cache`;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES ('0197d064-14ca-73b3-ba5d-69dd2c194e77','Collins Mutugi','collinsmut04@gmail.com',NULL,'$2y$12$vZlk5rYflqogNviwXsZCEOxxDUTyv/G/TkZ/LcgDCFeBaBQosKto.',NULL,'2025-07-03 10:05:09','2025-07-03 10:05:09'),('0197ef33-70ee-71ad-9492-86e18517634a','Duncan vuluku','duncan@gmail.com',NULL,'$2y$12$xoCjQej4TDyN4zP60QGi5e3KNrt9j8i6nLMKPc1k8wuTItLKr6xUS',NULL,'2025-07-09 09:40:15','2025-07-09 09:40:15');
UNLOCK TABLES;

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `cache` WRITE;

UNLOCK TABLES;

DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `cache_locks` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `details`;
CREATE TABLE `details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dateOfBirth` datetime NOT NULL,
  `gender` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bloodType` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `allergies` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `medicalConditions` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `medications` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `emergencyContact` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `emergencyPhone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `insuranceProvider` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `insurancePolicyNumber` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phoneNumber` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `doctorName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doctorPhone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profilePhoto` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `details` WRITE;
INSERT INTO `details` VALUES (1,'0197d064-14ca-73b3-ba5d-69dd2c194e77','Collins','Mutugi','2004-03-31 00:00:00','Male','O+','None','None','None','shammah ounga','0797262818','AAR','406','0798718682','none','none','http://localhost:8000/profile_photos/1751552566_686692365779a.jpg','2025-07-03 11:22:46','2025-07-03 11:22:46'),(8,'0197ef33-70ee-71ad-9492-86e18517634a','Duncan','vuluku','2002-02-14 00:00:00','Male','O+','none','none','none','Collins Mutugi','0798718682','AAR','10005','0790598805','none','none','http://localhost:8000/profile_photos/1752066172_686e687c39e58.jpg','2025-07-09 10:02:52','2025-07-09 10:02:52'),(9,'0197ef33-70ee-71ad-9492-86e18517634a','Duncan','vuluku','2002-02-14 00:00:00','Male','O+','none','none','none','Collins Mutugi','0798718682','AAR','10005','0790598805','none','none','http://localhost:8000/profile_photos/1752066706_686e6a9252109.jpg','2025-07-09 10:11:46','2025-07-09 10:11:46'),(10,'0197d064-14ca-73b3-ba5d-69dd2c194e77','Collins','Mutugi','2025-07-09 00:00:00','Male','O+','none','none','none','Collins Mutugi','0798718682','AAR','406','0798718682','none','none','http://localhost:8000/profile_photos/1752066816_686e6b0027c0b.jpg','2025-07-09 10:13:36','2025-07-09 10:13:36'),(11,'0197d064-14ca-73b3-ba5d-69dd2c194e77','Collins','Mutugi','2025-07-09 00:00:00','Male','O+','none','none','none','Collins Mutugi','0798718682','AAR','406','0798718682','none','none','http://localhost:8000/profile_photos/1752066952_686e6b882cce4.jpg','2025-07-09 10:15:52','2025-07-09 10:15:52'),(12,'0197ef33-70ee-71ad-9492-86e18517634a','Duncan','vuluku','2025-07-02 00:00:00','Male','O+','none','none','none','Duncan vuluku','0790598805','AAR','406','0790598805','none','none','http://localhost:8000/profile_photos/1752067246_686e6cae624f0.jpg','2025-07-09 10:20:46','2025-07-09 10:20:46');
UNLOCK TABLES;


DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `failed_jobs` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `job_batches` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `jobs` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `migrations` WRITE;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_07_02_100143_create_details_table',1),(5,'2025_07_02_101447_create_personal_access_tokens_table',1),(6,'2025_07_09_090532_create_patient__faces_table',2);
UNLOCK TABLES;


DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `password_reset_tokens` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `patient_faces`;
CREATE TABLE `patient_faces` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `encoding` blob NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

LOCK TABLES `patient_faces` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `personal_access_tokens` WRITE;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User','0197d064-14ca-73b3-ba5d-69dd2c194e77','Collins Mutugi','80c942b69391d43454c462a51c1ea56beff632f64cfbb990222158c02c066a78','[\"*\"]',NULL,NULL,'2025-07-03 10:05:09','2025-07-03 10:05:09'),(2,'App\\Models\\User','0197d064-14ca-73b3-ba5d-69dd2c194e77','collinsmut04@gmail.com','0e3ba2ae78325ca62f447b6d9a1a10cb160c17a8212d37dd64d6b8cb0dfade09','[\"*\"]','2025-07-03 14:00:16',NULL,'2025-07-03 10:05:12','2025-07-03 14:00:16'),(6,'App\\Models\\User','0197ef33-70ee-71ad-9492-86e18517634a','Duncan vuluku','1f27b4cff17a9eb246b7ffa0703332332733d4fb06bf0eed6954d14d6f10f8d4','[\"*\"]',NULL,NULL,'2025-07-09 09:40:15','2025-07-09 09:40:15');
UNLOCK TABLES;


DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `sessions` WRITE;
INSERT INTO `sessions` VALUES ('XsxC8gDNLeFEMU1FNtLvoZ3yE6ao1le0kvohw3ln','0197ef33-70ee-71ad-9492-86e18517634a','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiR3JrMUIxN0o0T2ZFWE5wdmFuZ0g5TGRmQlhBYVRRUFp3dE1wNEdQUiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZGV0YWlscy9pbmRleCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1752068291);
UNLOCK TABLES;


