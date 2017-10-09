<?php require_once 'init.php' ?>
<?php 
  unset($_SESSION['userId']);
  header('Location: index.php');
?>