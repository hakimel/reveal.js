<?php
require_once 'init.php';

if (!$currentUser) {
  header('Location: index.php');
  exit();
}

$success = true;

if (isset($_POST['content'])) {
  $content = $_POST['content'];
  $len = strlen($content);

  if ($len == 0 || $len > 1024) {
    $success = false;
  } else {
    createPost($currentUser['id'], $content);
    header('Location: index.php');
    exit();
  }
}
?>
<?php include 'header.php' ?>
<h1>Thêm trạng thái mới</h1>
<?php if (!$success) : ?>
<div class="alert alert-danger" role="alert">
  Nội dung không được rỗng và dài quá 1024 ký tự!
</div>
<?php endif; ?>
<form method="POST">
  <div class="form-group">
    <textarea class="form-control" id="content" name="content" rows="3" placeholder="Bạn đang nghĩ gì?"></textarea>
  </div>
  <button type="submit" class="btn btn-primary">Đăng</button>
</form>
<?php include 'footer.php' ?>