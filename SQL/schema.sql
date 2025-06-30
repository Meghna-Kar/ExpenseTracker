-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: expense_tracker
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Food'),(2,'Transport'),(3,'Utilities'),(4,'Entertainment');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (1,1,'Food',500.00,'2025-06-26','Lunch with team'),(3,2,'Entertainment',1270.00,'2025-06-24','Movies'),(4,1,'Utilities',8745.00,'2025-06-03','electricity'),(5,1,'Transport',5000.00,'2025-05-26','travel'),(6,1,'Entertainment',840.00,'2025-06-18','subscription'),(7,1,'Utilities',32000.00,'2025-05-01','Rent'),(8,2,'Utilities',5800.00,'2025-04-16','electricity'),(9,2,'Transport',450.00,'2025-05-14','snacks'),(11,2,'Transport',3200.00,'2025-06-13','metro'),(12,3,'Transport',3120.00,'2025-04-09','travelling (Home Town)'),(13,3,'Food',12000.00,'2025-04-24','birthday dinner'),(14,4,'Entertainment',6980.00,'2025-04-19','Game zone'),(15,4,'Utilities',18000.00,'2025-04-25','House Rent'),(16,5,'Utilities',26500.00,'2025-04-20','Salon'),(17,5,'Utilities',4500.00,'2025-04-29','Nails'),(18,6,'Food',1250.00,'2025-04-05','snacks'),(19,3,'Utilities',15400.00,'2025-05-08','Rent'),(20,3,'Utilities',2500.00,'2025-05-08','electricity'),(21,4,'Food',1950.00,'2025-05-21','snacks'),(22,4,'Entertainment',600.00,'2025-05-15',''),(23,6,'Food',350.00,'2025-05-12','coffee'),(24,6,'Utilities',13000.00,'2025-06-03','Furniture'),(25,6,'Utilities',6950.00,'2025-06-12','clothes'),(26,5,'Utilities',90000.00,'2025-06-15','Shopping'),(27,5,'Utilities',6820.00,'2025-06-29','fees'),(28,4,'Transport',9800.00,'2025-06-19','Cab'),(29,4,'Entertainment',3600.00,'2025-06-27','ice skates, gaming'),(30,3,'Utilities',1000.00,'2025-06-11','Water bills'),(31,6,'Utilities',25000.00,'2025-04-10','Rent');
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Aditi','aditi@email.com','active'),(2,'Ravi','ravi@email.com','active'),(3,'Ram','RamK@yahoo.com','active'),(4,'Khushi','KKhushi@gmail.com','active'),(5,'Shreya','singhshreya@yahoo.com','active'),(6,'Abhishek','abhi543@gmail.com','active');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-01  0:51:51
