<?php
$conn = new mysqli("localhost", "root", "", "hidden_talent");

if ($conn->connect_error) {
    die("DB Connection Failed");
}

$name = $_POST['name'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

// check email already exists
$check = $conn->prepare("SELECT id FROM users WHERE email=?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo "Email already exists";
    exit();
}

$stmt = $conn->prepare("INSERT INTO users(name,email,password) VALUES (?,?,?)");
$stmt->bind_param("sss", $name, $email, $password);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "error";
}
?>
