<?php
// backend/listar_contactos.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db.php';

try {
    // 3. Consulta SELECT
    $sql = "SELECT * FROM contactos ORDER BY fecha DESC";
    $stmt = $pdo->query($sql);
    
    $contactos = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => $contactos
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener datos: ' . $e->getMessage()
    ]);
}
?>
