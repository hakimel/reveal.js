-- phpMyAdmin SQL Dump
-- version 4.7.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 16, 2017 at 12:10 PM
-- Server version: 5.6.35
-- PHP Version: 7.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `btcn06`
--

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `content` varchar(1024) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `userId`, `content`, `createdAt`) VALUES
(1, 1, 'Em gái mưa@@', '2017-10-16 09:51:24'),
(2, 1, 'Trời lại sắp mưa...', '2017-10-16 10:01:56'),
(3, 2, 'Trời đang mưa', '2017-10-16 10:07:42');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `phone`, `email`, `password`) VALUES
(1, 'Kha N. Do', '0123456789', 'dnkha@fit.hcmus.edu.vn', '$2y$10$Q3NNG0ZGxmaayuZKNVC9tOvXUNi2/O6S.jmffkP1jKNoXXR9qWtl2'),
(2, 'Thái Gia Huy', '', 'thaigiahuy@gmail.com', '$2y$10$6jG6yEQPxf6ZgbRJWqmVwu/e4kxpAK08q./kirZPy2BByfh6mnwC6'),
(3, 'Nguyễn Công Hiệp', '', 'nchiep@gmail.com', '$2y$10$cdtNk2bG61a2qjUQ3q5rF.6G4iCbCLMty7sFjPNdlzD.OQW8G958y'),
(4, 'Trần Thị A', '', 'tranthia@yahoo.com', '$2y$10$Ka0n5K9Arji2xRi0XeCMvOeTp5hgY4EBMPuLKqJNqjAxCzHvX2FVe');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;