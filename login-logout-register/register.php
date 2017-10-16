<?php 
  require_once 'init.php';

  $success = true;
  
  if (!empty($_POST['fullname']) && !empty($_POST['email']) && !empty($_POST['password']) && !empty($_POST['agree-tos']) && $_POST['agree-tos'] == 'on') {
    $email = strtolower($_POST['email']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $fullname = $_POST['fullname'];

    // Kiểm tra xem email có trùng không
    $user = findUserByEmail($email);

    if ($user) {
      $success = false;
    } else {
      $insertId = createUser($fullname, $email, $password);
      $_SESSION['userId'] = $insertId;
      // Redirect to home page
      header('Location: index.php');
      exit();
    }
  }
?>
<?php include 'header.php' ?>
<h1>Đăng ký tài khoản</h1>
<?php if (!$success) : ?>
<div class="alert alert-danger" role="alert">
  Email đã tồn tại đăng ký lại!
</div>
<?php endif; ?>
<form method="POST">
  <div class="form-group">
    <label for="fullname">Họ và tên</label>
    <input type="text" class="form-control" id="fullname" name="fullname" placeholder="Điền họ và tên vào đây" value="<?php echo isset($_POST['fullname']) ? $_POST['fullname'] : '' ?>">
  </div>
  <div class="form-group">
    <label for="email">Địa chỉ email</label>
    <input type="email" class="form-control" id="email" name="email" placeholder="Điền email vào đây" value="<?php echo isset($_POST['email']) ? $_POST['email'] : '' ?>">
  </div>
  <div class="form-group">
    <label for="password">Mật khẩu</label>
    <input type="password" class="form-control" id="password" name="password" placeholder="Điền mật khẩu vào đây">
  </div>
  <div class="form-check">
    <label class="form-check-label">
      <input type="checkbox" name="agree-tos" class="form-check-input">
      Đồng ý điều khoản trang Web
    </label>
  </div>
  <button type="submit" class="btn btn-primary">Đăng ký</button>
</form>
<?php include 'footer.php' ?>