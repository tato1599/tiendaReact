<?php
// backend/api/comentarios.php
require_once 'cors.php';
require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

if ($method === 'GET') {
    // Si quisieras listar comentarios, podrías hacerlo aquí
    $stmt = $pdo->query("SELECT * FROM comentarios ORDER BY fecha DESC");
    echo json_encode($stmt->fetchAll());
} elseif ($method === 'POST') {
    $id = $data['id'] ?? uniqid();
    $nombre = $data['nombre'];
    $email = $data['email'];
    $comentarios = $data['comentarios'];
    $fecha = $data['fecha'] ?? date('Y-m-d H:i:s');

    $stmt = $pdo->prepare("INSERT INTO comentarios (id, nombre, email, comentarios, fecha) VALUES (?, ?, ?, ?, ?)");
    if ($stmt->execute([$id, $nombre, $email, $comentarios, $fecha])) {
        echo json_encode(['success' => true, 'id' => $id]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al guardar']);
    }
}
?>