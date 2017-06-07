# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.17)
# Database: youbreaking
# Generation Time: 2017-06-05 09:46:26 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table aggiuntivi
# ------------------------------------------------------------

DROP TABLE IF EXISTS `aggiuntivi`;

CREATE TABLE `aggiuntivi` (
  `id` char(36) NOT NULL,
  `notizia_id` char(36) DEFAULT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `valore` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `aggiuntivi_notizia_id_foreign` (`notizia_id`),
  CONSTRAINT `aggiuntivi_ibfk_1` FOREIGN KEY (`notizia_id`) REFERENCES `notizie` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `aggiuntivi` WRITE;
/*!40000 ALTER TABLE `aggiuntivi` DISABLE KEYS */;

INSERT INTO `aggiuntivi` (`id`, `notizia_id`, `tipo`, `valore`, `created_at`, `updated_at`)
VALUES
	('10f294cb-a4a0-4aca-a992-ad1221f4c0d4','cb58d0a9-ed16-4997-8812-767817c87ecd','FEATURED_PHOTO','10f294cb-a4a0-4aca-a992-ad1221f4c0d4.jpeg','2017-04-24 18:22:16','2017-04-24 18:22:16'),
	('12241e5c-a335-4c29-915d-c3c1ad5e8275','ecf84c60-78c0-4666-ad62-95bd789ec35b','LOCATION_LONGITUDE','15.2879163','2017-03-17 15:12:06','2017-03-17 15:12:06'),
	('34c89ba5-1ca7-4dc9-aa37-7f49e383e4ab','e7c3b955-9f83-40c7-97dd-bd119b71d915','LOCATION_NAME','Indian Wells Tennis Garden','2017-03-20 10:16:04','2017-03-20 10:16:04'),
	('45b0a07c-dd8b-4728-92a7-da70f62db1d9','e7c3b955-9f83-40c7-97dd-bd119b71d915','LOCATION_LATITUDE','33.7238221047404','2017-03-20 10:16:04','2017-03-20 10:16:04'),
	('46e74a3e-b764-4476-8804-48338bb1f181','c9484ee8-4638-4a50-9b94-cf76213446dd','PHOTO','46e74a3e-b764-4476-8804-48338bb1f181.jpeg','2017-03-13 22:26:54','2017-03-13 22:26:54'),
	('624dba04-5a5b-45b3-b94e-d9ec39fec2d1','e7c3b955-9f83-40c7-97dd-bd119b71d915','LOCATION_COUNTRY','United States','2017-03-20 10:16:04','2017-03-20 10:16:04'),
	('66442417-79f2-4052-8571-8ad2adf33e89','c3cfd90f-b766-4d0f-bc60-5fcc8f7fc86c','LOCATION_LONGITUDE','15.5557335050581','2017-03-13 18:48:42','2017-03-13 18:48:42'),
	('6af78dfd-c41b-48ef-b210-8e13af5d36b5','e7c3b955-9f83-40c7-97dd-bd119b71d915','LOCATION_LONGITUDE','-116.305882930756','2017-03-20 10:16:04','2017-03-20 10:16:04'),
	('6b423f04-d580-4063-a7dc-9a84fe7fa8d8','ecf84c60-78c0-4666-ad62-95bd789ec35b','LOCATION_COUNTRY','Italy','2017-03-17 15:12:06','2017-03-17 15:12:06'),
	('7d16cec4-f490-4c2f-8032-cb790da81c75','e7c3b955-9f83-40c7-97dd-bd119b71d915','PHOTO','7d16cec4-f490-4c2f-8032-cb790da81c75.jpeg','2017-03-20 10:16:04','2017-03-20 10:16:04'),
	('7e942444-a92f-4b06-b98e-aa2299afaec2','ecf84c60-78c0-4666-ad62-95bd789ec35b','LOCATION_NAME','Taormina','2017-03-17 15:12:06','2017-03-17 15:12:06'),
	('80c6e3a6-aa44-4ecf-b860-d622d70f352e','47fc43c4-b8e3-4aba-b090-c8aa6607a11a','PHOTO','80c6e3a6-aa44-4ecf-b860-d622d70f352e.jpeg','2017-03-13 20:39:09','2017-03-13 20:39:09'),
	('891adce8-dbbd-4a64-a415-e589934ecf6c','c3cfd90f-b766-4d0f-bc60-5fcc8f7fc86c','LOCATION_LATITUDE','38.1938924299636','2017-03-13 18:48:42','2017-03-13 18:48:42'),
	('b65981f7-068f-4efd-ad87-68c392343ea0','c3cfd90f-b766-4d0f-bc60-5fcc8f7fc86c','LOCATION_COUNTRY','Italia','2017-03-13 18:48:42','2017-03-13 18:48:42'),
	('c1dede21-d438-4375-8250-9878b97ac922','ecf84c60-78c0-4666-ad62-95bd789ec35b','LOCATION_LATITUDE','37.8530665','2017-03-17 15:12:06','2017-03-17 15:12:06'),
	('c2e497a9-2435-48f0-8b70-4ff04790b5bc','e5d8f60a-0ef0-4300-b5b4-7ca5262a9e41','PHOTO','c2e497a9-2435-48f0-8b70-4ff04790b5bc.jpeg','2017-03-14 12:24:05','2017-03-14 12:24:05'),
	('cb57b1c7-2078-4c13-9a32-22983e65818a','c3cfd90f-b766-4d0f-bc60-5fcc8f7fc86c','PHOTO','9095fbd6-e865-4614-94b3-ca171127b443.jpeg','2017-03-13 18:48:42','2017-03-13 18:48:42'),
	('cb57b1c7-2078-4c13-9a32-22983e65818e','c3cfd90f-b766-4d0f-bc60-5fcc8f7fc86c','LOCATION_LOCALITY','Messina','2017-03-13 18:48:42','2017-03-13 18:48:42'),
	('d8c2a5a8-934d-424d-a98d-e8e5656becce','ecf84c60-78c0-4666-ad62-95bd789ec35b','PHOTO','d8c2a5a8-934d-424d-a98d-e8e5656becce.jpeg','2017-03-17 15:12:06','2017-03-17 15:12:06'),
	('d9e19709-6854-44d8-b488-4b23a0a92a53','ecf84c60-78c0-4666-ad62-95bd789ec35b','LOCATION_LOCALITY','Taormina','2017-03-17 15:12:06','2017-03-17 15:12:06'),
	('fc9f7cae-c7ce-48d4-8895-fae90a8f4399','e7c3b955-9f83-40c7-97dd-bd119b71d915','LOCATION_LOCALITY','Indian Wells','2017-03-20 10:16:04','2017-03-20 10:16:04'),
	('fca42163-a131-4b51-8184-be14c1f86d72','c3cfd90f-b766-4d0f-bc60-5fcc8f7fc86c','LOCATION_NAME','Comune di Messina','2017-03-13 18:48:42','2017-03-13 18:48:42');

/*!40000 ALTER TABLE `aggiuntivi` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table events
# ------------------------------------------------------------

DROP TABLE IF EXISTS `events`;

CREATE TABLE `events` (
  `id` char(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;

INSERT INTO `events` (`id`, `name`, `created_at`, `updated_at`)
VALUES
	('027dce33-7b39-4706-9a1a-e9d77d62d345','Tennis','2017-03-20 10:15:43','2017-03-20 10:15:43'),
	('0b9407af-718b-481f-b2cb-e476a0ee80e0','Taormina Film Festival','2017-03-17 14:52:21','2017-03-17 14:52:21'),
	('7853fb8e-8b27-4d7a-9329-010c101d69ee','andromeda','2017-04-11 17:52:30','2017-04-11 17:52:30'),
	('f81c0be6-31f6-42d2-90b6-3bbfadcde877','Referendum CGIL','2017-03-14 14:58:07','2017-03-14 14:58:07');

/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table knex_migrations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `knex_migrations`;

CREATE TABLE `knex_migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table knex_migrations_lock
# ------------------------------------------------------------

DROP TABLE IF EXISTS `knex_migrations_lock`;

CREATE TABLE `knex_migrations_lock` (
  `is_locked` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `knex_migrations_lock` WRITE;
/*!40000 ALTER TABLE `knex_migrations_lock` DISABLE KEYS */;

INSERT INTO `knex_migrations_lock` (`is_locked`)
VALUES
	(0);

/*!40000 ALTER TABLE `knex_migrations_lock` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table likes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `likes`;

CREATE TABLE `likes` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `notizia_id` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `voti_user_id_notizia_id_unique` (`user_id`,`notizia_id`),
  KEY `voti_notizia_id_foreign` (`notizia_id`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`notizia_id`) REFERENCES `notizie` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;

INSERT INTO `likes` (`id`, `user_id`, `notizia_id`, `created_at`, `updated_at`)
VALUES
	('0591a51a-a845-4f97-a2ea-db07770133c3','3d14bd33-df5e-4239-b3e8-4b1e3854705c','cb58d0a9-ed16-4997-8812-767817c87ecd','2017-04-06 16:33:34','2017-04-06 16:33:34'),
	('0ff60fd3-94be-4819-ae11-cf8285d78fa8','8727a7fb-94bf-40f8-a663-0be877356e4a','c9484ee8-4638-4a50-9b94-cf76213446dd','2017-03-17 00:21:41','2017-03-17 00:21:41'),
	('10039e69-ccac-442b-9dd4-68df3c1cf63e','6dc9dfde-0d06-48b9-a10d-9c707553e988','b5f48056-c5e3-40e2-aac3-1396caa229f4','2017-03-14 21:20:09','2017-03-14 21:20:09'),
	('19254e71-8864-45ca-b6b4-52957f62b7bc','3d14bd33-df5e-4239-b3e8-4b1e3854705c','55ea1b61-5bc2-4904-b820-ed3e0e524cab','2017-04-06 16:32:33','2017-04-06 16:32:33'),
	('241762fc-8b0d-41a4-941b-e34ea4a42b31','7bfcd7f5-7cb9-4a7f-9510-5405dc511c8f','ecf84c60-78c0-4666-ad62-95bd789ec35b','2017-03-17 18:49:25','2017-03-17 18:49:25'),
	('270687b6-9ac9-408b-8473-42ceb3ca9f26','3d14bd33-df5e-4239-b3e8-4b1e3854705c','e7c3b955-9f83-40c7-97dd-bd119b71d915','2017-04-06 20:29:17','2017-04-06 20:29:17'),
	('2d364f99-e80c-4c04-a8cd-f9ddbf9b8685','e765b5d5-0e50-4791-a826-9ec80f16b1a7','55ea1b61-5bc2-4904-b820-ed3e0e524cab','2017-03-13 20:45:50','2017-03-13 20:45:50'),
	('9b2917d8-6bb7-447b-82a3-904b6b9e29f2','3d14bd33-df5e-4239-b3e8-4b1e3854705c','ecf84c60-78c0-4666-ad62-95bd789ec35b','2017-04-06 16:35:16','2017-04-06 16:35:16'),
	('d81601b9-abcf-4d16-85ab-fd1270e8d995','3d14bd33-df5e-4239-b3e8-4b1e3854705c','c9484ee8-4638-4a50-9b94-cf76213446dd','2017-03-15 21:38:19','2017-03-15 21:38:19'),
	('dde36c36-ba75-43fe-b92e-45c5db97f470','de2a08d6-9824-45b5-9049-236547779183','b6044071-a25f-4525-8a6f-f5ce04a453c4','2017-03-14 18:38:13','2017-03-14 18:38:13'),
	('e7155adb-aba5-491d-bc80-1594a8a83067','3d14bd33-df5e-4239-b3e8-4b1e3854705c','c3cfd90f-b766-4d0f-bc60-5fcc8f7fc86c','2017-03-15 10:21:24','2017-03-15 10:21:24'),
	('e89398e8-0647-4ac9-8c83-897f2680c285','7bfcd7f5-7cb9-4a7f-9510-5405dc511c8f','b6044071-a25f-4525-8a6f-f5ce04a453c4','2017-03-14 21:20:04','2017-03-14 21:20:04'),
	('ea383c9e-c614-4e66-be24-41abcfde2783','8727a7fb-94bf-40f8-a663-0be877356e4a','b5f48056-c5e3-40e2-aac3-1396caa229f4','2017-03-17 00:21:22','2017-03-17 00:21:22'),
	('ea634946-dd57-4eaa-a4b7-66ef99b97326','3d14bd33-df5e-4239-b3e8-4b1e3854705c','b5f48056-c5e3-40e2-aac3-1396caa229f4','2017-04-06 16:34:19','2017-04-06 16:34:19'),
	('ea81fc55-c802-4570-bf30-0501b2035d8a','de2a08d6-9824-45b5-9049-236547779183','e5d8f60a-0ef0-4300-b5b4-7ca5262a9e41','2017-03-14 12:48:30','2017-03-14 12:48:30'),
	('ec2d1803-673e-4ae1-ad90-c8c238b51c90','7bfcd7f5-7cb9-4a7f-9510-5405dc511c8f','c3cfd90f-b766-4d0f-bc60-5fcc8f7fc86c','2017-03-13 20:30:05','2017-03-13 20:30:05'),
	('f676acc2-9065-4587-bc8e-387ddcf98f4b','3d14bd33-df5e-4239-b3e8-4b1e3854705c','65768fc5-de33-49b2-94fc-0a84fcab792f','2017-04-05 18:32:42','2017-04-05 18:32:42'),
	('fa8aa030-86fd-4817-b781-c2a144da39ac','8727a7fb-94bf-40f8-a663-0be877356e4a','d1241879-9ef1-4116-b6f2-4c7593ebbaca','2017-03-13 20:07:43','2017-03-13 20:07:43'),
	('fe44b59f-b026-4f09-b809-21e992a9d3c8','8727a7fb-94bf-40f8-a663-0be877356e4a','e5d8f60a-0ef0-4300-b5b4-7ca5262a9e41','2017-03-17 00:21:37','2017-03-17 00:21:37'),
	('ff43436b-35c1-44d8-8b53-bf6f8d981bb6','83eb596d-9b07-48c0-80e0-ae654ddfe0b8','47fc43c4-b8e3-4aba-b090-c8aa6607a11a','2017-03-13 22:11:11','2017-03-13 22:11:11');

/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table locations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `locations`;

CREATE TABLE `locations` (
  `id` char(36) NOT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `latitude` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `user_id` char(36) DEFAULT NULL,
  `distance` int(11) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `type` enum('None','Place','Gps') DEFAULT NULL,
  `place_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `locations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table notificationTokens
# ------------------------------------------------------------

DROP TABLE IF EXISTS `notificationTokens`;

CREATE TABLE `notificationTokens` (
  `id` char(36) NOT NULL,
  `token` varchar(64) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `user_id` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `notificationtokens_user_id_foreign` (`user_id`),
  CONSTRAINT `notificationTokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `notificationTokens` WRITE;
/*!40000 ALTER TABLE `notificationTokens` DISABLE KEYS */;

INSERT INTO `notificationTokens` (`id`, `token`, `created_at`, `updated_at`, `user_id`)
VALUES
	('2528f97e-be1a-4f30-adeb-265d4ce19cd6','06C78AF40828684F251508CAFAC0E569AB6FA07228195A7CAFD64FE200B4B950','2017-06-04 17:44:23','2017-06-04 17:44:23','3d14bd33-df5e-4239-b3e8-4b1e3854705c');

/*!40000 ALTER TABLE `notificationTokens` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table notizie
# ------------------------------------------------------------

DROP TABLE IF EXISTS `notizie`;

CREATE TABLE `notizie` (
  `id` char(36) NOT NULL,
  `title` varchar(1000) DEFAULT NULL,
  `text` longtext,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `user_id` char(36) DEFAULT NULL,
  `event_id` char(36) DEFAULT NULL,
  `live` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `notizie_user_id_foreign` (`user_id`),
  KEY `notizie_event_id_foreign` (`event_id`),
  CONSTRAINT `notizie_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `notizie_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `notizie` WRITE;
/*!40000 ALTER TABLE `notizie` DISABLE KEYS */;

INSERT INTO `notizie` (`id`, `title`, `text`, `created_at`, `updated_at`, `user_id`, `event_id`, `live`)
VALUES
	('3072cf5c-f855-4adc-a40e-1d5e8f88646c','La Turchia sospende le relazioni diplomatiche con l\'Olanda','','2017-03-13 22:12:08','2017-03-13 22:12:08','3d14bd33-df5e-4239-b3e8-4b1e3854705c',NULL,1),
	('47fc43c4-b8e3-4aba-b090-c8aa6607a11a','Inter-Atalanta 7-1','Importante vittoria per gli uomini di Pioli, che battono l\'Atalanta per 7-1 e la superano in classifica. Sugli scudi gli argentini Icardi e Banega, entrambi autori di una tripletta, in gol anche l\'ex Roberto Gagliardini, rete della bandiera degli orobici siglata da Freuler.','2017-03-13 20:39:09','2017-03-13 20:39:09','7bfcd7f5-7cb9-4a7f-9510-5405dc511c8f',NULL,1),
	('55ea1b61-5bc2-4904-b820-ed3e0e524cab','Ritrovata una statua monumentale nelle acque fangose della periferia del Cairo ','Un gruppo di archeologi egiziani e tedeschi, durante degli studi nella località di al Matariyya, nome moderno di Eliopoli, ha ritrovato parte di una monumentale di una statua di pietra, precisamente il busto, parti del volto e di una corona, quasi totalmente sommersa nel fango. Dopo averla portata alla luce, hanno dichiarato che essa potrebbe raffigurare il Faraone Ramses II, che regnò in Egitto 3.000 anni fa. Essa è stata trasportata in data odierna, 13 marzo 2017, in un museo della città per ulteriori indagini. Se l\'attribuzione sarà confermata, i frammenti saranno esposti all\'ingresso del Grand Egyptian Museum, che dovrebbe aprire a Giza nel 2018. ','2017-03-13 20:39:33','2017-03-13 20:45:51','6dc9dfde-0d06-48b9-a10d-9c707553e988',NULL,1),
	('65768fc5-de33-49b2-94fc-0a84fcab792f','Il candidato alla presidenza francese Fillon è indagato','','2017-03-14 16:43:06','2017-03-14 16:43:06','3d14bd33-df5e-4239-b3e8-4b1e3854705c',NULL,1),
	('7c0420fc-ef29-479d-b389-91b6622f443a','Il Consiglio dei Ministri ha ufficializzato la data del Referendum: si terrà il 28 Maggio','','2017-03-14 14:58:16','2017-03-14 14:58:16','3d14bd33-df5e-4239-b3e8-4b1e3854705c','f81c0be6-31f6-42d2-90b6-3bbfadcde877',1),
	('804ac576-5c40-4688-b2a9-ec49b06f7f80','jvtvb','','2017-06-02 17:12:12','2017-06-02 17:12:12','3d14bd33-df5e-4239-b3e8-4b1e3854705c',NULL,1),
	('b5f48056-c5e3-40e2-aac3-1396caa229f4','ArancinO anti-age ','L\'ultima novità presentata a Taormina dallo chef stellato del ristorante Marina di Nettuno Yatching Club di Messina Pasquale Caliri. L\'arancino di riso nero e rosso fermentato, semi di sesamo e di zucca, un ragout di verdure depurative ed una panatura di pistacchio prima di essere cotto al forno. Un concentrato di vitamine ed antiossidanti \'perché se il buono è bello, deve fare anche bene\'. Ma davvero l\'arancino anti-age riuscirà a superare la bontà del vero arancino messinese? \n','2017-03-14 12:39:34','2017-03-14 12:40:54','de2a08d6-9824-45b5-9049-236547779183',NULL,1),
	('b6044071-a25f-4525-8a6f-f5ce04a453c4','Il Seguenza all\'ONU','Il Liceo Seguenza parteciperà per la prima volta dal 16 al 23 Marzo al progetto internazionale CWMUN (Change the World Model United Nations) che prevede la partecipazione di un gruppo di alunni, guidati da una docente di lingua inglese della scuola, alla simulazione mondiale di una seduta dell’ONU al Palazzo di Vetro delle Nazioni Unite a New York.\n\nIl Liceo Seguenza parteciperà per la prima volta dal 16 al 23 Marzo al progetto internazionale CWMUN (Change the World Model United Nations) che prevede la partecipazione di un gruppo di alunni, guidati da una docente di lingua inglese della scuola, alla simulazione mondiale di una seduta dell’ONU al Palazzo di Vetro delle Nazioni Unite a New York.\n\nIl Liceo Seguenza parteciperà per la prima volta dal 16 al 23 Marzo al progetto internazionale CWMUN (Change the World Model United Nations) che prevede la partecipazione di un gruppo di alunni, guidati da una docente di lingua inglese della scuola, alla simulazione mondiale di una seduta dell’ONU al Palazzo di Vetro delle Nazioni Unite a New York.','2017-03-14 18:37:54','2017-03-14 18:38:14','de2a08d6-9824-45b5-9049-236547779183',NULL,1),
	('c3cfd90f-b766-4d0f-bc60-5fcc8f7fc86c','Federico Alagna nominato Assessore alla cultura di Messina','Federico Alagna è stato nominato dal Sindaco Renato Accorinti nuovo assessore alla cultura del Comune di Messina.\n\nSubentra a Daniela Ursino, dimissionaria per divergenza di vedute con il resto della giunta','2017-03-13 18:48:42','2017-03-13 18:48:42','3d14bd33-df5e-4239-b3e8-4b1e3854705c',NULL,1),
	('c9484ee8-4638-4a50-9b94-cf76213446dd','Italia prima per influenza culturale','La rivista US News ha stilato la classifica del 2017 dei Paesi più influenti culturalmente: l\'Italia strappa il primo posto alla Francia, relegata al secondo. \"Dalle opere di Leonardo da Vinci alla moda, l\'influenza culturale dell\'Italia è sempre stata profonda\" afferma la rivista. Terzi classificati vediamo gli Stati Uniti, unico paese nella top 5 a non essere Europeo. Seguono Spagna e Regno Unito.\nAncora una volta ci confermiamo leader indiscussi della cultura grazie all\'immenso patrimonio della nostra nazione, seppur poco sfruttato e valorizzato.\nMa almeno per quest\'anno, cari amici francesi, la Gioconda potete proprio tenervela. ','2017-03-13 22:26:54','2017-03-13 22:26:54','83eb596d-9b07-48c0-80e0-ae654ddfe0b8',NULL,1),
	('cb58d0a9-ed16-4997-8812-767817c87ecd','miao','','2017-04-24 18:22:16','2017-04-24 18:22:16','3d14bd33-df5e-4239-b3e8-4b1e3854705c',NULL,1),
	('d1241879-9ef1-4116-b6f2-4c7593ebbaca','Taxi: Nuovo sciopero nazionale il 23 Marzo','','2017-03-13 18:21:27','2017-03-13 18:21:27','3d14bd33-df5e-4239-b3e8-4b1e3854705c',NULL,1),
	('e5d8f60a-0ef0-4300-b5b4-7ca5262a9e41','Fuga Di Cervelli','È sempre più presente il fenomeno \'emigratis\'. Sabina Berretta, catanese, dopo la laurea provò a entrare in università come custode. Ma non fu assunta. Poi, a 29 anni, vinse una borsa per il Mit di Boston. E non è più tornata indietro. Ora è la scienziata italiana che dirige l\'Harvard Brain tissue resource center del McLean Hospital di Boston, la più grande banca dei cervelli del mondo. ','2017-03-14 12:24:05','2017-03-17 16:14:14','de2a08d6-9824-45b5-9049-236547779183',NULL,1),
	('e7c3b955-9f83-40c7-97dd-bd119b71d915','Roger Federer ha vinto il master di Indian Wells','Stanotte Roger Federer è diventato il più anziano vincitore del primo master 1000 di stagione.\n\nDopo la vittoria agli Australian Open lo svizzero continua a stupire con una prestazione brillante e continua.\n\nIl risultato finale è stato di 6-4,7-5.\n\nStanotte Roger Federer è diventato il più anziano vincitore del primo master 1000 di stagione.\n\nDopo la vittoria agli Australian Open lo svizzero continua a stupire con una prestazione brillante e continua.\n\nIl risultato finale è stato di 6-4,7-5.\n\nStanotte Roger Federer è diventato il più anziano vincitore del primo master 1000 di stagione.\n\nDopo la vittoria agli Australian Open lo svizzero continua a stupire con una prestazione brillante e continua.\n\nIl risultato finale è stato di 6-4,7-5.\n\nStanotte Roger Federer è diventato il più anziano vincitore del primo master 1000 di stagione.\n\nDopo la vittoria agli Australian Open lo svizzero continua a stupire con una prestazione brillante e continua.\n\nIl risultato finale è stato di 6-4,7-5.\n\nStanotte Roger Federer è diventato il più anziano vincitore del primo master 1000 di stagione.\n\nDopo la vittoria agli Australian Open lo svizzero continua a stupire con una prestazione brillante e continua.\n\nIl risultato finale è stato di 6-4,7-5.','2017-03-30 17:32:04','2017-03-20 10:16:04','3d14bd33-df5e-4239-b3e8-4b1e3854705c','027dce33-7b39-4706-9a1a-e9d77d62d345',1),
	('ecf84c60-78c0-4666-ad62-95bd789ec35b','Direttore artistico abbandona l\'incarico: Festival di Taormina a rischio','Felice Laudadio ha rinunciato oggi all\'incarico di direttore artistico della prossima edizione della kermesse taorminese.\n\nLe cause, a suo dire, sono le singolari circostanze verificatesi nelle prossime settimane e lo stato di incertezza che avvolge il festival.','2017-03-17 15:12:06','2017-03-17 15:12:06','3d14bd33-df5e-4239-b3e8-4b1e3854705c','0b9407af-718b-481f-b2cb-e476a0ee80e0',1);

/*!40000 ALTER TABLE `notizie` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tokens
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tokens`;

CREATE TABLE `tokens` (
  `id` char(36) NOT NULL DEFAULT '',
  `token` longtext NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `exp` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `token_users` (`user_id`),
  CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tokens` WRITE;
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;

INSERT INTO `tokens` (`id`, `token`, `user_id`, `exp`, `created_at`, `updated_at`)
VALUES
	('6f6ce059-279d-4cc6-ab75-9799609a4986','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYWNlYm9vayI6IjEwMjA5OTAwNzI2Nzg2NTMwIiwiaWQiOiIzZDE0YmQzMy1kZjVlLTQyMzktYjNlOC00YjFlMzg1NDcwNWMiLCJuYW1lIjoiR2lvcmdpbyBSb21hbm8iLCJlbWFpbCI6Im1lQGdpb3JnaW9yb21hbm8uaXQiLCJsZXZlbCI6IkFETUlOIiwicGljdHVyZSI6Imh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLzEwMjA5OTAwNzI2Nzg2NTMwL3BpY3R1cmU_dHlwZT1sYXJnZSIsImNyZWF0ZWRfYXQiOiIyMDE3LTAyLTE0VDA5OjU1OjAxLjAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAxNy0wNi0wMlQxNToxMjoxOS42NDJaIiwiZ3JhdmF0YXIiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvOTY1NDk2MGUyZmQzM2M1MGMwMzNhMTcwN2I3M2U5MTA_cz0yMDAmZD1yZXRybyIsInRva2VucyI6W10sIm5vdGlmaWNhdGlvblRva2VucyI6W10sIm5vdGl6aWUiOltdLCJsaWtlcyI6W10sImxvY2F0aW9uIjp7fSwiaWF0IjoxNDk2NDE2MzM5fQ.E7ywufpmLr9BvUUUzH3a1F-UfkSPeTZGeBQH4R6NZcI','3d14bd33-df5e-4239-b3e8-4b1e3854705c','2017-06-30 15:12:19','2017-06-02 17:12:20','2017-06-02 17:12:20'),
	('976aa81c-71a6-4e90-8b9f-beb6afa397d1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYWNlYm9vayI6IjEwMjA5OTAwNzI2Nzg2NTMwIiwiaWQiOiIzZDE0YmQzMy1kZjVlLTQyMzktYjNlOC00YjFlMzg1NDcwNWMiLCJuYW1lIjoiR2lvcmdpbyBSb21hbm8iLCJlbWFpbCI6Im1lQGdpb3JnaW9yb21hbm8uaXQiLCJsZXZlbCI6IkFETUlOIiwicGljdHVyZSI6Imh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLzEwMjA5OTAwNzI2Nzg2NTMwL3BpY3R1cmU_dHlwZT1sYXJnZSIsImNyZWF0ZWRfYXQiOiIyMDE3LTAyLTE0VDA5OjU1OjAxLjAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAxNy0wNi0wMlQxNDo1ODo0MC43NDVaIiwiZ3JhdmF0YXIiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvOTY1NDk2MGUyZmQzM2M1MGMwMzNhMTcwN2I3M2U5MTA_cz0yMDAmZD1yZXRybyIsInRva2VucyI6W10sIm5vdGlmaWNhdGlvblRva2VucyI6W10sIm5vdGl6aWUiOltdLCJsaWtlcyI6W10sImxvY2F0aW9uIjp7fSwiaWF0IjoxNDk2NDE1NTIwfQ.kxKEhTABLj5tvDkJBIpAhG6CzbVhTV0enlNaC9KDW-w','3d14bd33-df5e-4239-b3e8-4b1e3854705c','2017-06-30 14:58:40','2017-06-02 16:58:41','2017-06-02 16:58:41'),
	('af2a5fb8-fd0b-434f-94f3-ed29b64d08dc','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYWNlYm9vayI6IjEwMjA5OTAwNzI2Nzg2NTMwIiwiaWQiOiIzZDE0YmQzMy1kZjVlLTQyMzktYjNlOC00YjFlMzg1NDcwNWMiLCJuYW1lIjoiR2lvcmdpbyBSb21hbm8iLCJlbWFpbCI6Im1lQGdpb3JnaW9yb21hbm8uaXQiLCJsZXZlbCI6IkFETUlOIiwicGljdHVyZSI6Imh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLzEwMjA5OTAwNzI2Nzg2NTMwL3BpY3R1cmU_dHlwZT1sYXJnZSIsImNyZWF0ZWRfYXQiOiIyMDE3LTAyLTE0VDA5OjU1OjAxLjAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAxNy0wNi0wMlQxOToxMjoyMy4wMzlaIiwiZ3JhdmF0YXIiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvOTY1NDk2MGUyZmQzM2M1MGMwMzNhMTcwN2I3M2U5MTA_cz0yMDAmZD1yZXRybyIsInRva2VucyI6W10sIm5vdGlmaWNhdGlvblRva2VucyI6W10sIm5vdGl6aWUiOltdLCJsaWtlcyI6W10sImxvY2F0aW9uIjp7fSwiaWF0IjoxNDk2NDMwNzQzfQ.IrVA2T8Btfjgcg0Gy9N9T1q-MAdZruWgpOI9zvtWdCM','3d14bd33-df5e-4239-b3e8-4b1e3854705c','2017-06-30 19:12:23','2017-06-02 21:12:23','2017-06-02 21:12:23'),
	('c36af2e8-8166-419b-877b-efaa650a6974','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYWNlYm9vayI6IjEwMjA5OTAwNzI2Nzg2NTMwIiwiaWQiOiIzZDE0YmQzMy1kZjVlLTQyMzktYjNlOC00YjFlMzg1NDcwNWMiLCJuYW1lIjoiR2lvcmdpbyBSb21hbm8iLCJlbWFpbCI6Im1lQGdpb3JnaW9yb21hbm8uaXQiLCJsZXZlbCI6IkFETUlOIiwicGljdHVyZSI6Imh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLzEwMjA5OTAwNzI2Nzg2NTMwL3BpY3R1cmU_dHlwZT1sYXJnZSIsImNyZWF0ZWRfYXQiOiIyMDE3LTAyLTE0VDA5OjU1OjAxLjAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAxNy0wNi0wMlQxOToxNDowNy42NTJaIiwiZ3JhdmF0YXIiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvOTY1NDk2MGUyZmQzM2M1MGMwMzNhMTcwN2I3M2U5MTA_cz0yMDAmZD1yZXRybyIsInRva2VucyI6W10sIm5vdGlmaWNhdGlvblRva2VucyI6W10sIm5vdGl6aWUiOltdLCJsaWtlcyI6W10sImxvY2F0aW9uIjp7fSwiaWF0IjoxNDk2NDMwODQ3fQ.4Ss5qeGfzzm-PT3F2ZQ2fVJJ-HX0PeOoj5TbMXlZRWg','3d14bd33-df5e-4239-b3e8-4b1e3854705c','2017-06-30 19:14:07','2017-06-02 21:14:08','2017-06-02 21:14:08'),
	('c7ce5bc9-af39-478b-954d-a747fff50777','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYWNlYm9vayI6IjEwMjA5OTAwNzI2Nzg2NTMwIiwiaWQiOiIzZDE0YmQzMy1kZjVlLTQyMzktYjNlOC00YjFlMzg1NDcwNWMiLCJuYW1lIjoiR2lvcmdpbyBSb21hbm8iLCJlbWFpbCI6Im1lQGdpb3JnaW9yb21hbm8uaXQiLCJsZXZlbCI6IkFETUlOIiwicGljdHVyZSI6Imh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLzEwMjA5OTAwNzI2Nzg2NTMwL3BpY3R1cmU_dHlwZT1sYXJnZSIsImNyZWF0ZWRfYXQiOiIyMDE3LTAyLTE0VDA5OjU1OjAxLjAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAxNy0wNi0wNFQxNTo0NDoyMy44MjBaIiwiZ3JhdmF0YXIiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvOTY1NDk2MGUyZmQzM2M1MGMwMzNhMTcwN2I3M2U5MTA_cz0yMDAmZD1yZXRybyIsInRva2VucyI6W10sIm5vdGlmaWNhdGlvblRva2VucyI6W10sIm5vdGl6aWUiOltdLCJsaWtlcyI6W10sImxvY2F0aW9uIjp7fSwiaWF0IjoxNDk2NTkxMDYzfQ.NDvu63ULPHBn54CO3r1EX4XcIkau8HMBlcfyM93g868','3d14bd33-df5e-4239-b3e8-4b1e3854705c','2017-07-02 15:44:23','2017-06-04 17:44:24','2017-06-04 17:44:24'),
	('d28b0a68-45f8-4cc3-95cb-e82bef050d60','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYWNlYm9vayI6IjEwMjA5OTAwNzI2Nzg2NTMwIiwiaWQiOiIzZDE0YmQzMy1kZjVlLTQyMzktYjNlOC00YjFlMzg1NDcwNWMiLCJuYW1lIjoiR2lvcmdpbyBSb21hbm8iLCJlbWFpbCI6Im1lQGdpb3JnaW9yb21hbm8uaXQiLCJsZXZlbCI6IkFETUlOIiwicGljdHVyZSI6Imh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLzEwMjA5OTAwNzI2Nzg2NTMwL3BpY3R1cmU_dHlwZT1sYXJnZSIsImNyZWF0ZWRfYXQiOiIyMDE3LTAyLTE0VDA5OjU1OjAxLjAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAxNy0wNi0wMlQxOTowOTozMy4xNzdaIiwiZ3JhdmF0YXIiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvOTY1NDk2MGUyZmQzM2M1MGMwMzNhMTcwN2I3M2U5MTA_cz0yMDAmZD1yZXRybyIsInRva2VucyI6W10sIm5vdGlmaWNhdGlvblRva2VucyI6W10sIm5vdGl6aWUiOltdLCJsaWtlcyI6W10sImxvY2F0aW9uIjp7fSwiaWF0IjoxNDk2NDMwNTczfQ.mQkxRWXZ8HaN0vXDmfLnZylbeClOgcVkvKagBlmfNSk','3d14bd33-df5e-4239-b3e8-4b1e3854705c','2017-06-30 19:09:33','2017-06-02 21:09:33','2017-06-02 21:09:33'),
	('dac997c2-b233-447c-8649-01ef10aff1b1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYWNlYm9vayI6IjEwMjA5OTAwNzI2Nzg2NTMwIiwiaWQiOiIzZDE0YmQzMy1kZjVlLTQyMzktYjNlOC00YjFlMzg1NDcwNWMiLCJuYW1lIjoiR2lvcmdpbyBSb21hbm8iLCJlbWFpbCI6Im1lQGdpb3JnaW9yb21hbm8uaXQiLCJsZXZlbCI6IkFETUlOIiwicGljdHVyZSI6Imh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLzEwMjA5OTAwNzI2Nzg2NTMwL3BpY3R1cmU_dHlwZT1sYXJnZSIsImNyZWF0ZWRfYXQiOiIyMDE3LTAyLTE0VDA5OjU1OjAxLjAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAxNy0wNi0wMlQxOToxNTo0NS43MTdaIiwiZ3JhdmF0YXIiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvOTY1NDk2MGUyZmQzM2M1MGMwMzNhMTcwN2I3M2U5MTA_cz0yMDAmZD1yZXRybyIsInRva2VucyI6W10sIm5vdGlmaWNhdGlvblRva2VucyI6W10sIm5vdGl6aWUiOltdLCJsaWtlcyI6W10sImxvY2F0aW9uIjp7fSwiaWF0IjoxNDk2NDMwOTQ1fQ.xU-5-gSloELRmBZINkL92Modp3qaWIMYxF9c8KXMz6A','3d14bd33-df5e-4239-b3e8-4b1e3854705c','2017-06-30 19:15:45','2017-06-02 21:15:46','2017-06-02 21:15:46'),
	('e67542e8-2923-40b7-8bd1-3752de23f51d','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYWNlYm9vayI6IjEwMjA5OTAwNzI2Nzg2NTMwIiwiaWQiOiIzZDE0YmQzMy1kZjVlLTQyMzktYjNlOC00YjFlMzg1NDcwNWMiLCJuYW1lIjoiR2lvcmdpbyBSb21hbm8iLCJlbWFpbCI6Im1lQGdpb3JnaW9yb21hbm8uaXQiLCJsZXZlbCI6IkFETUlOIiwicGljdHVyZSI6Imh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLzEwMjA5OTAwNzI2Nzg2NTMwL3BpY3R1cmU_dHlwZT1sYXJnZSIsImNyZWF0ZWRfYXQiOiIyMDE3LTAyLTE0VDA5OjU1OjAxLjAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAxNy0wNi0wMlQxNToxMjoyMi41ODlaIiwiZ3JhdmF0YXIiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvOTY1NDk2MGUyZmQzM2M1MGMwMzNhMTcwN2I3M2U5MTA_cz0yMDAmZD1yZXRybyIsInRva2VucyI6W10sIm5vdGlmaWNhdGlvblRva2VucyI6W10sIm5vdGl6aWUiOltdLCJsaWtlcyI6W10sImxvY2F0aW9uIjp7fSwiaWF0IjoxNDk2NDE2MzQyfQ.8jJ6fEQU_QVE5C2y2snwgAfTJdyueRyy0BoKTyHbRd4','3d14bd33-df5e-4239-b3e8-4b1e3854705c','2017-06-30 15:12:22','2017-06-02 17:12:23','2017-06-02 17:12:23'),
	('e8fd1158-70fc-4754-bf40-9934c810efae','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYWNlYm9vayI6IjEwMjA5OTAwNzI2Nzg2NTMwIiwiaWQiOiIzZDE0YmQzMy1kZjVlLTQyMzktYjNlOC00YjFlMzg1NDcwNWMiLCJuYW1lIjoiR2lvcmdpbyBSb21hbm8iLCJlbWFpbCI6Im1lQGdpb3JnaW9yb21hbm8uaXQiLCJsZXZlbCI6IkFETUlOIiwicGljdHVyZSI6Imh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLzEwMjA5OTAwNzI2Nzg2NTMwL3BpY3R1cmU_dHlwZT1sYXJnZSIsImNyZWF0ZWRfYXQiOiIyMDE3LTAyLTE0VDA5OjU1OjAxLjAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAxNy0wNi0wMlQxOToxMzowNC40NjVaIiwiZ3JhdmF0YXIiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvOTY1NDk2MGUyZmQzM2M1MGMwMzNhMTcwN2I3M2U5MTA_cz0yMDAmZD1yZXRybyIsInRva2VucyI6W10sIm5vdGlmaWNhdGlvblRva2VucyI6W10sIm5vdGl6aWUiOltdLCJsaWtlcyI6W10sImxvY2F0aW9uIjp7fSwiaWF0IjoxNDk2NDMwNzg0fQ.dHKhTDKDedtlLf6rZeIUWbr2XZb_t5yGGMPKa7M097c','3d14bd33-df5e-4239-b3e8-4b1e3854705c','2017-06-30 19:13:04','2017-06-02 21:13:04','2017-06-02 21:13:04');

/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` char(36) NOT NULL DEFAULT '',
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `level` enum('USER','AUTHOR','EDITOR','MOD','ADMIN') DEFAULT 'USER',
  `password` varchar(255) DEFAULT NULL,
  `passwordResetToken` varchar(255) DEFAULT NULL,
  `passwordResetExpires` datetime DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `facebook_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `name`, `email`, `level`, `password`, `passwordResetToken`, `passwordResetExpires`, `picture`, `facebook`, `created_at`, `updated_at`, `facebook_token`)
VALUES
	('1799ee0a-62a7-4b6d-a20b-c35f5891320b','Andrea Piscitello','andreatello92@hotmail.it','USER',NULL,NULL,NULL,'https://graph.facebook.com/10212632019385494/picture?type=large','10212632019385494','2017-02-17 08:45:05','2017-02-22 08:44:50','EAAaHIG4fHtQBAAQOfUYZCZC8zcOXsiJB8tsbEFvfbkBGZBlLfvKDdBaZBJtZAZBu1fTgJM0WRvAXk7NhNjAh5UZBTclztzzuG3rJ2GMQrRtf7TIEQDsZAozRS45yHMYOxGjEFrHooIZCEaWEZC1ztO7Uq0x1OqqAs48LIZD'),
	('3d14bd33-df5e-4239-b3e8-4b1e3854705c','Giorgio Romano','me@giorgioromano.it','ADMIN',NULL,NULL,NULL,'https://graph.facebook.com/10209900726786530/picture?type=large','10209900726786530','2017-02-14 10:55:01','2017-06-04 17:44:24','EAAaf8SQ21T8BABEZCJm7xBaSKELaejKU8CqjUZBW5PdcDJqVG6v6TvtMBXyEZBQQwdLxZAUONZA6ipywVV1NTgXRfuoynCFqHQkgtjbPALJ2ZAQTLZCZABmd7OMhFnIHEl1FGcCI76ycskZB17goNsvfc'),
	('6dc9dfde-0d06-48b9-a10d-9c707553e988','Myriam Merendino','myrimerendino@hotmail.it','USER',NULL,NULL,NULL,'https://graph.facebook.com/10211322623608723/picture?type=large','10211322623608723','2017-03-13 20:16:08','2017-03-14 21:19:27','EAAaHIG4fHtQBAD1inFwrZBtdHm4q8ZA42bZACoZCDVdOZAOhJOxiZAPwpam4XMaI2xoPMQSjaSrs1jhM0dL8KCEIEAYAqFRGW5XSPMIQxZCojvYLQZCjk4z1xF4NEXfZBPzXQVRZB0Pd7fhaSGgnkZBY3c6'),
	('7bfcd7f5-7cb9-4a7f-9510-5405dc511c8f','Peppe Donato','aramil93@hotmail.it','USER',NULL,NULL,NULL,'https://graph.facebook.com/10212675949720785/picture?type=large','10212675949720785','2017-02-14 23:31:08','2017-03-19 14:15:28','EAAaHIG4fHtQBAK7Ha9Xi7riHa3q7MFsdIMhBXLcWCOPc2usz94JYrFCU2pIzFW9cVbzkrd57u5AoWAgriMeNnA0NzPK51Rh3IZBdcZChlOqRPHfygUVURZB9qIoUclzhCUxZAfM6Uh6ItdicrXbc'),
	('83eb596d-9b07-48c0-80e0-ae654ddfe0b8','Federica Frisone','fefeica92@hotmail.it','USER',NULL,NULL,NULL,'https://graph.facebook.com/10212141666479637/picture?type=large','10212141666479637','2017-03-13 20:52:40','2017-03-17 19:36:10','EAAaHIG4fHtQBADfEJlvFuQFM0skFrPyEyBbNZCe0A1bZBcRN3wP095RZCgwCqa5XJZCy0nQ8ZAqyZARkrkIvH99ujar5ZBA0zTY9wX05X19QDXZBZB1PaldpjF4QVsRY6joe2hGd9m3M0tXyosFZBhXTwN'),
	('8727a7fb-94bf-40f8-a663-0be877356e4a','Marco Romano','marco.romano.me@gmail.com','USER',NULL,NULL,NULL,'https://graph.facebook.com/1416032661748286/picture?type=large','1416032661748286','2017-02-21 18:08:21','2017-03-19 16:56:12','EAAaHIG4fHtQBALODQ55EDZCe39xy2xZAr2A2Rp6QZBbDnZAGFSUXsVsTi1YJE2Ebut9qtYZBZBpmcoZCtEdus9Sk4x6UdSrtQc33R0jgbgkW4W00gH0c8amo1jKyJYJoctsySlgODcZAAgRBI4FmSPqfXfZANwWZCidhZAd0Ki7NChwZBAZDZD'),
	('de2a08d6-9824-45b5-9049-236547779183','Antonella Barbieri','antonellabarbieri@live.it','USER',NULL,NULL,NULL,'https://graph.facebook.com/1306255092787085/picture?type=large','1306255092787085','2017-03-13 21:41:24','2017-04-06 16:34:19','EAAaHIG4fHtQBAHjnjNowEEujoEB7bjvo7m7nCEh3sSb8ZBnt0cDPO1K85isvvGEApwcCiBVsgmDr1aR8ZBU7pJsJj0qGeyCbVCRhBiethLC5ZCNnTC6ZCFSLE7RfZA6LOApMZAfPcZBzEXRNOyswh2bFvNzH9GZBi1JpZB1ddazIIJwZDZD'),
	('e29c664d-e6f1-4402-bb61-f7e68acb5c7e','App Account','app_nvnjohh_account@tfbnw.net','USER',NULL,NULL,NULL,'https://graph.facebook.com/102188903635654/picture?type=large','102188903635654','2017-03-19 18:04:55','2017-03-19 18:04:55','EAAaHIG4fHtQBAODkAGJP1jiIsPFhFyFwogFLhcn6tGVmqSelPDBQUpUff0nnZAaTDgGGM8ZBGdQ8zCts5OAkiUZBdv6uKEWSRxZBBc8ePxxr6nKuIXMYbFOCKUTOHiSiMRGwtaDv8vVc60uMgcP0YjzmAqGTShqHbyLqakZCoau46cJXCPzJIAcMRbgKStEDnvfPxXpHR7JuXFhg3nEH4CpZAqeSix9m77UkDWO7VptwZDZD'),
	('e5fbfc2b-4431-47df-b80f-528524d88a09','Fabrizio De Vita','fabriboss92@gmail.com','USER',NULL,NULL,NULL,'https://graph.facebook.com/10210127735842944/picture?type=large','10210127735842944','2017-02-15 10:34:40','2017-03-20 11:48:29','EAAaHIG4fHtQBAC5Bt8EtOhMp9Nm2B1hZBGGvPxP94uZAlGLfsEA4m82eSSPw7JIzZCZAYQ3Xer1W8r1n3VR5FrNIFIYuguuNTkjUYRlZAM3tCXEYqVcAYM3LE9ho9n3MY7hBv6VxVKnXUkZB4TGFBQZAWHgfS0oGREZD'),
	('e765b5d5-0e50-4791-a826-9ec80f16b1a7','Miranda Calderone','miry.c@live.it','USER',NULL,NULL,NULL,'https://graph.facebook.com/10212336296226338/picture?type=large','10212336296226338','2017-03-13 20:45:29','2017-03-13 20:45:29','EAAaHIG4fHtQBADzaslwNzYfpcYWJxyuX0nwip4aCQIJK5IBKAP3o6vzHggiYX5YCC5EFvyh8LhGVwcJGTUQEDAtaFDyV7Kz4oHb6sT2ECxu9jp4RvYXoGYAq7mZBZChjY4ZCpGZAUvVVEW7v3G3O6zwrZB4jKBoDxZBqz0jvucDLnRMtciQJ0GvqoOajKiZAaZBmun36YL0agadFS16ZBnwgdLAuy87YVriYZD');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
