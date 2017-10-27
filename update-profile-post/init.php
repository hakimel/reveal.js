<?php
// PHP hiển thị lỗi
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Khởi tạo session
session_start();

// Gán biến page giống với tên file
$page = basename($_SERVER['SCRIPT_NAME'], '.php');

// Kết nối CSDL
$db = new PDO('mysql:host=localhost;dbname=btcn06;charset=utf8', 'root', 'root');

// Kiểm tra thông tin người dùng
$currentUser = null;

require_once 'functions.php';

if (isset($_SESSION['userId'])) {
  $currentUser = findUserById($_SESSION['userId']);
}