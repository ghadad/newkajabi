-- phpMyAdmin SQL Dump
-- version 5.1.4deb1
-- https://www.phpmyadmin.net/
--
-- Host: db-mysql-fra1-44022-do-user-13337517-0.b.db.ondigitalocean.com:25060
-- Generation Time: Mar 18, 2023 at 07:15 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.7-1ubuntu3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `difuzia`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `secret` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `qrcode` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `scans` int DEFAULT NULL,
  `verified_once` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `activation_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `activated` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `email`, `password`, `secret`, `qrcode`, `scans`, `verified_once`, `activation_code`, `activated`, `created_at`) VALUES
(4, 'udi_fili@yahoo.com', NULL, 'MFXWGQCEHBTDGNTUHJKES4C2GASDQUKK', 'otpauth://totp/Difuzia%202FA?secret=MFXWGQCEHBTDGNTUHJKES4C2GASDQUKK', 1, NULL, 'aa08819c-2aeb-44f3-a474-9f15ae7ac482', 1, '2023-02-25 13:05:28'),
(6, 'ghadad@gmail.com', NULL, 'KVRHUJJ4LN4X2WBWGB6TA63JFI4EOZZF', 'otpauth://totp/Difuzia%202FA?secret=KVRHUJJ4LN4X2WBWGB6TA63JFI4EOZZF', 1, 'Y', NULL, 0, '2023-02-25 23:15:56');

-- --------------------------------------------------------

--
-- Table structure for table `scans`
--

CREATE TABLE `scans` (
  `id` int NOT NULL,
  `email` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Client_id` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `status` tinyint(1) NOT NULL,
  `status_code` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `scans`
--

INSERT INTO `scans` (`id`, `email`, `created_at`, `Client_id`, `status`, `status_code`) VALUES
(1, 'ghadad@gmail.com', '2023-03-04 11:53:53', NULL, 1, 'SUCCESS'),
(2, 'ghadad@gmail.com', '2023-03-04 11:53:56', NULL, 1, 'SUCCESS'),
(3, 'ghadad@gmail.com', '2023-03-04 11:55:30', NULL, 0, 'ACTIVATION_ERROR - SITE INITIATOR'),
(4, 'ghadad@gmail.com', '2023-03-04 11:56:24', NULL, 0, 'ACTIVATION_ERROR - SITE INITIATOR'),
(5, 'ghadad@gmail.com', '2023-03-04 11:56:50', NULL, 1, 'SUCCESS'),
(6, 'ghadad@gmail.com', '2023-03-04 11:56:52', NULL, 1, 'SUCCESS'),
(7, 'ghadad@gmail.com', '2023-03-04 12:08:47', NULL, 0, 'ALREADY_REGISTERED'),
(8, 'ghadad@gmail.com', '2023-03-04 12:08:51', NULL, 0, 'ALREADY_REGISTERED'),
(9, 'ghadad@gmail.com1', '2023-03-04 12:09:03', NULL, 0, 'NOT_FOUND'),
(10, 'ghadad@gmail.com1', '2023-03-04 12:10:06', NULL, 0, 'NOT_FOUND'),
(11, 'ghadad@gmail.com', '2023-03-04 12:10:12', NULL, 0, 'ALREADY_REGISTERED'),
(12, 'ghadad@gmail.com', '2023-03-04 12:10:52', NULL, 0, 'ACTIVATION_ERROR - EMAIL INITIATOR'),
(13, 'ghadad@gmail.com', '2023-03-04 12:10:54', NULL, 0, 'ACTIVATION_ERROR - SITE INITIATOR'),
(14, 'ghadad@gmail.com', '2023-03-04 12:11:40', NULL, 1, 'SUCCESS'),
(15, 'ghadad@gmail.com', '2023-03-04 12:11:42', NULL, 1, 'SUCCESS'),
(16, 'ghadad@gmail.com', '2023-03-04 12:25:10', NULL, 0, 'ALREADY_REGISTERED'),
(17, 'ghadad@gmail.com', '2023-03-04 12:30:14', NULL, 0, 'ALREADY_REGISTERED'),
(18, 'ghadad@gmail.com', '2023-03-05 18:26:06', NULL, 0, 'ALREADY_REGISTERED'),
(19, 'ghadad@gmail.com', '2023-03-05 18:37:02', NULL, 0, 'ALREADY_REGISTERED'),
(20, 'ghadad@gmail.com', '2023-03-06 06:37:29', NULL, 0, 'ALREADY_REGISTERED'),
(21, 'ghadad@gmail.com', '2023-03-06 08:56:01', NULL, 0, 'ALREADY_REGISTERED'),
(22, 'ghadad@gmail.com', '2023-03-06 10:46:30', NULL, 0, 'ALREADY_REGISTERED'),
(23, 'ghadad@gmail.com', '2023-03-07 06:57:30', NULL, 0, 'ALREADY_REGISTERED'),
(24, 'ghadad@gmail.com', '2023-03-07 07:36:43', NULL, 0, 'ALREADY_REGISTERED'),
(25, 'ghadad@gmail.com', '2023-03-09 06:37:50', NULL, 0, 'ALREADY_REGISTERED'),
(26, 'ghadad@gmail.com', '2023-03-11 15:07:27', NULL, 0, 'ALREADY_REGISTERED'),
(27, 'dddsdsd', '2023-03-12 07:49:38', NULL, 0, 'NOT_FOUND'),
(28, 'dddsdsd@ffff.com', '2023-03-12 07:49:49', NULL, 0, 'NOT_FOUND'),
(29, 'dddsdsd', '2023-03-13 13:57:58', NULL, 0, 'NOT_FOUND'),
(30, 'dddsdsd', '2023-03-14 07:26:54', NULL, 0, 'NOT_FOUND'),
(31, 'dddsdsd', '2023-03-14 08:40:59', NULL, 0, 'NOT_FOUND'),
(32, 'dddsdsd', '2023-03-18 06:32:57', NULL, 0, 'NOT_FOUND'),
(33, 'dddsdsd', '2023-03-18 06:33:06', NULL, 0, 'NOT_FOUND');

-- --------------------------------------------------------

--
-- Table structure for table `verifications`
--

CREATE TABLE `verifications` (
  `id` int NOT NULL,
  `email` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Client_id` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `status` tinyint(1) NOT NULL,
  `status_code` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `verifications`
--

INSERT INTO `verifications` (`id`, `email`, `created_at`, `Client_id`, `status`, `status_code`) VALUES
(1, 'ghadad@gmail.com', '2023-03-04 11:52:02', NULL, 0, 'VERIFY_ERROR'),
(2, 'ghadad@gmail.com', '2023-03-04 11:52:40', NULL, 0, 'VERIFY_ERROR'),
(3, 'ghadad@gmail.com', '2023-03-04 11:52:40', NULL, 0, 'VERIFY_ERROR'),
(4, 'ghadad@gmail.com', '2023-03-04 11:52:41', NULL, 0, 'VERIFY_ERROR'),
(5, 'ghadad@gmail.com', '2023-03-04 11:57:58', NULL, 1, 'SUCCESS'),
(6, 'ghadad@gmail.com', '2023-03-04 11:58:56', NULL, 0, 'VERIFY_ERROR'),
(7, 'ghadad@gmail.com', '2023-03-04 11:59:00', NULL, 0, 'VERIFY_ERROR'),
(8, 'ghadad@gmail.com', '2023-03-04 11:59:02', NULL, 0, 'VERIFY_ERROR'),
(9, 'ghadad@gmail.com', '2023-03-04 11:59:03', NULL, 0, 'VERIFY_ERROR'),
(10, 'ghadad@gmail.com', '2023-03-04 11:59:04', NULL, 0, 'VERIFY_ERROR'),
(11, 'ghadad@gmail.com', '2023-03-04 11:59:04', NULL, 0, 'VERIFY_ERROR'),
(12, 'ghadad@gmail.com', '2023-03-04 11:59:04', NULL, 0, 'VERIFY_ERROR'),
(13, 'ghadad@gmail.com', '2023-03-04 11:59:04', NULL, 0, 'VERIFY_ERROR'),
(14, 'ghadad@gmail.com', '2023-03-04 11:59:04', NULL, 0, 'VERIFY_ERROR'),
(15, 'ghadad@gmail.com', '2023-03-04 11:59:05', NULL, 0, 'VERIFY_ERROR'),
(16, 'ghadad@gmail.com', '2023-03-04 11:59:05', NULL, 0, 'VERIFY_ERROR'),
(17, 'ghadad@gmail.com', '2023-03-04 11:59:23', NULL, 1, 'SUCCESS'),
(18, 'ghadad@gmail.com', '2023-03-04 12:03:04', NULL, 0, 'VERIFY_ERROR'),
(19, 'ghadad@gmail.com', '2023-03-04 12:03:08', NULL, 0, 'VERIFY_ERROR'),
(20, 'ghadad@gmail.com', '2023-03-04 12:03:13', NULL, 0, 'VERIFY_ERROR'),
(21, 'ghadad@gmail.com', '2023-03-04 12:03:17', NULL, 0, 'VERIFY_ERROR'),
(22, 'ghadad@gmail.com', '2023-03-04 12:03:19', NULL, 0, 'VERIFY_ERROR'),
(23, 'ghadad@gmail.com', '2023-03-04 12:03:39', NULL, 1, 'SUCCESS'),
(24, 'ghadad@gmail.com', '2023-03-04 12:12:12', NULL, 0, 'VERIFY_ERROR'),
(25, 'ghadad@gmail.com', '2023-03-04 12:12:38', NULL, 1, 'SUCCESS'),
(26, 'ghadad@gmail.com', '2023-03-04 12:25:31', NULL, 0, 'VERIFY_ERROR');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `scans`
--
ALTER TABLE `scans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `verifications`
--
ALTER TABLE `verifications`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `scans`
--
ALTER TABLE `scans`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `verifications`
--
ALTER TABLE `verifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

