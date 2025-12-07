<?php
// backend/actualizar_contacto.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = isset($data['id']) ? intval($data['id']) : 0;
$nombre = isset($data['nombre']) ? trim($data['nombre']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$comentarios = isset($data['comentarios']) ? trim($data['comentarios']) : '';

if ($id > 0 && !empty($nombre) && !empty($email) && !empty($comentarios)) {
    try {
        // 5. Actualizar (UPDATE)
        $sql = "UPDATE contactos SET nombre = :nombre, email = :email, comentarios = :comentarios WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':comentarios', $comentarios);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Contacto actualizado']);
        } else {
            echo json_encode(['success' => false, 'message' => 'No se pudo actualizar']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos o ID inválido']);
}
?>
