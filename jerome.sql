-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.16.0.7229
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for tricyclemanagementsystemdb
CREATE DATABASE IF NOT EXISTS `tricyclemanagementsystemdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `tricyclemanagementsystemdb`;

-- Dumping structure for table tricyclemanagementsystemdb.tbl_admin
CREATE TABLE IF NOT EXISTS `tbl_admin` (
  `admin_id` int(11) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tricyclemanagementsystemdb.tbl_admin: ~1 rows (approximately)
DELETE FROM `tbl_admin`;
INSERT INTO `tbl_admin` (`admin_id`, `user_name`, `password`) VALUES
	(1, 'admin', 'admin');

-- Dumping structure for table tricyclemanagementsystemdb.tbl_user
CREATE TABLE IF NOT EXISTS `tbl_user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL DEFAULT '',
  `age` int(2) NOT NULL,
  `email` varchar(50) NOT NULL DEFAULT '',
  `address` varchar(100) NOT NULL DEFAULT '',
  `user_name` varchar(50) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tricyclemanagementsystemdb.tbl_user: ~17 rows (approximately)
DELETE FROM `tbl_user`;
INSERT INTO `tbl_user` (`user_id`, `full_name`, `age`, `email`, `address`, `user_name`, `password`) VALUES
	(1, 'Jhonelle', 24, 'jhonviseral@gmail.com', 'LPC', 'Jhonelle022', 'Jhonelle022!'),
	(2, 'Jerome', 22, 'jeromeviseral@gmail.com', 'LPC', 'Jerome022', 'Jerome022!'),
	(3, 'Jerald', 19, 'jerald@gmail.com', 'LPC', 'Jerald', '12345'),
	(4, 'jpv', 22, 'jpv@gmail.com', 'Cavite', 'jpv123', 'jpv12345'),
	(5, 'Jerome P. Viseral', 22, 'jeromeviseral@gmail.com', 'LPC', 'Jerome123', 'Jeromepogi'),
	(6, 'Justin', 18, 'bieber@gmail.com', 'paco', 'JB', '123456'),
	(7, 'Justin', 18, 'bieber@gmail.com', 'paco', 'JB', '123456'),
	(8, 'Justin', 18, 'bieber@gmail.com', 'paco', 'JB', '123456'),
	(9, 'Justin', 18, 'bieber@gmail.com', 'paco', 'JB', '123456'),
	(10, 'Justin', 18, 'bieber@gmail.com', 'paco', 'JB', '123456'),
	(11, 'Justin', 18, 'bieber@gmail.com', 'paco', 'JB', '123456'),
	(12, 'Justin', 18, 'bieber@gmail.com', 'paco', 'JB', '123456'),
	(13, 'Justin', 18, 'bieber@gmail.com', 'paco', 'JB', '123456'),
	(14, 'jbkjbkb', 123, 'AdrianKinilaw@gmail.com', 'kjbjkb', 'Adrian', '123456'),
	(15, 'Luke Natividad', 22, 'Luke@gmail.com', 'Manila', 'Luke123', 'Luke12345'),
	(16, 'Luke Natividad', 22, 'Luke@gmail.com', 'Manila', 'Luke123', 'Luke12345'),
	(17, 'qwewq', 21, 'kirk@gmail.com', 'Bulacan', 'kirk2', 'kirk123');

-- Dumping structure for table tricyclemanagementsystemdb.tbl_useraccounts
CREATE TABLE IF NOT EXISTS `tbl_useraccounts` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL,
  `total_price` float NOT NULL,
  `monthly_rate` float NOT NULL,
  `balance` float NOT NULL,
  `due_date` date DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table tricyclemanagementsystemdb.tbl_useraccounts: ~17 rows (approximately)
DELETE FROM `tbl_useraccounts`;
INSERT INTO `tbl_useraccounts` (`user_id`, `full_name`, `status`, `total_price`, `monthly_rate`, `balance`, `due_date`) VALUES
	(1, 'Jhonelle', 'Active', 150000, 15000, 125000, '2026-07-15'),
	(2, 'Jerome', 'Active', 150000, 15000, 150000, '2026-06-15'),
	(3, 'Jerald', 'Active', 50000, 5000, 50000, '2026-06-15'),
	(4, 'jpv', 'Active', 50000, 10000, 50000, '2026-06-15'),
	(5, 'Jerome P. Viseral', 'Active', 300000, 20000, 260000, '2026-06-15'),
	(6, 'Justin', 'Active', 500000, 20000, 500000, '2026-05-30'),
	(7, 'Justin', 'Pending', 0, 0, 0, '2026-06-15'),
	(8, 'Justin', 'Pending', 0, 0, 0, '2026-06-15'),
	(9, 'Justin', 'Pending', 0, 0, 0, '2026-06-15'),
	(10, 'Justin', 'Pending', 0, 0, 0, '2026-06-15'),
	(11, 'Justin', 'Pending', 0, 0, 0, '2026-06-15'),
	(12, 'Justin', 'Pending', 0, 0, 0, '2026-06-15'),
	(13, 'Justin', 'Pending', 0, 0, 0, '2026-06-15'),
	(14, 'jbkjbkb', 'Pending', 0, 0, 0, '2026-06-15'),
	(15, 'Luke Natividad', 'Pending', 0, 0, 0, '2026-06-16'),
	(16, 'Luke Natividad', 'Active', 100, 5, 0, '2026-06-15'),
	(17, 'qwewq', 'Pending', 0, 0, 0, '2026-06-16');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
