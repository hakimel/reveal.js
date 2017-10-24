<?php
require_once 'init.php';

if (!$currentUser) {
  header('Location: index.php');
  exit();
}

$success = true;

if (isset($_POST['oldPassword'])) {
  $oldPassword = $_POST['oldPassword'];
  $newPassword = $_POST['newPassword'];
  $newPassword2 = $_POST['newPassword2'];

  $oldPasswordOk = password_verify($oldPassword, $currentUser['password']);
  $newPasswordOk = $newPassword == $newPassword2 && strlen($newPassword) >= 6;

  $success = $oldPasswordOk && $newPasswordOk;

  if ($success) {
    updateUserPassword($currentUser['id'], password_hash($newPassword, PASSWORD_DEFAULT));
  }
}

?>
<?php include 'header.php' ?>
<h1>Đổi mật khẩu</h1>
<?php if (!$success) : ?>
<div class="alert alert-danger" role="alert">
  <ul>
    <?php if (!$oldPasswordOk) : ?>
    <li>Mật khẩu cũ không chính xác!</li>
    <?php endif; ?>
    <?php if (!$newPasswordOk) : ?>
    <li>Mật khẩu mới cần giống nhau và ít nhất 6 ký tự!</li>
    <?php endif; ?>
  </ul>
</div>
<?php endif; ?>
<form method="POST">
  <div class="form-group">
    <label for="oldPassword">Mật khẩu cũ</label>
    <input type="password" class="form-control" id="oldPassword" name="oldPassword" placeholder="Điền mật khẩu cũ vào đây">
  </div>
  <div class="form-group">
    <label for="newPassword">Mật khẩu mới</label>
    <input type="password" class="form-control" id="newPassword" name="newPassword" placeholder="Điền mật khẩu mới vào đây">
  </div>
  <div class="form-group">
    <label for="newPassword2">Mật khẩu mới (nhập lại)</label>
    <input type="password" class="form-control" id="newPassword2" name="newPassword2" placeholder="Điền mật khẩu mới vào đây lần nữa">
  </div>
  <button type="submit" class="btn btn-primary">Đổi mật khẩu</button>
</form>
<?php include 'footer.php' ?>