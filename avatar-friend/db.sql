-- phpMyAdmin SQL Dump
-- version 4.7.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 24, 2017 at 07:48 AM
-- Server version: 5.6.35
-- PHP Version: 7.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `btcn07`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(60) NOT NULL,
  `hasAvatar` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `phone`, `email`, `password`, `hasAvatar`) VALUES
(1, 'Kha N. Do', '0123456789', 'dnkha@fit.hcmus.edu.vn', '$2y$10$Q3NNG0ZGxmaayuZKNVC9tOvXUNi2/O6S.jmffkP1jKNoXXR9qWtl2', 1),
(2, 'Thái Gia Huy', '0123435455', 'thaigiahuy@gmail.com', '$2y$10$6jG6yEQPxf6ZgbRJWqmVwu/e4kxpAK08q./kirZPy2BByfh6mnwC6', 1),
(3, 'Nguyễn Công Hiệp', '', 'nchiep@gmail.com', '$2y$10$cdtNk2bG61a2qjUQ3q5rF.6G4iCbCLMty7sFjPNdlzD.OQW8G958y', 0),
(4, 'Trần Thị A', '', 'tranthia@yahoo.com', '$2y$10$Ka0n5K9Arji2xRi0XeCMvOeTp5hgY4EBMPuLKqJNqjAxCzHvX2FVe', 0);

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