<?php
// backend/api/comentarios.php
require_once 'cors.php';
require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM comentarios ORDER BY fecha DESC");
    echo json_encode($stmt->fetchAll());
} elseif ($method === 'POST') {
    $id = $data['id'] ?? uniqid();
    $nombre = trim($data['nombre'] ?? '');
    $email = trim($data['email'] ?? '');
    $comentarios = trim($data['comentarios'] ?? '');
    $fecha = $data['fecha'] ?? date('Y-m-d H:i:s');

    if (empty($nombre) || empty($email) || empty($comentarios)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Formato de email inválido']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO comentarios (id, nombre, email, comentarios, fecha) VALUES (?, ?, ?, ?, ?)");
    if ($stmt->execute([$id, $nombre, $email, $comentarios, $fecha])) {
        echo json_encode(['success' => true, 'id' => $id]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al guardar']);
    }
}
?>