<?php require_once 'init.php' ?>
<?php include 'header.php' ?>
<h1>Trang chủ</h1>
<?php if ($currentUser) : ?>
Chào mừng <?php echo $currentUser['fullname'] ?> đã trở lại.
<?php else: ?>
Bạn chưa đăng nhập
<?php endif ?>
<?php include 'footer.php' ?>