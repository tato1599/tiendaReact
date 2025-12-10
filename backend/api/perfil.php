<?php
require_once 'cors.php';
require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

if ($method === 'PUT') {
    $id = $data['id'] ?? '';
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    if (empty($id) || empty($name) || empty($email)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID, Nombre y Email son obligatorios']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Formato de email inválido']);
        exit;
    }

    try {
        // Verificar si el email pertenece a otro usuario
        $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ? AND id != ?");
        $stmt->execute([$email, $id]);
        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'El email ya está en uso por otro usuario']);
            exit;
        }

        if (!empty($password)) {
            if (strlen($password) < 6) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'La contraseña debe tener al menos 6 caracteres']);
                exit;
            }
            $passwordHash = password_hash($password, PASSWORD_BCRYPT);
            $updateStmt = $pdo->prepare("UPDATE usuarios SET name = ?, email = ?, password = ? WHERE id = ?");
            $updateStmt->execute([$name, $email, $passwordHash, $id]);
        } else {
            $updateStmt = $pdo->prepare("UPDATE usuarios SET name = ?, email = ? WHERE id = ?");
            $updateStmt->execute([$name, $email, $id]);
        }

        // Obtener usuario actualizado para devolverlo (sin password)
        $userStmt = $pdo->prepare("SELECT id, name, email, role FROM usuarios WHERE id = ?");
        $userStmt->execute([$id]);
        $updatedUser = $userStmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'message' => 'Perfil actualizado correctamente',
            'user' => $updatedUser
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al actualizar perfil: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>