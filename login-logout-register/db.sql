-- phpMyAdmin SQL Dump
-- version 4.7.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 09, 2017 at 12:08 PM
-- Server version: 5.6.35
-- PHP Version: 7.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `btcn05`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `email`, `password`) VALUES
(1, 'Đỗ Nguyên Kha', 'dnkha@fit.hcmus.edu.vn', '$2y$10$pgEwllVOLl9J8Tb5BCzh6.WG6BXURbQqpW8nNYa2H8XlVRAs2W9wm'),
(2, 'Thái Gia Huy', 'thaigiahuy@gmail.com', '$2y$10$6jG6yEQPxf6ZgbRJWqmVwu/e4kxpAK08q./kirZPy2BByfh6mnwC6'),
(3, 'Nguyễn Công Hiệp', 'nchiep@gmail.com', '$2y$10$cdtNk2bG61a2qjUQ3q5rF.6G4iCbCLMty7sFjPNdlzD.OQW8G958y'),
(4, 'Trần Thị A', 'tranthia@yahoo.com', '$2y$10$Ka0n5K9Arji2xRi0XeCMvOeTp5hgY4EBMPuLKqJNqjAxCzHvX2FVe');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;