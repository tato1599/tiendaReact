<?php
require_once 'cors.php';
require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $ventasStmt = $pdo->query("SELECT SUM(total) as total_ventas, COUNT(*) as total_ordenes FROM ordenes");
        $ventas = $ventasStmt->fetch(PDO::FETCH_ASSOC);

        $ordenesStmt = $pdo->query("SELECT o.id, o.total, o.date, u.email FROM ordenes o LEFT JOIN usuarios u ON o.user_id = u.id ORDER BY o.date DESC LIMIT 10");
        $ordenes = $ordenesStmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'stats' => [
                'ventas_totales' => $ventas['total_ventas'] ?? 0,
                'cantidad_ordenes' => $ventas['total_ordenes'] ?? 0
            ],
            'recent_orders' => $ordenes
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al obtener estadisticas: ' . $e->getMessage()]);
    }
}
?>