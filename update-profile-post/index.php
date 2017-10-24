<?php 
require_once 'init.php';

if ($currentUser) {
  $newFeeds = getNewFeeds();
}
?>
<?php include 'header.php' ?>
<h1>Trang chủ</h1>
<?php if ($currentUser) : ?>
<p>Chào mừng <?php echo $currentUser['fullname'] ?> đã trở lại.</p>
<?php foreach ($newFeeds as $post) : ?>
<div class="card" style="margin-bottom: 10px;">
  <div class="card-body">
    <h4 class="card-title"><?php echo $post['userFullname'] ?></h4>
    <p class="card-text">
    <small>Đăng lúc: <?php echo $post['createdAt'] ?></small>
    <p><?php echo $post['content'] ?></p>
    </p>
  </div>
</div>
<?php endforeach; ?>
<?php else: ?>
Bạn chưa đăng nhập
<?php endif ?>
<?php include 'footer.php' ?>