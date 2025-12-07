<?php
// backend/api/ordenes.php
require_once 'cors.php';
require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);
$userId = $_GET['userId'] ?? ($data['userId'] ?? null);

if ($method === 'GET') {
    if (!$userId) {
        http_response_code(400);
        exit;
    }
    $stmt = $pdo->prepare("SELECT * FROM ordenes WHERE user_id = ? ORDER BY date DESC");
    $stmt->execute([$userId]);
    $ordenes = $stmt->fetchAll();

    foreach ($ordenes as &$orden) {
        $orden['total'] = (float) $orden['total'];
        $stmtItems = $pdo->prepare("SELECT product_id as productId, name, price, quantity, image FROM items_orden WHERE orden_id = ?");
        $stmtItems->execute([$orden['id']]);
        $orden['items'] = $stmtItems->fetchAll();
        foreach ($orden['items'] as &$item) {
            $item['productId'] = (int) $item['productId'];
            $item['price'] = (float) $item['price'];
            $item['quantity'] = (int) $item['quantity'];
        }
    }
    echo json_encode($ordenes);

} elseif ($method === 'POST') {
    // Crear orden desde carrito
    if (!$userId) {
        http_response_code(400);
        exit;
    }

    // 1. Obtener items del carrito
    $stmt = $pdo->prepare("
        SELECT p.id as productId, p.name, p.price, p.image, ic.quantity 
        FROM items_carrito ic
        JOIN productos p ON ic.product_id = p.id
        WHERE ic.user_id = ?
    ");
    $stmt->execute([$userId]);
    $items = $stmt->fetchAll();

    if (count($items) === 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Carrito vacío']);
        exit;
    }

    $total = 0;
    foreach ($items as $item) {
        $total += $item['price'] * $item['quantity'];
    }

    $ordenId = $data['id'] ?? uniqid();
    $date = date('Y-m-d H:i:s');

    try {
        $pdo->beginTransaction();

        // 2. Crear Orden
        $stmt = $pdo->prepare("INSERT INTO ordenes (id, user_id, total, date) VALUES (?, ?, ?, ?)");
        $stmt->execute([$ordenId, $userId, $total, $date]);

        // 3. Mover items a items_orden
        $stmtItem = $pdo->prepare("INSERT INTO items_orden (orden_id, product_id, name, price, quantity, image) VALUES (?, ?, ?, ?, ?, ?)");
        foreach ($items as $item) {
            $stmtItem->execute([
                $ordenId,
                $item['productId'],
                $item['name'],
                $item['price'],
                $item['quantity'],
                $item['image']
            ]);
        }

        // 4. Vaciar carrito
        $stmt = $pdo->prepare("DELETE FROM items_carrito WHERE user_id = ?");
        $stmt->execute([$userId]);

        $pdo->commit();

        echo json_encode([
            'id' => $ordenId,
            'userId' => $userId,
            'items' => $items,
            'total' => $total,
            'date' => $date
        ]);

    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>