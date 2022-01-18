-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Jan 18, 2022 at 03:36 PM
-- Server version: 5.7.36
-- PHP Version: 7.4.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `playlist`
--

CREATE TABLE `playlist` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `creationDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `playlist`
--

INSERT INTO `playlist` (`id`, `userId`, `name`, `creationDate`) VALUES
(1, 1, 'Chill playlist', '2022-01-12'),
(2, 1, 'Everyday', '2021-11-05'),
(3, 4, 'My playlist', '2020-07-10'),
(4, 5, 'untitled', '2021-01-20'),
(5, 5, 'twenty one pilots playlist', '2022-01-01'),
(6, 3, 'asd', '2022-01-18'),
(7, 3, '123', '2022-01-18');

-- --------------------------------------------------------

--
-- Table structure for table `playlistSongs`
--

CREATE TABLE `playlistSongs` (
  `playlistId` int(11) NOT NULL,
  `songId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `playlistSongs`
--

INSERT INTO `playlistSongs` (`playlistId`, `songId`) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 5),
(2, 6),
(3, 6),
(3, 7),
(3, 8),
(4, 1),
(4, 2),
(4, 3),
(4, 5),
(5, 1),
(6, 10);

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `playlistId` int(11) NOT NULL,
  `rating` int(100) NOT NULL,
  `comment` mediumtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`id`, `userId`, `playlistId`, `rating`, `comment`) VALUES
(1, 1, 1, 80, 'dolo'),
(2, 1, 2, 70, 'ipsum'),
(3, 4, 3, 10, 'lorem'),
(4, 5, 4, 23, 'some'),
(5, 5, 5, 49, 'norm');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  `isMusician` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `userId`, `isAdmin`, `isMusician`) VALUES
(1, 1, 1, 0),
(2, 2, 0, 1),
(3, 3, 0, 1),
(4, 4, 0, 0),
(5, 5, 0, 0),
(6, 6, 0, 1),
(7, 7, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `song`
--

CREATE TABLE `song` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `duration` int(11) NOT NULL,
  `genre` varchar(100) NOT NULL,
  `album` varchar(100) NOT NULL,
  `releaseDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `song`
--

INSERT INTO `song` (`id`, `userId`, `name`, `duration`, `genre`, `album`, `releaseDate`) VALUES
(1, 3, 'Ew', 207, 'lo-fi', 'Nectar', '2020-09-25'),
(2, 3, 'Modus', 207, 'lo-fi', 'Nectar', '2020-09-25'),
(3, 3, 'Tick Tock', 132, 'lo-fi', 'Nectar', '2020-09-25'),
(4, 3, 'Daylight (with Diplo)', 163, 'lo-fi', 'Nectar', '2020-09-25'),
(5, 3, 'Upgrade', 89, 'lo-fi', 'Nectar', '2020-09-25'),
(6, 3, 'Gimme Love', 214, 'lo-fi', 'Nectar', '2020-09-25'),
(7, 3, 'Attention', 128, 'pop', 'BALLADS 1', '2020-10-26'),
(8, 3, 'Slow Dancing in the Dark', 209, 'pop', 'BALLADS 1', '2020-10-26'),
(9, 3, 'Test Drive', 179, 'pop', 'BALLADS 1', '2020-10-26'),
(10, 2, 'Good Day', 204, 'rock', 'Scaled and Icy', '2021-05-21'),
(11, 2, 'Choker', 224, 'rock', 'Scaled and Icy', '2021-05-21'),
(12, 2, 'Shy Away', 175, 'rock', 'Scaled and Icy', '2021-05-21'),
(13, 2, 'The Outside', 216, 'rock', 'Scaled and Icy', '2021-05-21'),
(14, 2, 'Saturday', 172, 'rock', 'Scaled and Icy', '2021-05-21'),
(15, 6, 'besides you', 182, 'electronic', 'Colt', '2022-12-07'),
(16, 7, 'CLOVER', 168, 'down-tempo', 'CLOVER', '2020-06-01'),
(17, 3, '1', 1, '1', '1', '2022-01-18'),
(18, 3, '1', 2, '3', '4', '2022-01-18');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(320) NOT NULL,
  `password` varchar(320) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `password`) VALUES
(1, 'zytfo', 'khayalievartur@gmail.com', '1q2w3e'),
(2, 'twentyonepilots', 'twentyonepilots@gmail.com', '1q2w3e'),
(3, 'joji', 'pinkguy@gmail.com', '1q2w3e'),
(4, 'tasty', 'tasty@gmail.com', '1q2w3e'),
(5, 'justuser', 'justuser@gmail.com', '1q2w3e'),
(6, 'golden vessel', 'goldenvessel@gmail.com', '1q2w3e'),
(7, 'akurei', 'akurei@gmail.com', '1q2w3e');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `playlist`
--
ALTER TABLE `playlist`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `song`
--
ALTER TABLE `song`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `playlist`
--
ALTER TABLE `playlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `song`
--
ALTER TABLE `song`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;