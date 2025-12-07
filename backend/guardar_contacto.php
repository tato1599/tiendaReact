<?php
// backend/guardar_contacto.php

// Permitir solicitudes desde cualquier origen (CORS) - Para ambiente de desarrollo
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Manejar pre-flight request de OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

// Obtener los datos enviados (JSON)
$data = json_decode(file_get_contents("php://input"), true);

// Respuesta por defecto
$response = [
    'success' => false,
    'message' => 'Error desconocido',
    'errors' => []
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Validar entradas
    $errores = [];
    
    // Validar nombre
    $nombre = isset($data['nombre']) ? trim($data['nombre']) : '';
    if (empty($nombre)) {
        $errores['nombre'] = 'El nombre es obligatorio.';
    }

    // Validar email
    $email = isset($data['email']) ? trim($data['email']) : '';
    if (empty($email)) {
        $errores['email'] = 'El correo es obligatorio.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errores['email'] = 'El formato del correo no es válido.';
    }

    // Validar comentarios
    $comentarios = isset($data['comentarios']) ? trim($data['comentarios']) : '';
    if (empty($comentarios)) {
        $errores['comentarios'] = 'El comentario es obligatorio.';
    }

    // Si hay errores, devolverlos
    if (!empty($errores)) {
        $response['message'] = 'Errores de validación';
        $response['errors'] = $errores;
        echo json_encode($response);
        exit();
    }

    try {
        // 2. Insertar en base de datos (Sentencia preparada para evitar SQL Injection)
        $sql = "INSERT INTO contactos (nombre, email, comentarios) VALUES (:nombre, :email, :comentarios)";
        $stmt = $pdo->prepare($sql);
        
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':comentarios', $comentarios);
        
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Contacto guardado exitosamente';
            $response['id'] = $pdo->lastInsertId();
        } else {
            $response['message'] = 'Error al guardar en la base de datos';
        }

    } catch (PDOException $e) {
        $response['message'] = 'Error de base de datos: ' . $e->getMessage();
    }
} else {
    $response['message'] = 'Método no permitido';
}

echo json_encode($response);
?>
