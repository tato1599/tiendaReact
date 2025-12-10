<?php
require_once 'cors.php';
require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    if (isset($_GET['action'])) {
        if ($_GET['action'] === 'login') {
            $email = trim($data['email'] ?? '');
            $password = $data['password'] ?? '';

            if (empty($email) || empty($password)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Email y contraseña son obligatorios']);
                exit;
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Formato de email inválido']);
                exit;
            }

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
                        'email' => $user['email'],
                        'role' => $user['role'] ?? 'user'
                    ]
                ]);
            } else {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Credenciales inválidas']);
            }
        } elseif ($_GET['action'] === 'register') {
            $name = trim($data['name'] ?? '');
            $email = trim($data['email'] ?? '');
            $password = $data['password'] ?? '';
            $id = $data['id'] ?? uniqid();

            if (empty($name) || empty($email) || empty($password)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
                exit;
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Formato de email inválido']);
                exit;
            }

            if (strlen($password) < 6) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'La contraseña debe tener al menos 6 caracteres']);
                exit;
            }

            $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'El usuario ya existe']);
                exit;
            }

            $passwordHash = password_hash($password, PASSWORD_BCRYPT);
            $role = 'user';

            $stmt = $pdo->prepare("INSERT INTO usuarios (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)");
            try {
                if ($stmt->execute([$id, $name, $email, $passwordHash, $role])) {
                    echo json_encode([
                        'success' => true,
                        'token' => 'fake-jwt-token',
                        'user' => ['id' => $id, 'name' => $name, 'email' => $email, 'role' => $role]
                    ]);
                } else {
                    throw new Exception("Error al ejecutar insert");
                }
            } catch (Exception $e) {
                http_response_code(500);
                $errorInfo = $stmt->errorInfo();
                error_log("Error en registro: " . print_r($errorInfo, true));
                echo json_encode(['success' => false, 'message' => 'Error al registrar: ' . $e->getMessage()]);
            }
        }
    }
}
?>