<?php
// backend/api/usuarios.php
require_once 'cors.php';
require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    if (isset($_GET['action'])) {
        if ($_GET['action'] === 'login') {
            $email = $data['email'] ?? '';
            $password = $data['password'] ?? '';

            $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {
                echo json_encode([
                    'success' => true,
                    'token' => 'fake-jwt-token',
                    'user' => [
                        'id' => $user['id'],
                        'name' => $user['name'],
                        'email' => $user['email']
                    ]
                ]);
            } else {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Credenciales inválidas']);
            }
        } elseif ($_GET['action'] === 'register') {
            $name = $data['name'] ?? '';
            $email = $data['email'] ?? '';
            $password = $data['password'] ?? '';
            $id = $data['id'] ?? uniqid();

            // Verificar si existe
            $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'El usuario ya existe']);
                exit;
            }

            $passwordHash = password_hash($password, PASSWORD_BCRYPT);

            $stmt = $pdo->prepare("INSERT INTO usuarios (id, name, email, password) VALUES (?, ?, ?, ?)");
            try {
                if ($stmt->execute([$id, $name, $email, $passwordHash])) {
                    echo json_encode([
                        'success' => true,
                        'token' => 'fake-jwt-token',
                        'user' => ['id' => $id, 'name' => $name, 'email' => $email]
                    ]);
                } else {
                    throw new Exception("Error al ejecutar insert");
                }
            } catch (Exception $e) {
                http_response_code(500);
                $errorInfo = $stmt->errorInfo();
                error_log("Error en registro: " . print_r($errorInfo, true));
                echo json_encode(['success' => false, 'message' => 'Error al registrar: ' . $e->getMessage() . ' ' . ($errorInfo[2] ?? '')]);
            }
        }
    }
}
?>