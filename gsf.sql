-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 22, 2025 at 07:17 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gsf`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `message_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`message_id`, `session_id`, `sender_id`, `message`, `is_read`, `created_at`) VALUES
(5, 6, 3, 'i am bereket i want to say hi', 0, '2025-07-19 21:30:06'),
(6, 6, 3, 'i am bereket', 0, '2025-07-21 13:56:59');

-- --------------------------------------------------------

--
-- Table structure for table `chat_sessions`
--

CREATE TABLE `chat_sessions` (
  `session_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `status` enum('active','closed') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_sessions`
--

INSERT INTO `chat_sessions` (`session_id`, `user_id`, `admin_id`, `status`, `created_at`, `updated_at`) VALUES
(6, 3, 2, 'active', '2025-07-19 21:29:53', '2025-07-19 21:29:53');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `employee_id` int(11) NOT NULL,
  `office_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `position` varchar(100) NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `subcity_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`employee_id`, `office_id`, `full_name`, `position`, `photo_url`, `email`, `phone`, `is_active`, `created_at`, `updated_at`, `subcity_id`) VALUES
(40, 212, 'Amanuel Bekele', 'Senior Economist', 'uploads/amanuel_bekele.jpg', 'amanuel.bekele@gov.et', '+251‑911‑000001', 1, '2025-07-14 18:16:47', '2025-07-14 18:16:47', 16),
(41, 213, 'Sara Getachew', 'Finance Officer', 'uploads/sara_getachew.jpg', 'sara.getachew@gov.et', '+251‑911‑000002', 1, '2025-07-14 18:16:47', '2025-07-14 18:16:47', 14),
(42, 214, 'Yonas Tadesse', 'Housing Analyst', 'uploads/yonas_tadesse.jpg', 'yonas.tadesse@gov.et', '+251‑911‑000003', 1, '2025-07-14 18:16:47', '2025-07-14 18:16:47', 15),
(43, 212, 'Mesfin Worku', 'Employment Officer', 'uploads/mesfin.jpg', 'mesfin.employment@gov.et', '+251-911-212014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(44, 213, 'Selamawit Abebe', 'Finance Director', 'uploads/selam.jpg', 'selam.finance@gov.et', '+251-911-213014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(45, 214, 'Tewodros Kassahun', 'Housing Manager', 'uploads/tewodros.jpg', 'tewodros.housing@gov.et', '+251-911-214014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(46, 215, 'Aster Demissie', 'HR Specialist', 'uploads/aster.jpg', 'aster.hr@gov.et', '+251-911-215014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(47, 216, 'Dawit Mekonnen', 'Security Advisor', 'uploads/dawit.jpg', 'dawit.security@gov.et', '+251-911-216014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(48, 217, 'Eyerusalem Tesfaye', 'Tourism Officer', 'uploads/eyerusalem.jpg', 'eyerusalem.tourism@gov.et', '+251-911-217014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(49, 218, 'Fitsum Girma', 'Land Officer', 'uploads/fitsum.jpg', 'fitsum.land@gov.et', '+251-911-218014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(50, 219, 'Genet Assefa', 'Construction Engineer', 'uploads/genet.jpg', 'genet.construction@gov.et', '+251-911-219014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(51, 220, 'Haben Yohannes', 'Commerce Officer', 'uploads/haben.jpg', 'haben.commerce@gov.et', '+251-911-220014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(52, 221, 'Kibrom Gebre', 'Social Affairs Officer', 'uploads/kibrom.jpg', 'kibrom.social@gov.et', '+251-911-221014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(53, 222, 'Liya Solomon', 'Revenue Officer', 'uploads/liya.jpg', 'liya.revenue@gov.et', '+251-911-222014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(54, 223, 'Mikias Lemma', 'Sports Coordinator', 'uploads/mikias.jpg', 'mikias.sports@gov.et', '+251-911-223014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(55, 224, 'Nardos Asrat', 'Urban Planner', 'uploads/nardos.jpg', 'nardos.urban@gov.et', '+251-911-224014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(56, 225, 'Omar Ahmed', 'Investment Officer', 'uploads/omar.jpg', 'omar.investment@gov.et', '+251-911-225014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(57, 226, 'Rahel Tekle', 'Property Manager', 'uploads/rahel.jpg', 'rahel.property@gov.et', '+251-911-226014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(58, 227, 'Samuel Wolde', 'Agriculture Officer', 'uploads/samuel.jpg', 'samuel.agriculture@gov.et', '+251-911-227014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(59, 228, 'Tigist Hailu', 'Disaster Manager', 'uploads/tigist.jpg', 'tigist.disaster@gov.et', '+251-911-228014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(60, 229, 'Yared Getachew', 'Education Officer', 'uploads/yared.jpg', 'yared.education@gov.et', '+251-911-229014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(61, 230, 'Zelalem Bekele', 'Licensing Officer', 'uploads/zelalem.jpg', 'zelalem.licensing@gov.et', '+251-911-230014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(62, 231, 'Abel Teshome', 'Traffic Officer', 'uploads/abel.jpg', 'abel.traffic@gov.et', '+251-911-231014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(63, 232, 'Birtukan Mulu', 'Land Titles Officer', 'uploads/birtukan.jpg', 'birtukan.landtitles@gov.et', '+251-911-232014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(64, 233, 'Daniel Assefa', 'Records Officer', 'uploads/daniel.jpg', 'daniel.records@gov.et', '+251-911-233014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(65, 234, 'Eden Mohammed', 'Revenue Agent', 'uploads/eden.jpg', 'eden.revenue@gov.et', '+251-911-234014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(66, 235, 'Fasika Melaku', 'Procurement Officer', 'uploads/fasika.jpg', 'fasika.procurement@gov.et', '+251-911-235014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(67, 236, 'Girma Alemu', 'Auditor', 'uploads/girma.jpg', 'girma.audit@gov.et', '+251-911-236014', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 14),
(68, 212, 'Mesfin Worku', 'Employment Officer', 'uploads/mesfin.jpg', 'mesfin.employment@gov.et', '+251-911-212015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(69, 213, 'Selamawit Abebe', 'Finance Director', 'uploads/selam.jpg', 'selam.finance@gov.et', '+251-911-213015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(70, 214, 'Tewodros Kassahun', 'Housing Manager', 'uploads/tewodros.jpg', 'tewodros.housing@gov.et', '+251-911-214015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(71, 215, 'Aster Demissie', 'HR Specialist', 'uploads/aster.jpg', 'aster.hr@gov.et', '+251-911-215015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(72, 216, 'Dawit Mekonnen', 'Security Advisor', 'uploads/dawit.jpg', 'dawit.security@gov.et', '+251-911-216015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(73, 217, 'Eyerusalem Tesfaye', 'Tourism Officer', 'uploads/eyerusalem.jpg', 'eyerusalem.tourism@gov.et', '+251-911-217015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(74, 218, 'Fitsum Girma', 'Land Officer', 'uploads/fitsum.jpg', 'fitsum.land@gov.et', '+251-911-218015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(75, 219, 'Genet Assefa', 'Construction Engineer', 'uploads/genet.jpg', 'genet.construction@gov.et', '+251-911-219015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(76, 220, 'Haben Yohannes', 'Commerce Officer', 'uploads/haben.jpg', 'haben.commerce@gov.et', '+251-911-220015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(77, 221, 'Kibrom Gebre', 'Social Affairs Officer', 'uploads/kibrom.jpg', 'kibrom.social@gov.et', '+251-911-221015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(78, 222, 'Liya Solomon', 'Revenue Officer', 'uploads/liya.jpg', 'liya.revenue@gov.et', '+251-911-222015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(79, 223, 'Mikias Lemma', 'Sports Coordinator', 'uploads/mikias.jpg', 'mikias.sports@gov.et', '+251-911-223015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(80, 224, 'Nardos Asrat', 'Urban Planner', 'uploads/nardos.jpg', 'nardos.urban@gov.et', '+251-911-224015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(81, 225, 'Omar Ahmed', 'Investment Officer', 'uploads/omar.jpg', 'omar.investment@gov.et', '+251-911-225015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(82, 226, 'Rahel Tekle', 'Property Manager', 'uploads/rahel.jpg', 'rahel.property@gov.et', '+251-911-226015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(83, 227, 'Samuel Wolde', 'Agriculture Officer', 'uploads/samuel.jpg', 'samuel.agriculture@gov.et', '+251-911-227015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(84, 228, 'Tigist Hailu', 'Disaster Manager', 'uploads/tigist.jpg', 'tigist.disaster@gov.et', '+251-911-228015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(85, 229, 'Yared Getachew', 'Education Officer', 'uploads/yared.jpg', 'yared.education@gov.et', '+251-911-229015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(86, 230, 'Zelalem Bekele', 'Licensing Officer', 'uploads/zelalem.jpg', 'zelalem.licensing@gov.et', '+251-911-230015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(87, 231, 'Abel Teshome', 'Traffic Officer', 'uploads/abel.jpg', 'abel.traffic@gov.et', '+251-911-231015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(88, 232, 'Birtukan Mulu', 'Land Titles Officer', 'uploads/birtukan.jpg', 'birtukan.landtitles@gov.et', '+251-911-232015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(89, 233, 'Daniel Assefa', 'Records Officer', 'uploads/daniel.jpg', 'daniel.records@gov.et', '+251-911-233015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(90, 234, 'Eden Mohammed', 'Revenue Agent', 'uploads/eden.jpg', 'eden.revenue@gov.et', '+251-911-234015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(91, 235, 'Fasika Melaku', 'Procurement Officer', 'uploads/fasika.jpg', 'fasika.procurement@gov.et', '+251-911-235015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(92, 236, 'Girma Alemu', 'Auditor', 'uploads/girma.jpg', 'girma.audit@gov.et', '+251-911-236015', 1, '2025-07-16 20:29:25', '2025-07-16 20:29:25', 15),
(93, 212, 'Mesfin Worku', 'Employment Officer', 'uploads/mesfin.jpg', 'mesfin.employment@gov.et', '+251-911-212014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 16),
(94, 213, 'Selamawit Abebe', 'Finance Director', 'uploads/selam.jpg', 'selam.finance@gov.et', '+251-911-213014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 16),
(95, 214, 'Tewodros Kassahun', 'Housing Manager', 'uploads/tewodros.jpg', 'tewodros.housing@gov.et', '+251-911-214014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 16),
(96, 215, 'Aster Demissie', 'HR Specialist', 'uploads/aster.jpg', 'aster.hr@gov.et', '+251-911-215014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 16),
(97, 216, 'Dawit Mekonnen', 'Security Advisor', 'uploads/dawit.jpg', 'dawit.security@gov.et', '+251-911-216014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 16),
(98, 217, 'Eyerusalem Tesfaye', 'Tourism Officer', 'uploads/eyerusalem.jpg', 'eyerusalem.tourism@gov.et', '+251-911-217014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 16),
(99, 218, 'Fitsum Girma', 'Land Officer', 'uploads/fitsum.jpg', 'fitsum.land@gov.et', '+251-911-218014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 16),
(100, 219, 'Genet Assefa', 'Construction Engineer', 'uploads/genet.jpg', 'genet.construction@gov.et', '+251-911-219014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 16),
(101, 220, 'Haben Yohannes', 'Commerce Officer', 'uploads/haben.jpg', 'haben.commerce@gov.et', '+251-911-220014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 16),
(102, 221, 'Kibrom Gebre', 'Social Affairs Officer', 'uploads/kibrom.jpg', 'kibrom.social@gov.et', '+251-911-221014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 16),
(103, 222, 'Liya Solomon', 'Revenue Officer', 'uploads/liya.jpg', 'liya.revenue@gov.et', '+251-911-222014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 14),
(104, 223, 'Mikias Lemma', 'Sports Coordinator', 'uploads/mikias.jpg', 'mikias.sports@gov.et', '+251-911-223014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 16),
(105, 224, 'Nardos Asrat', 'Urban Planner', 'uploads/nardos.jpg', 'nardos.urban@gov.et', '+251-911-224014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 14),
(106, 225, 'Omar Ahmed', 'Investment Officer', 'uploads/omar.jpg', 'omar.investment@gov.et', '+251-911-225014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 16),
(107, 226, 'Rahel Tekle', 'Property Manager', 'uploads/rahel.jpg', 'rahel.property@gov.et', '+251-911-226014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 14),
(108, 227, 'Samuel Wolde', 'Agriculture Officer', 'uploads/samuel.jpg', 'samuel.agriculture@gov.et', '+251-911-227014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 16),
(109, 228, 'Tigist Hailu', 'Disaster Manager', 'uploads/tigist.jpg', 'tigist.disaster@gov.et', '+251-911-228014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 16),
(110, 229, 'Yared Getachew', 'Education Officer', 'uploads/yared.jpg', 'yared.education@gov.et', '+251-911-229014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 16),
(111, 230, 'Zelalem Bekele', 'Licensing Officer', 'uploads/zelalem.jpg', 'zelalem.licensing@gov.et', '+251-911-230014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 16),
(112, 231, 'Abel Teshome', 'Traffic Officer', 'uploads/abel.jpg', 'abel.traffic@gov.et', '+251-911-231014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 14),
(113, 232, 'Birtukan Mulu', 'Land Titles Officer', 'uploads/birtukan.jpg', 'birtukan.landtitles@gov.et', '+251-911-232014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 16),
(114, 233, 'Daniel Assefa', 'Records Officer', 'uploads/daniel.jpg', 'daniel.records@gov.et', '+251-911-233014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 16),
(115, 234, 'Eden Mohammed', 'Revenue Agent', 'uploads/eden.jpg', 'eden.revenue@gov.et', '+251-911-234014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 14),
(116, 235, 'Fasika Melaku', 'Procurement Officer', 'uploads/fasika.jpg', 'fasika.procurement@gov.et', '+251-911-235014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 16),
(117, 236, 'Girma Alemu', 'Auditor', 'uploads/girma.jpg', 'girma.audit@gov.et', '+251-911-236014', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 14),
(118, 212, 'Mesfin Worku', 'Employment Officer', 'uploads/mesfin.jpg', 'mesfin.employment@gov.et', '+251-911-212015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 17),
(119, 213, 'Selamawit Abebe', 'Finance Director', 'uploads/selam.jpg', 'selam.finance@gov.et', '+251-911-213015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 17),
(120, 214, 'Tewodros Kassahun', 'Housing Manager', 'uploads/tewodros.jpg', 'tewodros.housing@gov.et', '+251-911-214015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 17),
(121, 215, 'Aster Demissie', 'HR Specialist', 'uploads/aster.jpg', 'aster.hr@gov.et', '+251-911-215015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 15),
(122, 216, 'Dawit Mekonnen', 'Security Advisor', 'uploads/dawit.jpg', 'dawit.security@gov.et', '+251-911-216015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 17),
(123, 217, 'Eyerusalem Tesfaye', 'Tourism Officer', 'uploads/eyerusalem.jpg', 'eyerusalem.tourism@gov.et', '+251-911-217015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 17),
(124, 218, 'Fitsum Girma', 'Land Officer', 'uploads/fitsum.jpg', 'fitsum.land@gov.et', '+251-911-218015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 15),
(125, 219, 'Genet Assefa', 'Construction Engineer', 'uploads/genet.jpg', 'genet.construction@gov.et', '+251-911-219015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 17),
(126, 220, 'Haben Yohannes', 'Commerce Officer', 'uploads/haben.jpg', 'haben.commerce@gov.et', '+251-911-220015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 15),
(127, 221, 'Kibrom Gebre', 'Social Affairs Officer', 'uploads/kibrom.jpg', 'kibrom.social@gov.et', '+251-911-221015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 17),
(128, 222, 'Liya Solomon', 'Revenue Officer', 'uploads/liya.jpg', 'liya.revenue@gov.et', '+251-911-222015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 15),
(129, 223, 'Mikias Lemma', 'Sports Coordinator', 'uploads/mikias.jpg', 'mikias.sports@gov.et', '+251-911-223015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 17),
(130, 224, 'Nardos Asrat', 'Urban Planner', 'uploads/nardos.jpg', 'nardos.urban@gov.et', '+251-911-224015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 15),
(131, 225, 'Omar Ahmed', 'Investment Officer', 'uploads/omar.jpg', 'omar.investment@gov.et', '+251-911-225015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 17),
(132, 226, 'Rahel Tekle', 'Property Manager', 'uploads/rahel.jpg', 'rahel.property@gov.et', '+251-911-226015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 15),
(133, 227, 'Samuel Wolde', 'Agriculture Officer', 'uploads/samuel.jpg', 'samuel.agriculture@gov.et', '+251-911-227015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 17),
(134, 228, 'Tigist Hailu', 'Disaster Manager', 'uploads/tigist.jpg', 'tigist.disaster@gov.et', '+251-911-228015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 17),
(135, 229, 'Yared Getachew', 'Education Officer', 'uploads/yared.jpg', 'yared.education@gov.et', '+251-911-229015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 17),
(136, 230, 'Zelalem Bekele', 'Licensing Officer', 'uploads/zelalem.jpg', 'zelalem.licensing@gov.et', '+251-911-230015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 17),
(137, 231, 'Abel Teshome', 'Traffic Officer', 'uploads/abel.jpg', 'abel.traffic@gov.et', '+251-911-231015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 17),
(138, 232, 'Birtukan Mulu', 'Land Titles Officer', 'uploads/birtukan.jpg', 'birtukan.landtitles@gov.et', '+251-911-232015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 17),
(139, 233, 'Daniel Assefa', 'Records Officer', 'uploads/daniel.jpg', 'daniel.records@gov.et', '+251-911-233015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 17),
(140, 234, 'Eden Mohammed', 'Revenue Agent', 'uploads/eden.jpg', 'eden.revenue@gov.et', '+251-911-234015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 17),
(141, 235, 'Fasika Melaku', 'Procurement Officer', 'uploads/fasika.jpg', 'fasika.procurement@gov.et', '+251-911-235015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 17),
(142, 236, 'Girma Alemu', 'Auditor', 'uploads/girma.jpg', 'girma.audit@gov.et', '+251-911-236015', 1, '2025-07-16 20:33:35', '2025-07-16 20:33:35', 17),
(143, 212, 'Mesfin Worku', 'Employment Officer', 'uploads/mesfin.jpg', 'mesfin.employment@gov.et', '+251-911-212014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 18),
(144, 213, 'Selamawit Abebe', 'Finance Director', 'uploads/selam.jpg', 'selam.finance@gov.et', '+251-911-213014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 18),
(145, 214, 'Tewodros Kassahun', 'Housing Manager', 'uploads/tewodros.jpg', 'tewodros.housing@gov.et', '+251-911-214014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 18),
(146, 215, 'Aster Demissie', 'HR Specialist', 'uploads/aster.jpg', 'aster.hr@gov.et', '+251-911-215014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 14),
(147, 216, 'Dawit Mekonnen', 'Security Advisor', 'uploads/dawit.jpg', 'dawit.security@gov.et', '+251-911-216014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 18),
(148, 217, 'Eyerusalem Tesfaye', 'Tourism Officer', 'uploads/eyerusalem.jpg', 'eyerusalem.tourism@gov.et', '+251-911-217014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 18),
(149, 218, 'Fitsum Girma', 'Land Officer', 'uploads/fitsum.jpg', 'fitsum.land@gov.et', '+251-911-218014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 14),
(150, 219, 'Genet Assefa', 'Construction Engineer', 'uploads/genet.jpg', 'genet.construction@gov.et', '+251-911-219014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 18),
(151, 220, 'Haben Yohannes', 'Commerce Officer', 'uploads/haben.jpg', 'haben.commerce@gov.et', '+251-911-220014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 18),
(152, 221, 'Kibrom Gebre', 'Social Affairs Officer', 'uploads/kibrom.jpg', 'kibrom.social@gov.et', '+251-911-221014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 18),
(153, 222, 'Liya Solomon', 'Revenue Officer', 'uploads/liya.jpg', 'liya.revenue@gov.et', '+251-911-222014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 14),
(154, 223, 'Mikias Lemma', 'Sports Coordinator', 'uploads/mikias.jpg', 'mikias.sports@gov.et', '+251-911-223014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 18),
(155, 224, 'Nardos Asrat', 'Urban Planner', 'uploads/nardos.jpg', 'nardos.urban@gov.et', '+251-911-224014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 18),
(156, 225, 'Omar Ahmed', 'Investment Officer', 'uploads/omar.jpg', 'omar.investment@gov.et', '+251-911-225014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 18),
(157, 226, 'Rahel Tekle', 'Property Manager', 'uploads/rahel.jpg', 'rahel.property@gov.et', '+251-911-226014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 14),
(158, 227, 'Samuel Wolde', 'Agriculture Officer', 'uploads/samuel.jpg', 'samuel.agriculture@gov.et', '+251-911-227014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 18),
(159, 228, 'Tigist Hailu', 'Disaster Manager', 'uploads/tigist.jpg', 'tigist.disaster@gov.et', '+251-911-228014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 18),
(160, 229, 'Yared Getachew', 'Education Officer', 'uploads/yared.jpg', 'yared.education@gov.et', '+251-911-229014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 18),
(161, 230, 'Zelalem Bekele', 'Licensing Officer', 'uploads/zelalem.jpg', 'zelalem.licensing@gov.et', '+251-911-230014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 18),
(162, 231, 'Abel Teshome', 'Traffic Officer', 'uploads/abel.jpg', 'abel.traffic@gov.et', '+251-911-231014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 18),
(163, 232, 'Birtukan Mulu', 'Land Titles Officer', 'uploads/birtukan.jpg', 'birtukan.landtitles@gov.et', '+251-911-232014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 18),
(164, 233, 'Daniel Assefa', 'Records Officer', 'uploads/daniel.jpg', 'daniel.records@gov.et', '+251-911-233014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 18),
(165, 234, 'Eden Mohammed', 'Revenue Agent', 'uploads/eden.jpg', 'eden.revenue@gov.et', '+251-911-234014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 18),
(166, 235, 'Fasika Melaku', 'Procurement Officer', 'uploads/fasika.jpg', 'fasika.procurement@gov.et', '+251-911-235014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 18),
(167, 236, 'Girma Alemu', 'Auditor', 'uploads/girma.jpg', 'girma.audit@gov.et', '+251-911-236014', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 18),
(168, 212, 'Mesfin Worku', 'Employment Officer', 'uploads/mesfin.jpg', 'mesfin.employment@gov.et', '+251-911-212015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(169, 213, 'Selamawit Abebe', 'Finance Director', 'uploads/selam.jpg', 'selam.finance@gov.et', '+251-911-213015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(170, 214, 'Tewodros Kassahun', 'Housing Manager', 'uploads/tewodros.jpg', 'tewodros.housing@gov.et', '+251-911-214015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(171, 215, 'Aster Demissie', 'HR Specialist', 'uploads/aster.jpg', 'aster.hr@gov.et', '+251-911-215015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(172, 216, 'Dawit Mekonnen', 'Security Advisor', 'uploads/dawit.jpg', 'dawit.security@gov.et', '+251-911-216015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(173, 217, 'Eyerusalem Tesfaye', 'Tourism Officer', 'uploads/eyerusalem.jpg', 'eyerusalem.tourism@gov.et', '+251-911-217015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(174, 218, 'Fitsum Girma', 'Land Officer', 'uploads/fitsum.jpg', 'fitsum.land@gov.et', '+251-911-218015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 15),
(175, 219, 'Genet Assefa', 'Construction Engineer', 'uploads/genet.jpg', 'genet.construction@gov.et', '+251-911-219015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(176, 220, 'Haben Yohannes', 'Commerce Officer', 'uploads/haben.jpg', 'haben.commerce@gov.et', '+251-911-220015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(177, 221, 'Kibrom Gebre', 'Social Affairs Officer', 'uploads/kibrom.jpg', 'kibrom.social@gov.et', '+251-911-221015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(178, 222, 'Liya Solomon', 'Revenue Officer', 'uploads/liya.jpg', 'liya.revenue@gov.et', '+251-911-222015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(179, 223, 'Mikias Lemma', 'Sports Coordinator', 'uploads/mikias.jpg', 'mikias.sports@gov.et', '+251-911-223015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(180, 224, 'Nardos Asrat', 'Urban Planner', 'uploads/nardos.jpg', 'nardos.urban@gov.et', '+251-911-224015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(181, 225, 'Omar Ahmed', 'Investment Officer', 'uploads/omar.jpg', 'omar.investment@gov.et', '+251-911-225015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(182, 226, 'Rahel Tekle', 'Property Manager', 'uploads/rahel.jpg', 'rahel.property@gov.et', '+251-911-226015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(183, 227, 'Samuel Wolde', 'Agriculture Officer', 'uploads/samuel.jpg', 'samuel.agriculture@gov.et', '+251-911-227015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(184, 228, 'Tigist Hailu', 'Disaster Manager', 'uploads/tigist.jpg', 'tigist.disaster@gov.et', '+251-911-228015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(185, 229, 'Yared Getachew', 'Education Officer', 'uploads/yared.jpg', 'yared.education@gov.et', '+251-911-229015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(186, 230, 'Zelalem Bekele', 'Licensing Officer', 'uploads/zelalem.jpg', 'zelalem.licensing@gov.et', '+251-911-230015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(187, 231, 'Abel Teshome', 'Traffic Officer', 'uploads/abel.jpg', 'abel.traffic@gov.et', '+251-911-231015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(188, 232, 'Birtukan Mulu', 'Land Titles Officer', 'uploads/birtukan.jpg', 'birtukan.landtitles@gov.et', '+251-911-232015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(189, 233, 'Daniel Assefa', 'Records Officer', 'uploads/daniel.jpg', 'daniel.records@gov.et', '+251-911-233015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(190, 234, 'Eden Mohammed', 'Revenue Agent', 'uploads/eden.jpg', 'eden.revenue@gov.et', '+251-911-234015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(191, 235, 'Fasika Melaku', 'Procurement Officer', 'uploads/fasika.jpg', 'fasika.procurement@gov.et', '+251-911-235015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(192, 236, 'Girma Alemu', 'Auditor', 'uploads/girma.jpg', 'girma.audit@gov.et', '+251-911-236015', 1, '2025-07-16 20:39:42', '2025-07-16 20:39:42', 19),
(193, 212, 'Mesfin Worku', 'Employment Officer', 'uploads/mesfin.jpg', 'mesfin.employment@gov.et', '+251-911-212014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(194, 213, 'Selamawit Abebe', 'Finance Director', 'uploads/selam.jpg', 'selam.finance@gov.et', '+251-911-213014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(195, 214, 'Tewodros Kassahun', 'Housing Manager', 'uploads/tewodros.jpg', 'tewodros.housing@gov.et', '+251-911-214014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(196, 215, 'Aster Demissie', 'HR Specialist', 'uploads/aster.jpg', 'aster.hr@gov.et', '+251-911-215014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(197, 216, 'Dawit Mekonnen', 'Security Advisor', 'uploads/dawit.jpg', 'dawit.security@gov.et', '+251-911-216014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(198, 217, 'Eyerusalem Tesfaye', 'Tourism Officer', 'uploads/eyerusalem.jpg', 'eyerusalem.tourism@gov.et', '+251-911-217014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(199, 218, 'Fitsum Girma', 'Land Officer', 'uploads/fitsum.jpg', 'fitsum.land@gov.et', '+251-911-218014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(200, 219, 'Genet Assefa', 'Construction Engineer', 'uploads/genet.jpg', 'genet.construction@gov.et', '+251-911-219014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(201, 220, 'Haben Yohannes', 'Commerce Officer', 'uploads/haben.jpg', 'haben.commerce@gov.et', '+251-911-220014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(202, 221, 'Kibrom Gebre', 'Social Affairs Officer', 'uploads/kibrom.jpg', 'kibrom.social@gov.et', '+251-911-221014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(203, 222, 'Liya Solomon', 'Revenue Officer', 'uploads/liya.jpg', 'liya.revenue@gov.et', '+251-911-222014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(204, 223, 'Mikias Lemma', 'Sports Coordinator', 'uploads/mikias.jpg', 'mikias.sports@gov.et', '+251-911-223014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(205, 224, 'Nardos Asrat', 'Urban Planner', 'uploads/nardos.jpg', 'nardos.urban@gov.et', '+251-911-224014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(206, 225, 'Omar Ahmed', 'Investment Officer', 'uploads/omar.jpg', 'omar.investment@gov.et', '+251-911-225014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(207, 226, 'Rahel Tekle', 'Property Manager', 'uploads/rahel.jpg', 'rahel.property@gov.et', '+251-911-226014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(208, 227, 'Samuel Wolde', 'Agriculture Officer', 'uploads/samuel.jpg', 'samuel.agriculture@gov.et', '+251-911-227014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(209, 228, 'Tigist Hailu', 'Disaster Manager', 'uploads/tigist.jpg', 'tigist.disaster@gov.et', '+251-911-228014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(210, 229, 'Yared Getachew', 'Education Officer', 'uploads/yared.jpg', 'yared.education@gov.et', '+251-911-229014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(211, 230, 'Zelalem Bekele', 'Licensing Officer', 'uploads/zelalem.jpg', 'zelalem.licensing@gov.et', '+251-911-230014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(212, 231, 'Abel Teshome', 'Traffic Officer', 'uploads/abel.jpg', 'abel.traffic@gov.et', '+251-911-231014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(213, 232, 'Birtukan Mulu', 'Land Titles Officer', 'uploads/birtukan.jpg', 'birtukan.landtitles@gov.et', '+251-911-232014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(214, 233, 'Daniel Assefa', 'Records Officer', 'uploads/daniel.jpg', 'daniel.records@gov.et', '+251-911-233014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(215, 234, 'Eden Mohammed', 'Revenue Agent', 'uploads/eden.jpg', 'eden.revenue@gov.et', '+251-911-234014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(216, 235, 'Fasika Melaku', 'Procurement Officer', 'uploads/fasika.jpg', 'fasika.procurement@gov.et', '+251-911-235014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 20),
(217, 236, 'Girma Alemu', 'Auditor', 'uploads/girma.jpg', 'girma.audit@gov.et', '+251-911-236014', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 14),
(218, 212, 'Mesfin Worku', 'Employment Officer', 'uploads/mesfin.jpg', 'mesfin.employment@gov.et', '+251-911-212015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(219, 213, 'Selamawit Abebe', 'Finance Director', 'uploads/selam.jpg', 'selam.finance@gov.et', '+251-911-213015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(220, 214, 'Tewodros Kassahun', 'Housing Manager', 'uploads/tewodros.jpg', 'tewodros.housing@gov.et', '+251-911-214015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(221, 215, 'Aster Demissie', 'HR Specialist', 'uploads/aster.jpg', 'aster.hr@gov.et', '+251-911-215015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(222, 216, 'Dawit Mekonnen', 'Security Advisor', 'uploads/dawit.jpg', 'dawit.security@gov.et', '+251-911-216015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(223, 217, 'Eyerusalem Tesfaye', 'Tourism Officer', 'uploads/eyerusalem.jpg', 'eyerusalem.tourism@gov.et', '+251-911-217015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(224, 218, 'Fitsum Girma', 'Land Officer', 'uploads/fitsum.jpg', 'fitsum.land@gov.et', '+251-911-218015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(225, 219, 'Genet Assefa', 'Construction Engineer', 'uploads/genet.jpg', 'genet.construction@gov.et', '+251-911-219015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(226, 220, 'Haben Yohannes', 'Commerce Officer', 'uploads/haben.jpg', 'haben.commerce@gov.et', '+251-911-220015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(227, 221, 'Kibrom Gebre', 'Social Affairs Officer', 'uploads/kibrom.jpg', 'kibrom.social@gov.et', '+251-911-221015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(228, 222, 'Liya Solomon', 'Revenue Officer', 'uploads/liya.jpg', 'liya.revenue@gov.et', '+251-911-222015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(229, 223, 'Mikias Lemma', 'Sports Coordinator', 'uploads/mikias.jpg', 'mikias.sports@gov.et', '+251-911-223015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(230, 224, 'Nardos Asrat', 'Urban Planner', 'uploads/nardos.jpg', 'nardos.urban@gov.et', '+251-911-224015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(231, 225, 'Omar Ahmed', 'Investment Officer', 'uploads/omar.jpg', 'omar.investment@gov.et', '+251-911-225015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(232, 226, 'Rahel Tekle', 'Property Manager', 'uploads/rahel.jpg', 'rahel.property@gov.et', '+251-911-226015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(233, 227, 'Samuel Wolde', 'Agriculture Officer', 'uploads/samuel.jpg', 'samuel.agriculture@gov.et', '+251-911-227015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(234, 228, 'Tigist Hailu', 'Disaster Manager', 'uploads/tigist.jpg', 'tigist.disaster@gov.et', '+251-911-228015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(235, 229, 'Yared Getachew', 'Education Officer', 'uploads/yared.jpg', 'yared.education@gov.et', '+251-911-229015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(236, 230, 'Zelalem Bekele', 'Licensing Officer', 'uploads/zelalem.jpg', 'zelalem.licensing@gov.et', '+251-911-230015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(237, 231, 'Abel Teshome', 'Traffic Officer', 'uploads/abel.jpg', 'abel.traffic@gov.et', '+251-911-231015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(238, 232, 'Birtukan Mulu', 'Land Titles Officer', 'uploads/birtukan.jpg', 'birtukan.landtitles@gov.et', '+251-911-232015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(239, 233, 'Daniel Assefa', 'Records Officer', 'uploads/daniel.jpg', 'daniel.records@gov.et', '+251-911-233015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(240, 234, 'Eden Mohammed', 'Revenue Agent', 'uploads/eden.jpg', 'eden.revenue@gov.et', '+251-911-234015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(241, 235, 'Fasika Melaku', 'Procurement Officer', 'uploads/fasika.jpg', 'fasika.procurement@gov.et', '+251-911-235015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(242, 236, 'Girma Alemu', 'Auditor', 'uploads/girma.jpg', 'girma.audit@gov.et', '+251-911-236015', 1, '2025-07-16 20:39:43', '2025-07-16 20:39:43', 21),
(243, 212, 'Mesfin Worku', 'Employment Officer', 'uploads/mesfin.jpg', 'mesfin.employment@gov.et', '+251-911-212014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(244, 213, 'Selamawit Abebe', 'Finance Director', 'uploads/selam.jpg', 'selam.finance@gov.et', '+251-911-213014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(245, 214, 'Tewodros Kassahun', 'Housing Manager', 'uploads/tewodros.jpg', 'tewodros.housing@gov.et', '+251-911-214014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(246, 215, 'Aster Demissie', 'HR Specialist', 'uploads/aster.jpg', 'aster.hr@gov.et', '+251-911-215014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(247, 216, 'Dawit Mekonnen', 'Security Advisor', 'uploads/dawit.jpg', 'dawit.security@gov.et', '+251-911-216014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(248, 217, 'Eyerusalem Tesfaye', 'Tourism Officer', 'uploads/eyerusalem.jpg', 'eyerusalem.tourism@gov.et', '+251-911-217014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(249, 218, 'Fitsum Girma', 'Land Officer', 'uploads/fitsum.jpg', 'fitsum.land@gov.et', '+251-911-218014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(250, 219, 'Genet Assefa', 'Construction Engineer', 'uploads/genet.jpg', 'genet.construction@gov.et', '+251-911-219014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(251, 220, 'Haben Yohannes', 'Commerce Officer', 'uploads/haben.jpg', 'haben.commerce@gov.et', '+251-911-220014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(252, 221, 'Kibrom Gebre', 'Social Affairs Officer', 'uploads/kibrom.jpg', 'kibrom.social@gov.et', '+251-911-221014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(253, 222, 'Liya Solomon', 'Revenue Officer', 'uploads/liya.jpg', 'liya.revenue@gov.et', '+251-911-222014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(254, 223, 'Mikias Lemma', 'Sports Coordinator', 'uploads/mikias.jpg', 'mikias.sports@gov.et', '+251-911-223014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(255, 224, 'Nardos Asrat', 'Urban Planner', 'uploads/nardos.jpg', 'nardos.urban@gov.et', '+251-911-224014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(256, 225, 'Omar Ahmed', 'Investment Officer', 'uploads/omar.jpg', 'omar.investment@gov.et', '+251-911-225014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(257, 226, 'Rahel Tekle', 'Property Manager', 'uploads/rahel.jpg', 'rahel.property@gov.et', '+251-911-226014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(258, 227, 'Samuel Wolde', 'Agriculture Officer', 'uploads/samuel.jpg', 'samuel.agriculture@gov.et', '+251-911-227014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(259, 228, 'Tigist Hailu', 'Disaster Manager', 'uploads/tigist.jpg', 'tigist.disaster@gov.et', '+251-911-228014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(260, 229, 'Yared Getachew', 'Education Officer', 'uploads/yared.jpg', 'yared.education@gov.et', '+251-911-229014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(261, 230, 'Zelalem Bekele', 'Licensing Officer', 'uploads/zelalem.jpg', 'zelalem.licensing@gov.et', '+251-911-230014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(262, 231, 'Abel Teshome', 'Traffic Officer', 'uploads/abel.jpg', 'abel.traffic@gov.et', '+251-911-231014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(263, 232, 'Birtukan Mulu', 'Land Titles Officer', 'uploads/birtukan.jpg', 'birtukan.landtitles@gov.et', '+251-911-232014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(264, 233, 'Daniel Assefa', 'Records Officer', 'uploads/daniel.jpg', 'daniel.records@gov.et', '+251-911-233014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(265, 234, 'Eden Mohammed', 'Revenue Agent', 'uploads/eden.jpg', 'eden.revenue@gov.et', '+251-911-234014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(266, 235, 'Fasika Melaku', 'Procurement Officer', 'uploads/fasika.jpg', 'fasika.procurement@gov.et', '+251-911-235014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(267, 236, 'Girma Alemu', 'Auditor', 'uploads/girma.jpg', 'girma.audit@gov.et', '+251-911-236014', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 22),
(268, 212, 'Mesfin Worku', 'Employment Officer', 'uploads/mesfin.jpg', 'mesfin.employment@gov.et', '+251-911-212015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(269, 213, 'Selamawit Abebe', 'Finance Director', 'uploads/selam.jpg', 'selam.finance@gov.et', '+251-911-213015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(270, 214, 'Tewodros Kassahun', 'Housing Manager', 'uploads/tewodros.jpg', 'tewodros.housing@gov.et', '+251-911-214015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(271, 215, 'Aster Demissie', 'HR Specialist', 'uploads/aster.jpg', 'aster.hr@gov.et', '+251-911-215015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(272, 216, 'Dawit Mekonnen', 'Security Advisor', 'uploads/dawit.jpg', 'dawit.security@gov.et', '+251-911-216015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(273, 217, 'Eyerusalem Tesfaye', 'Tourism Officer', 'uploads/eyerusalem.jpg', 'eyerusalem.tourism@gov.et', '+251-911-217015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(274, 218, 'Fitsum Girma', 'Land Officer', 'uploads/fitsum.jpg', 'fitsum.land@gov.et', '+251-911-218015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(275, 219, 'Genet Assefa', 'Construction Engineer', 'uploads/genet.jpg', 'genet.construction@gov.et', '+251-911-219015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(276, 220, 'Haben Yohannes', 'Commerce Officer', 'uploads/haben.jpg', 'haben.commerce@gov.et', '+251-911-220015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(277, 221, 'Kibrom Gebre', 'Social Affairs Officer', 'uploads/kibrom.jpg', 'kibrom.social@gov.et', '+251-911-221015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(278, 222, 'Liya Solomon', 'Revenue Officer', 'uploads/liya.jpg', 'liya.revenue@gov.et', '+251-911-222015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(279, 223, 'Mikias Lemma', 'Sports Coordinator', 'uploads/mikias.jpg', 'mikias.sports@gov.et', '+251-911-223015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(280, 224, 'Nardos Asrat', 'Urban Planner', 'uploads/nardos.jpg', 'nardos.urban@gov.et', '+251-911-224015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(281, 225, 'Omar Ahmed', 'Investment Officer', 'uploads/omar.jpg', 'omar.investment@gov.et', '+251-911-225015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(282, 226, 'Rahel Tekle', 'Property Manager', 'uploads/rahel.jpg', 'rahel.property@gov.et', '+251-911-226015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(283, 227, 'Samuel Wolde', 'Agriculture Officer', 'uploads/samuel.jpg', 'samuel.agriculture@gov.et', '+251-911-227015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(284, 228, 'Tigist Hailu', 'Disaster Manager', 'uploads/tigist.jpg', 'tigist.disaster@gov.et', '+251-911-228015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(285, 229, 'Yared Getachew', 'Education Officer', 'uploads/yared.jpg', 'yared.education@gov.et', '+251-911-229015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(286, 230, 'Zelalem Bekele', 'Licensing Officer', 'uploads/zelalem.jpg', 'zelalem.licensing@gov.et', '+251-911-230015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(287, 231, 'Abel Teshome', 'Traffic Officer', 'uploads/abel.jpg', 'abel.traffic@gov.et', '+251-911-231015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(288, 232, 'Birtukan Mulu', 'Land Titles Officer', 'uploads/birtukan.jpg', 'birtukan.landtitles@gov.et', '+251-911-232015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(289, 233, 'Daniel Assefa', 'Records Officer', 'uploads/daniel.jpg', 'daniel.records@gov.et', '+251-911-233015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(290, 234, 'Eden Mohammed', 'Revenue Agent', 'uploads/eden.jpg', 'eden.revenue@gov.et', '+251-911-234015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(291, 235, 'Fasika Melaku', 'Procurement Officer', 'uploads/fasika.jpg', 'fasika.procurement@gov.et', '+251-911-235015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23),
(292, 236, 'Girma Alemu', 'Auditor', 'uploads/girma.jpg', 'girma.audit@gov.et', '+251-911-236015', 1, '2025-07-16 20:43:28', '2025-07-16 20:43:28', 23);

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `feedback_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `office_id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `status` enum('pending','in_progress','resolved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`feedback_id`, `user_id`, `office_id`, `employee_id`, `title`, `message`, `rating`, `status`, `created_at`, `updated_at`) VALUES
(5, NULL, 212, 40, 'Test Title', 'This is a test feedback message.', 5, 'pending', '2025-07-17 21:17:10', '2025-07-17 21:17:10'),
(14, NULL, 220, 51, 'bad attitude', 'http://localhost/phpmyadmin/index.php?route=/sql&pos=0&db=gsf&table=feedback', 4, 'pending', '2025-07-19 19:44:46', '2025-07-19 19:44:46'),
(15, NULL, 216, 272, 'ካድችም ችምስድች', 'ችምስድክልች ችስምችም ችምስልምች ችስምችል ስልችስ ምጽስልችም ምስችልም ጽም፣ስልችምችምክልክምች ምጽችስልምች ጽምስልችም፣ ምጽችስልችም', 4, 'pending', '2025-07-19 20:11:27', '2025-07-19 20:11:27'),
(16, NULL, 220, 76, 'musna ', 'tebelashtual betam musna lemdual ', 1, 'pending', '2025-07-21 13:32:16', '2025-07-21 13:32:16');

-- --------------------------------------------------------

--
-- Table structure for table `offices`
--

CREATE TABLE `offices` (
  `office_id` int(11) NOT NULL,
  `subcity_id` int(11) NOT NULL,
  `office_name` varchar(100) NOT NULL,
  `office_desc` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `offices`
--

INSERT INTO `offices` (`office_id`, `subcity_id`, `office_name`, `office_desc`, `created_at`, `updated_at`) VALUES
(212, 14, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and industrial activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(213, 14, 'Office of Finance', 'Handles financial matters and budgeting', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(214, 14, 'Office of Housing Development and Administration', 'Manages housing development and administration', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(215, 14, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(216, 14, 'Office of Peace and Security Administration', 'Manages peace and security matters', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(217, 14, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(218, 14, 'Office of Land Development and Administration', 'Manages land development and administration', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(219, 14, 'Office of Design and Construction Works', 'Oversees design and construction projects', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(220, 14, 'Office of Commerce', 'Manages commercial activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(221, 14, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(222, 14, 'Office of Revenue', 'Manages revenue collection', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(223, 14, 'Office of Youth Sports', 'Promotes youth and sports activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(224, 14, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(225, 14, 'Office of Planning and Development Commission', 'Oversees planning and development', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(226, 14, 'Office of Investment Commission', 'Manages investment activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(227, 14, 'Office of State Property Management Authority', 'Manages state properties', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(228, 14, 'Office of Farmers and Urban Agriculture Development Commission', 'Supports farmers and urban agriculture', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(229, 14, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(230, 14, 'Office of the Education and Training Quality Assurance Authority', 'Ensures education quality', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(231, 14, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(232, 14, 'Office of the Traffic Management Agency', 'Oversees traffic management', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(233, 14, 'Office of the Land Titles and Information Agency', 'Manages land titles and information', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(234, 14, 'Office of the Vital Records and Information Agency', 'Handles vital records', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(235, 14, 'Office of the Revenue Agency', 'Manages revenue collection', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(236, 14, 'Office of the Government Procurement and Disposal Service', 'Handles government procurement', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(237, 14, 'Office of the Auditor General', 'Conducts government audits', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(238, 15, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and industrial activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(239, 15, 'Office of Finance', 'Handles financial matters and budgeting', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(240, 15, 'Office of Housing Development and Administration', 'Manages housing development and administration', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(241, 15, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(242, 15, 'Office of Peace and Security Administration', 'Manages peace and security matters', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(243, 15, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(244, 15, 'Office of Land Development and Administration', 'Manages land development and administration', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(245, 15, 'Office of Design and Construction Works', 'Oversees design and construction projects', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(246, 15, 'Office of Commerce', 'Manages commercial activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(247, 15, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(248, 15, 'Office of Revenue', 'Manages revenue collection', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(249, 15, 'Office of Youth Sports', 'Promotes youth and sports activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(250, 15, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(251, 15, 'Office of Planning and Development Commission', 'Oversees planning and development', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(252, 15, 'Office of Investment Commission', 'Manages investment activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(253, 15, 'Office of State Property Management Authority', 'Manages state properties', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(254, 15, 'Office of Farmers and Urban Agriculture Development Commission', 'Supports farmers and urban agriculture', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(255, 15, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(256, 15, 'Office of the Education and Training Quality Assurance Authority', 'Ensures education quality', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(257, 15, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(258, 15, 'Office of the Traffic Management Agency', 'Oversees traffic management', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(259, 15, 'Office of the Land Titles and Information Agency', 'Manages land titles and information', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(260, 15, 'Office of the Vital Records and Information Agency', 'Handles vital records', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(261, 15, 'Office of the Revenue Agency', 'Manages revenue collection', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(262, 15, 'Office of the Government Procurement and Disposal Service', 'Handles government procurement', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(263, 15, 'Office of the Auditor General', 'Conducts government audits', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(264, 16, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and industrial activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(265, 16, 'Office of Finance', 'Handles financial matters and budgeting', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(266, 16, 'Office of Housing Development and Administration', 'Manages housing development and administration', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(267, 16, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(268, 16, 'Office of Peace and Security Administration', 'Manages peace and security matters', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(269, 16, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(270, 16, 'Office of Land Development and Administration', 'Manages land development and administration', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(271, 16, 'Office of Design and Construction Works', 'Oversees design and construction projects', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(272, 16, 'Office of Commerce', 'Manages commercial activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(273, 16, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(274, 16, 'Office of Revenue', 'Manages revenue collection', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(275, 16, 'Office of Youth Sports', 'Promotes youth and sports activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(276, 16, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(277, 16, 'Office of Planning and Development Commission', 'Oversees planning and development', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(278, 16, 'Office of Investment Commission', 'Manages investment activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(279, 16, 'Office of State Property Management Authority', 'Manages state properties', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(280, 16, 'Office of Farmers and Urban Agriculture Development Commission', 'Supports farmers and urban agriculture', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(281, 16, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(282, 16, 'Office of the Education and Training Quality Assurance Authority', 'Ensures education quality', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(283, 16, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(284, 16, 'Office of the Traffic Management Agency', 'Oversees traffic management', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(285, 16, 'Office of the Land Titles and Information Agency', 'Manages land titles and information', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(286, 16, 'Office of the Vital Records and Information Agency', 'Handles vital records', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(287, 16, 'Office of the Revenue Agency', 'Manages revenue collection', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(288, 16, 'Office of the Government Procurement and Disposal Service', 'Handles government procurement', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(289, 16, 'Office of the Auditor General', 'Conducts government audits', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(290, 17, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and industrial activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(291, 17, 'Office of Finance', 'Handles financial matters and budgeting', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(292, 17, 'Office of Housing Development and Administration', 'Manages housing development and administration', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(293, 17, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(294, 17, 'Office of Peace and Security Administration', 'Manages peace and security matters', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(295, 17, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(296, 17, 'Office of Land Development and Administration', 'Manages land development and administration', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(297, 17, 'Office of Design and Construction Works', 'Oversees design and construction projects', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(298, 17, 'Office of Commerce', 'Manages commercial activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(299, 17, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(300, 17, 'Office of Revenue', 'Manages revenue collection', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(301, 17, 'Office of Youth Sports', 'Promotes youth and sports activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(302, 17, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(303, 17, 'Office of Planning and Development Commission', 'Oversees planning and development', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(304, 17, 'Office of Investment Commission', 'Manages investment activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(305, 17, 'Office of State Property Management Authority', 'Manages state properties', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(306, 17, 'Office of Farmers and Urban Agriculture Development Commission', 'Supports farmers and urban agriculture', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(307, 17, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(308, 17, 'Office of the Education and Training Quality Assurance Authority', 'Ensures education quality', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(309, 17, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(310, 17, 'Office of the Traffic Management Agency', 'Oversees traffic management', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(311, 17, 'Office of the Land Titles and Information Agency', 'Manages land titles and information', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(312, 17, 'Office of the Vital Records and Information Agency', 'Handles vital records', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(313, 17, 'Office of the Revenue Agency', 'Manages revenue collection', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(314, 17, 'Office of the Government Procurement and Disposal Service', 'Handles government procurement', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(315, 17, 'Office of the Auditor General', 'Conducts government audits', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(316, 18, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and industrial activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(317, 18, 'Office of Finance', 'Handles financial matters and budgeting', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(318, 18, 'Office of Housing Development and Administration', 'Manages housing development and administration', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(319, 18, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(320, 18, 'Office of Peace and Security Administration', 'Manages peace and security matters', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(321, 18, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(322, 18, 'Office of Land Development and Administration', 'Manages land development and administration', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(323, 18, 'Office of Design and Construction Works', 'Oversees design and construction projects', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(324, 18, 'Office of Commerce', 'Manages commercial activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(325, 18, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(326, 18, 'Office of Revenue', 'Manages revenue collection', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(327, 18, 'Office of Youth Sports', 'Promotes youth and sports activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(328, 18, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(329, 18, 'Office of Planning and Development Commission', 'Oversees planning and development', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(330, 18, 'Office of Investment Commission', 'Manages investment activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(331, 18, 'Office of State Property Management Authority', 'Manages state properties', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(332, 18, 'Office of Farmers and Urban Agriculture Development Commission', 'Supports farmers and urban agriculture', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(333, 18, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(334, 18, 'Office of the Education and Training Quality Assurance Authority', 'Ensures education quality', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(335, 18, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(336, 18, 'Office of the Traffic Management Agency', 'Oversees traffic management', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(337, 18, 'Office of the Land Titles and Information Agency', 'Manages land titles and information', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(338, 18, 'Office of the Vital Records and Information Agency', 'Handles vital records', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(339, 18, 'Office of the Revenue Agency', 'Manages revenue collection', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(340, 18, 'Office of the Government Procurement and Disposal Service', 'Handles government procurement', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(341, 18, 'Office of the Auditor General', 'Conducts government audits', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(342, 19, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and industrial activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(343, 19, 'Office of Finance', 'Handles financial matters and budgeting', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(344, 19, 'Office of Housing Development and Administration', 'Manages housing development and administration', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(345, 19, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(346, 19, 'Office of Peace and Security Administration', 'Manages peace and security matters', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(347, 19, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(348, 19, 'Office of Land Development and Administration', 'Manages land development and administration', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(349, 19, 'Office of Design and Construction Works', 'Oversees design and construction projects', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(350, 19, 'Office of Commerce', 'Manages commercial activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(351, 19, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(352, 19, 'Office of Revenue', 'Manages revenue collection', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(353, 19, 'Office of Youth Sports', 'Promotes youth and sports activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(354, 19, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(355, 19, 'Office of Planning and Development Commission', 'Oversees planning and development', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(356, 19, 'Office of Investment Commission', 'Manages investment activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(357, 19, 'Office of State Property Management Authority', 'Manages state properties', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(358, 19, 'Office of Farmers and Urban Agriculture Development Commission', 'Supports farmers and urban agriculture', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(359, 19, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(360, 19, 'Office of the Education and Training Quality Assurance Authority', 'Ensures education quality', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(361, 19, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(362, 19, 'Office of the Traffic Management Agency', 'Oversees traffic management', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(363, 19, 'Office of the Land Titles and Information Agency', 'Manages land titles and information', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(364, 19, 'Office of the Vital Records and Information Agency', 'Handles vital records', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(365, 19, 'Office of the Revenue Agency', 'Manages revenue collection', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(366, 19, 'Office of the Government Procurement and Disposal Service', 'Handles government procurement', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(367, 19, 'Office of the Auditor General', 'Conducts government audits', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(368, 20, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and industrial activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(369, 20, 'Office of Finance', 'Handles financial matters and budgeting', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(370, 20, 'Office of Housing Development and Administration', 'Manages housing development and administration', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(371, 20, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(372, 20, 'Office of Peace and Security Administration', 'Manages peace and security matters', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(373, 20, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(374, 20, 'Office of Land Development and Administration', 'Manages land development and administration', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(375, 20, 'Office of Design and Construction Works', 'Oversees design and construction projects', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(376, 20, 'Office of Commerce', 'Manages commercial activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(377, 20, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(378, 20, 'Office of Revenue', 'Manages revenue collection', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(379, 20, 'Office of Youth Sports', 'Promotes youth and sports activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(380, 20, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(381, 20, 'Office of Planning and Development Commission', 'Oversees planning and development', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(382, 20, 'Office of Investment Commission', 'Manages investment activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(383, 20, 'Office of State Property Management Authority', 'Manages state properties', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(384, 20, 'Office of Farmers and Urban Agriculture Development Commission', 'Supports farmers and urban agriculture', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(385, 20, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(386, 20, 'Office of the Education and Training Quality Assurance Authority', 'Ensures education quality', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(387, 20, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(388, 20, 'Office of the Traffic Management Agency', 'Oversees traffic management', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(389, 20, 'Office of the Land Titles and Information Agency', 'Manages land titles and information', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(390, 20, 'Office of the Vital Records and Information Agency', 'Handles vital records', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(391, 20, 'Office of the Revenue Agency', 'Manages revenue collection', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(392, 20, 'Office of the Government Procurement and Disposal Service', 'Handles government procurement', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(393, 20, 'Office of the Auditor General', 'Conducts government audits', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(394, 21, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and industrial activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(395, 21, 'Office of Finance', 'Handles financial matters and budgeting', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(396, 21, 'Office of Housing Development and Administration', 'Manages housing development and administration', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(397, 21, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(398, 21, 'Office of Peace and Security Administration', 'Manages peace and security matters', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(399, 21, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(400, 21, 'Office of Land Development and Administration', 'Manages land development and administration', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(401, 21, 'Office of Design and Construction Works', 'Oversees design and construction projects', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(402, 21, 'Office of Commerce', 'Manages commercial activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(403, 21, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(404, 21, 'Office of Revenue', 'Manages revenue collection', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(405, 21, 'Office of Youth Sports', 'Promotes youth and sports activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(406, 21, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(407, 21, 'Office of Planning and Development Commission', 'Oversees planning and development', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(408, 21, 'Office of Investment Commission', 'Manages investment activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(409, 21, 'Office of State Property Management Authority', 'Manages state properties', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(410, 21, 'Office of Farmers and Urban Agriculture Development Commission', 'Supports farmers and urban agriculture', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(411, 21, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(412, 21, 'Office of the Education and Training Quality Assurance Authority', 'Ensures education quality', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(413, 21, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(414, 21, 'Office of the Traffic Management Agency', 'Oversees traffic management', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(415, 21, 'Office of the Land Titles and Information Agency', 'Manages land titles and information', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(416, 21, 'Office of the Vital Records and Information Agency', 'Handles vital records', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(417, 21, 'Office of the Revenue Agency', 'Manages revenue collection', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(418, 21, 'Office of the Government Procurement and Disposal Service', 'Handles government procurement', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(419, 21, 'Office of the Auditor General', 'Conducts government audits', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(420, 22, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and industrial activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(421, 22, 'Office of Finance', 'Handles financial matters and budgeting', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(422, 22, 'Office of Housing Development and Administration', 'Manages housing development and administration', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(423, 22, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(424, 22, 'Office of Peace and Security Administration', 'Manages peace and security matters', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(425, 22, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(426, 22, 'Office of Land Development and Administration', 'Manages land development and administration', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(427, 22, 'Office of Design and Construction Works', 'Oversees design and construction projects', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(428, 22, 'Office of Commerce', 'Manages commercial activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(429, 22, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(430, 22, 'Office of Revenue', 'Manages revenue collection', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(431, 22, 'Office of Youth Sports', 'Promotes youth and sports activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(432, 22, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(433, 22, 'Office of Planning and Development Commission', 'Oversees planning and development', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(434, 22, 'Office of Investment Commission', 'Manages investment activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(435, 22, 'Office of State Property Management Authority', 'Manages state properties', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(436, 22, 'Office of Farmers and Urban Agriculture Development Commission', 'Supports farmers and urban agriculture', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(437, 22, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(438, 22, 'Office of the Education and Training Quality Assurance Authority', 'Ensures education quality', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(439, 22, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(440, 22, 'Office of the Traffic Management Agency', 'Oversees traffic management', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(441, 22, 'Office of the Land Titles and Information Agency', 'Manages land titles and information', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(442, 22, 'Office of the Vital Records and Information Agency', 'Handles vital records', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(443, 22, 'Office of the Revenue Agency', 'Manages revenue collection', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(444, 22, 'Office of the Government Procurement and Disposal Service', 'Handles government procurement', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(445, 22, 'Office of the Auditor General', 'Conducts government audits', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(446, 23, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and industrial activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(447, 23, 'Office of Finance', 'Handles financial matters and budgeting', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(448, 23, 'Office of Housing Development and Administration', 'Manages housing development and administration', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(449, 23, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(450, 23, 'Office of Peace and Security Administration', 'Manages peace and security matters', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(451, 23, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(452, 23, 'Office of Land Development and Administration', 'Manages land development and administration', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(453, 23, 'Office of Design and Construction Works', 'Oversees design and construction projects', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(454, 23, 'Office of Commerce', 'Manages commercial activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(455, 23, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(456, 23, 'Office of Revenue', 'Manages revenue collection', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(457, 23, 'Office of Youth Sports', 'Promotes youth and sports activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(458, 23, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(459, 23, 'Office of Planning and Development Commission', 'Oversees planning and development', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(460, 23, 'Office of Investment Commission', 'Manages investment activities', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(461, 23, 'Office of State Property Management Authority', 'Manages state properties', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(462, 23, 'Office of Farmers and Urban Agriculture Development Commission', 'Supports farmers and urban agriculture', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(463, 23, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(464, 23, 'Office of the Education and Training Quality Assurance Authority', 'Ensures education quality', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(465, 23, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(466, 23, 'Office of the Traffic Management Agency', 'Oversees traffic management', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(467, 23, 'Office of the Land Titles and Information Agency', 'Manages land titles and information', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(468, 23, 'Office of the Vital Records and Information Agency', 'Handles vital records', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(469, 23, 'Office of the Revenue Agency', 'Manages revenue collection', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(470, 23, 'Office of the Government Procurement and Disposal Service', 'Handles government procurement', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(471, 23, 'Office of the Auditor General', 'Conducts government audits', '2025-06-15 17:14:09', '2025-06-15 17:14:09'),
(475, 15, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and ind...', '2025-07-04 20:52:08', '2025-07-04 20:52:08'),
(476, 15, 'Office of Finance', 'Handles financial matters and budgeting', '2025-07-04 20:52:08', '2025-07-04 20:52:08'),
(477, 15, 'Office of Housing Development and Administration', 'Manages housing development and administration', '2025-07-04 20:52:08', '2025-07-04 20:52:08'),
(478, 15, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development', '2025-07-04 20:52:08', '2025-07-04 20:52:08'),
(479, 15, 'Office of Peace and Security Administration', 'Manages peace and security matters', '2025-07-04 20:52:08', '2025-07-04 20:52:08'),
(480, 15, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism', '2025-07-04 20:52:08', '2025-07-04 20:52:08'),
(481, 15, 'Office of Land Development and Administration', 'Manages land development and administration', '2025-07-04 20:52:08', '2025-07-04 20:52:08'),
(482, 15, 'Office of Design and Construction Works', 'Oversees design and construction projects', '2025-07-04 20:52:08', '2025-07-04 20:52:08'),
(483, 15, 'Office of Commerce', 'Manages commercial activities', '2025-07-04 20:52:08', '2025-07-04 20:52:08'),
(484, 15, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare', '2025-07-04 20:52:08', '2025-07-04 20:52:08'),
(485, 15, 'Office of Revenue', 'Manages revenue collection', '2025-07-04 20:52:08', '2025-07-04 20:52:08'),
(486, 15, 'Office of Youth Sports', 'Promotes youth and sports activities', '2025-07-04 20:52:08', '2025-07-04 20:52:08'),
(487, 15, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification', '2025-07-04 20:52:08', '2025-07-04 20:52:08'),
(488, 15, 'Office of Planning and Development Commission', 'Oversees planning and development', '2025-07-04 20:52:08', '2025-07-04 20:52:08'),
(489, 15, 'Office of Investment Commission', 'Manages investment activities', '2025-07-04 20:52:08', '2025-07-04 20:52:08'),
(490, 15, 'Office of State Property Management Authority', 'Manages state properties', '2025-07-04 20:52:08', '2025-07-04 20:52:08'),
(491, 15, 'Office of Farmers and Urban Agriculture Development', 'Supports farmers and urban agriculture', '2025-07-04 20:52:08', '2025-07-04 20:52:08'),
(492, 15, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk', '2025-07-04 20:52:08', '2025-07-04 20:52:08'),
(493, 15, 'Office of the Education and Training Quality Assurance Agency', 'Ensures education quality', '2025-07-04 20:52:08', '2025-07-04 20:52:08'),
(494, 15, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing', '2025-07-04 20:52:09', '2025-07-04 20:52:09'),
(495, 15, 'Office of the Traffic Management Agency', 'Oversees traffic management', '2025-07-04 20:52:09', '2025-07-04 20:52:09'),
(496, 15, 'Office of the Land Titles and Information Agency', 'Manages land titles and information', '2025-07-04 20:52:09', '2025-07-04 20:52:09'),
(497, 15, 'Office of the Vital Records and Information Agency', 'Handles vital records', '2025-07-04 20:52:09', '2025-07-04 20:52:09'),
(498, 15, 'Office of the Revenue Agency', 'Manages revenue collection', '2025-07-04 20:52:09', '2025-07-04 20:52:09'),
(499, 15, 'Office of the Government Procurement and Disposal Agency', 'Handles government procurement', '2025-07-04 20:52:09', '2025-07-04 20:52:09'),
(500, 16, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and ind...', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(501, 16, 'Office of Finance', 'Handles financial matters and budgeting', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(502, 16, 'Office of Housing Development and Administration', 'Manages housing development and administration', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(503, 16, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(504, 16, 'Office of Peace and Security Administration', 'Manages peace and security matters', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(505, 16, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(506, 16, 'Office of Land Development and Administration', 'Manages land development and administration', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(507, 16, 'Office of Design and Construction Works', 'Oversees design and construction projects', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(508, 16, 'Office of Commerce', 'Manages commercial activities', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(509, 16, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(510, 16, 'Office of Revenue', 'Manages revenue collection', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(511, 16, 'Office of Youth Sports', 'Promotes youth and sports activities', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(512, 16, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(513, 16, 'Office of Planning and Development Commission', 'Oversees planning and development', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(514, 16, 'Office of Investment Commission', 'Manages investment activities', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(515, 16, 'Office of State Property Management Authority', 'Manages state properties', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(516, 16, 'Office of Farmers and Urban Agriculture Development', 'Supports farmers and urban agriculture', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(517, 16, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(518, 16, 'Office of the Education and Training Quality Assurance Agency', 'Ensures education quality', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(519, 16, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(520, 16, 'Office of the Traffic Management Agency', 'Oversees traffic management', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(521, 16, 'Office of the Land Titles and Information Agency', 'Manages land titles and information', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(522, 16, 'Office of the Vital Records and Information Agency', 'Handles vital records', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(523, 16, 'Office of the Revenue Agency', 'Manages revenue collection', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(524, 16, 'Office of the Government Procurement and Disposal Agency', 'Handles government procurement', '2025-07-04 20:54:07', '2025-07-04 20:54:07'),
(525, 17, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and ind...', '2025-07-04 20:55:25', '2025-07-04 20:55:25'),
(526, 17, 'Office of Finance', 'Handles financial matters and budgeting', '2025-07-04 20:55:25', '2025-07-04 20:55:25'),
(527, 17, 'Office of Housing Development and Administration', 'Manages housing development and administration', '2025-07-04 20:55:25', '2025-07-04 20:55:25'),
(528, 17, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development', '2025-07-04 20:55:25', '2025-07-04 20:55:25'),
(529, 17, 'Office of Peace and Security Administration', 'Manages peace and security matters', '2025-07-04 20:55:25', '2025-07-04 20:55:25'),
(530, 17, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism', '2025-07-04 20:55:25', '2025-07-04 20:55:25'),
(531, 17, 'Office of Land Development and Administration', 'Manages land development and administration', '2025-07-04 20:55:25', '2025-07-04 20:55:25'),
(532, 17, 'Office of Design and Construction Works', 'Oversees design and construction projects', '2025-07-04 20:55:26', '2025-07-04 20:55:26'),
(533, 17, 'Office of Commerce', 'Manages commercial activities', '2025-07-04 20:55:26', '2025-07-04 20:55:26'),
(534, 17, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare', '2025-07-04 20:55:26', '2025-07-04 20:55:26'),
(535, 17, 'Office of Revenue', 'Manages revenue collection', '2025-07-04 20:55:26', '2025-07-04 20:55:26'),
(536, 17, 'Office of Youth Sports', 'Promotes youth and sports activities', '2025-07-04 20:55:26', '2025-07-04 20:55:26'),
(537, 17, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification', '2025-07-04 20:55:26', '2025-07-04 20:55:26'),
(538, 17, 'Office of Planning and Development Commission', 'Oversees planning and development', '2025-07-04 20:55:26', '2025-07-04 20:55:26'),
(539, 17, 'Office of Investment Commission', 'Manages investment activities', '2025-07-04 20:55:26', '2025-07-04 20:55:26'),
(540, 17, 'Office of State Property Management Authority', 'Manages state properties', '2025-07-04 20:55:26', '2025-07-04 20:55:26'),
(541, 17, 'Office of Farmers and Urban Agriculture Development', 'Supports farmers and urban agriculture', '2025-07-04 20:55:26', '2025-07-04 20:55:26'),
(542, 17, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk', '2025-07-04 20:55:26', '2025-07-04 20:55:26'),
(543, 17, 'Office of the Education and Training Quality Assurance Agency', 'Ensures education quality', '2025-07-04 20:55:26', '2025-07-04 20:55:26'),
(544, 17, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing', '2025-07-04 20:55:26', '2025-07-04 20:55:26'),
(545, 17, 'Office of the Traffic Management Agency', 'Oversees traffic management', '2025-07-04 20:55:26', '2025-07-04 20:55:26'),
(546, 17, 'Office of the Land Titles and Information Agency', 'Manages land titles and information', '2025-07-04 20:55:26', '2025-07-04 20:55:26'),
(547, 17, 'Office of the Vital Records and Information Agency', 'Handles vital records', '2025-07-04 20:55:26', '2025-07-04 20:55:26'),
(548, 17, 'Office of the Revenue Agency', 'Manages revenue collection', '2025-07-04 20:55:26', '2025-07-04 20:55:26'),
(549, 17, 'Office of the Government Procurement and Disposal Agency', 'Handles government procurement', '2025-07-04 20:55:26', '2025-07-04 20:55:26'),
(550, 15, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and ind...', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(551, 15, 'Office of Finance', 'Handles financial matters and budgeting', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(552, 15, 'Office of Housing Development and Administration', 'Manages housing development and administration', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(553, 15, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(554, 15, 'Office of Peace and Security Administration', 'Manages peace and security matters', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(555, 15, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(556, 15, 'Office of Land Development and Administration', 'Manages land development and administration', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(557, 15, 'Office of Design and Construction Works', 'Oversees design and construction projects', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(558, 15, 'Office of Commerce', 'Manages commercial activities', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(559, 15, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(560, 15, 'Office of Revenue', 'Manages revenue collection', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(561, 15, 'Office of Youth Sports', 'Promotes youth and sports activities', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(562, 15, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(563, 15, 'Office of Planning and Development Commission', 'Oversees planning and development', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(564, 15, 'Office of Investment Commission', 'Manages investment activities', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(565, 15, 'Office of State Property Management Authority', 'Manages state properties', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(566, 15, 'Office of Farmers and Urban Agriculture Development', 'Supports farmers and urban agriculture', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(567, 15, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(568, 15, 'Office of the Education and Training Quality Assurance Agency', 'Ensures education quality', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(569, 15, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(570, 15, 'Office of the Traffic Management Agency', 'Oversees traffic management', '2025-07-04 20:57:09', '2025-07-04 20:57:09');
INSERT INTO `offices` (`office_id`, `subcity_id`, `office_name`, `office_desc`, `created_at`, `updated_at`) VALUES
(571, 15, 'Office of the Land Titles and Information Agency', 'Manages land titles and information', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(572, 15, 'Office of the Vital Records and Information Agency', 'Handles vital records', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(573, 15, 'Office of the Revenue Agency', 'Manages revenue collection', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(574, 15, 'Office of the Government Procurement and Disposal Agency', 'Handles government procurement', '2025-07-04 20:57:09', '2025-07-04 20:57:09'),
(575, 15, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and ind...', '2025-07-04 21:03:39', '2025-07-04 21:03:39'),
(576, 15, 'Office of Finance', 'Handles financial matters and budgeting', '2025-07-04 21:03:39', '2025-07-04 21:03:39'),
(577, 15, 'Office of Housing Development and Administration', 'Manages housing development and administration', '2025-07-04 21:03:39', '2025-07-04 21:03:39'),
(578, 15, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development', '2025-07-04 21:03:39', '2025-07-04 21:03:39'),
(579, 15, 'Office of Peace and Security Administration', 'Manages peace and security matters', '2025-07-04 21:03:39', '2025-07-04 21:03:39'),
(580, 15, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism', '2025-07-04 21:03:39', '2025-07-04 21:03:39'),
(581, 15, 'Office of Land Development and Administration', 'Manages land development and administration', '2025-07-04 21:03:39', '2025-07-04 21:03:39'),
(582, 15, 'Office of Design and Construction Works', 'Oversees design and construction projects', '2025-07-04 21:03:39', '2025-07-04 21:03:39'),
(583, 15, 'Office of Commerce', 'Manages commercial activities', '2025-07-04 21:03:39', '2025-07-04 21:03:39'),
(584, 15, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare', '2025-07-04 21:03:39', '2025-07-04 21:03:39'),
(585, 15, 'Office of Revenue', 'Manages revenue collection', '2025-07-04 21:03:39', '2025-07-04 21:03:39'),
(586, 15, 'Office of Youth Sports', 'Promotes youth and sports activities', '2025-07-04 21:03:39', '2025-07-04 21:03:39'),
(587, 15, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification', '2025-07-04 21:03:39', '2025-07-04 21:03:39'),
(588, 15, 'Office of Planning and Development Commission', 'Oversees planning and development', '2025-07-04 21:03:39', '2025-07-04 21:03:39'),
(589, 15, 'Office of Investment Commission', 'Manages investment activities', '2025-07-04 21:03:39', '2025-07-04 21:03:39'),
(590, 15, 'Office of State Property Management Authority', 'Manages state properties', '2025-07-04 21:03:39', '2025-07-04 21:03:39'),
(591, 15, 'Office of Farmers and Urban Agriculture Development', 'Supports farmers and urban agriculture', '2025-07-04 21:03:39', '2025-07-04 21:03:39'),
(592, 15, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk', '2025-07-04 21:03:39', '2025-07-04 21:03:39'),
(593, 15, 'Office of the Education and Training Quality Assurance Agency', 'Ensures education quality', '2025-07-04 21:03:40', '2025-07-04 21:03:40'),
(594, 15, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing', '2025-07-04 21:03:40', '2025-07-04 21:03:40'),
(595, 15, 'Office of the Traffic Management Agency', 'Oversees traffic management', '2025-07-04 21:03:40', '2025-07-04 21:03:40'),
(596, 15, 'Office of the Land Titles and Information Agency', 'Manages land titles and information', '2025-07-04 21:03:40', '2025-07-04 21:03:40'),
(597, 15, 'Office of the Vital Records and Information Agency', 'Handles vital records', '2025-07-04 21:03:40', '2025-07-04 21:03:40'),
(598, 15, 'Office of the Revenue Agency', 'Manages revenue collection', '2025-07-04 21:03:40', '2025-07-04 21:03:40'),
(599, 15, 'Office of the Government Procurement and Disposal Agency', 'Handles government procurement', '2025-07-04 21:03:40', '2025-07-04 21:03:40');

-- --------------------------------------------------------

--
-- Table structure for table `subcities`
--

CREATE TABLE `subcities` (
  `subcity_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subcities`
--

INSERT INTO `subcities` (`subcity_id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(14, 'Addis Ketema', 'Located in the northwestern part of the city, near the center. Known for its historical significance and commercial activities.', '2025-06-14 14:10:36', '2025-06-14 14:10:36'),
(15, 'Akaky Kaliti', 'Located in the southern part of the city, known for its industrial zones and residential areas.', '2025-06-14 14:10:36', '2025-06-14 14:10:36'),
(16, 'Arada', 'Situated in the northern area of the city, close to the center. Known for its cultural heritage and historical sites.', '2025-06-14 14:10:36', '2025-06-14 14:10:36'),
(17, 'Bole', 'Known for Bole International Airport and modern developments. A major commercial and diplomatic hub of the city.', '2025-06-14 14:10:36', '2025-06-14 14:10:36'),
(18, 'Gullele', 'Located in the northern area of the city, known for its residential areas and educational institutions.', '2025-06-14 14:10:36', '2025-06-14 14:10:36'),
(19, 'Kirkos', 'A central sub-city in Addis Ababa, known for its administrative offices and commercial activities.', '2025-06-14 14:10:36', '2025-06-14 14:10:36'),
(20, 'Kolfe Keranio', 'Located in the northwestern part of the city, known for its residential areas and local markets.', '2025-06-14 14:10:36', '2025-06-14 14:10:36'),
(21, 'Lideta', 'A sub-city in Addis Ababa known for its commercial areas and residential neighborhoods.', '2025-06-14 14:10:36', '2025-06-14 14:10:36'),
(22, 'Nifas Silk-Lafto', 'Another sub-city in the city, known for its residential areas and local businesses.', '2025-06-14 14:10:36', '2025-06-14 14:10:36'),
(23, 'Yeka', 'Located in the northern area of the city, known for its residential areas and diplomatic missions.', '2025-06-14 14:10:36', '2025-06-14 14:10:36');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `role` enum('user','government_admin','system_admin') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `email_verified` tinyint(1) DEFAULT 0,
  `verification_code` varchar(6) DEFAULT NULL,
  `verification_code_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `password_hash`, `full_name`, `role`, `created_at`, `updated_at`, `email_verified`, `verification_code`, `verification_code_expires`) VALUES
(1, 'bereket.fikadu.atnafu@gmail.com', '$2b$12$9gM/VPxlhaOhJC.FWCU9eObMFpZF2HwiwS/P3wJoGymYFEN3gt0im', 'Bereket Fikadu', 'system_admin', '2025-05-04 17:57:08', '2025-05-23 19:23:43', 0, NULL, NULL),
(2, 'realbekfikadu.com@gmail.com', '$2b$12$N7ht/cw5SnEBRmPYtIjVt.Smf8uAL2B4SlG3XXx7c5U3tSsPyLZKW', 'esrom eyob', 'government_admin', '2025-05-04 17:57:08', '2025-06-06 10:44:12', 0, NULL, NULL),
(3, 'esromeyob@gmail.com', '$2b$12$IfT8AgegyO75jTZRgiGrHOXFoET.9Czh7JQwIAb3dvbCKNfoJnBjO', NULL, 'user', '2025-05-04 18:02:45', '2025-05-04 18:02:45', 0, NULL, NULL),
(4, 'eskinderdagim51@gmail.com', '$2b$12$TmtoLvtXIThW.eLzYbv/jurmG6gHciSpjtOfrdYmP/8lUOj2b3VT.', NULL, 'user', '2025-06-05 19:21:21', '2025-06-05 19:21:21', 0, NULL, NULL),
(5, 'reysyared@gmail.com', '$2b$12$6OeCbEOSA6cVfNg7/SY8qOcQQqpjmNb2yHAdkrt40Ou9wB6Kkqody', 'reys yared', 'government_admin', '2025-06-12 16:19:12', '2025-06-12 16:19:12', 0, NULL, NULL),
(6, 'delinadesta@gmail.com', '$2b$12$doeqL.dG5CTkc6jf4RKlgOtTqNxDIJ1rO3Wzy/2ANyzo3lrpmGfxK', 'delina desta', 'government_admin', '2025-06-16 08:15:11', '2025-06-16 08:15:11', 0, NULL, NULL),
(8, 'tsegayebula@gmail.com', '$2b$12$vBIu8LjmiV9112nZoGhCiOAWRNwYjJ/eyfLW9MyAEiinrDNJIlQ3e', 'tsegaye bula', 'government_admin', '2025-06-27 18:55:37', '2025-06-27 18:55:37', 0, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `fk_sender_user` (`sender_id`);

--
-- Indexes for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`),
  ADD KEY `idx_employees_office_id` (`office_id`),
  ADD KEY `idx_employees_is_active` (`is_active`),
  ADD KEY `fk_employees_subcity` (`subcity_id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`feedback_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `office_id` (`office_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `offices`
--
ALTER TABLE `offices`
  ADD PRIMARY KEY (`office_id`),
  ADD KEY `idx_offices_subcity_id` (`subcity_id`);

--
-- Indexes for table `subcities`
--
ALTER TABLE `subcities`
  ADD PRIMARY KEY (`subcity_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `employee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=300;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `offices`
--
ALTER TABLE `offices`
  MODIFY `office_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=600;

--
-- AUTO_INCREMENT for table `subcities`
--
ALTER TABLE `subcities`
  MODIFY `subcity_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `chat_sessions` (`session_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_sender_user` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  ADD CONSTRAINT `chat_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_sessions_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`office_id`) REFERENCES `offices` (`office_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_employees_office` FOREIGN KEY (`office_id`) REFERENCES `offices` (`office_id`),
  ADD CONSTRAINT `fk_employees_subcity` FOREIGN KEY (`subcity_id`) REFERENCES `subcities` (`subcity_id`) ON DELETE SET NULL;

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`office_id`) REFERENCES `offices` (`office_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedback_ibfk_3` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL;

--
-- Constraints for table `offices`
--
ALTER TABLE `offices`
  ADD CONSTRAINT `fk_offices_subcity` FOREIGN KEY (`subcity_id`) REFERENCES `subcities` (`subcity_id`),
  ADD CONSTRAINT `offices_ibfk_1` FOREIGN KEY (`subcity_id`) REFERENCES `subcities` (`subcity_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
