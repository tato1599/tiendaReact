<?php
require_once 'db.php';

if ($argc < 4) {
    echo "Uso: php criar_admin.php <nombre> <email> <password>\n";
    exit(1);
}

$name = $argv[1];
$email = $argv[2];
$password = $argv[3];
$role = 'admin';

try {
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $existingUser = $stmt->fetch();

    if ($existingUser) {
        $updateStmt = $pdo->prepare("UPDATE usuarios SET role = ?, password = ? WHERE email = ?");
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        $updateStmt->execute([$role, $passwordHash, $email]);
        echo "Usuario existente actualizado a administrador.\n";
    } else {
        $id = uniqid();
        $insertStmt = $pdo->prepare("INSERT INTO usuarios (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)");
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        $insertStmt->execute([$id, $name, $email, $passwordHash, $role]);
        echo "Nuevo usuario administrador creado exitosamente.\n";
    }

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>