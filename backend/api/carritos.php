<?php
// backend/api/carritos.php
require_once 'cors.php';
require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);
$userId = $_GET['userId'] ?? ($data['userId'] ?? null);

if (!$userId) {
    http_response_code(400);
    echo json_encode(['error' => 'UserId requerido']);
    exit;
}

if ($method === 'GET') {
    // Obtener items del carrito
    $stmt = $pdo->prepare("
        SELECT p.id as productId, p.name, p.price, p.image, ic.quantity 
        FROM items_carrito ic
        JOIN productos p ON ic.product_id = p.id
        WHERE ic.user_id = ?
    ");
    $stmt->execute([$userId]);
    $items = $stmt->fetchAll();

    // Casting
    foreach ($items as &$item) {
        $item['productId'] = (int) $item['productId'];
        $item['price'] = (float) $item['price'];
        $item['quantity'] = (int) $item['quantity'];
    }
    echo json_encode($items);

} elseif ($method === 'POST') {
    // Agregar/Actualizar item (Action: add) o Vaciar
    $action = $_GET['action'] ?? 'add';

    ensureCartExists($pdo, $userId);

    if ($action === 'add') {
        $productId = $data['productId'];
        $quantity = $data['quantity'] ?? 1;

        // Check if item exists
        $stmt = $pdo->prepare("SELECT quantity FROM items_carrito WHERE user_id = ? AND product_id = ?");
        $stmt->execute([$userId, $productId]);
        $existing = $stmt->fetch();

        if ($existing) {
            $newQty = $existing['quantity'] + $quantity;
            $stmt = $pdo->prepare("UPDATE items_carrito SET quantity = ? WHERE user_id = ? AND product_id = ?");
            $stmt->execute([$newQty, $userId, $productId]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO items_carrito (user_id, product_id, quantity) VALUES (?, ?, ?)");
            $stmt->execute([$userId, $productId, $quantity]);
        }
    } elseif ($action === 'clear') {
        $stmt = $pdo->prepare("DELETE FROM items_carrito WHERE user_id = ?");
        $stmt->execute([$userId]);
    }

    // Return updated cart
    $stmt = $pdo->prepare("SELECT p.id as productId, p.name, p.price, p.image, ic.quantity FROM items_carrito ic JOIN productos p ON ic.product_id = p.id WHERE ic.user_id = ?");
    $stmt->execute([$userId]);
    $items = $stmt->fetchAll();
    foreach ($items as &$item) {
        $item['productId'] = (int) $item['productId'];
        $item['price'] = (float) $item['price'];
        $item['quantity'] = (int) $item['quantity'];
    }
    echo json_encode($items);

} elseif ($method === 'DELETE') {
    // Eliminar item
    $productId = $_GET['productId'] ?? null;
    if ($productId) {
        $stmt = $pdo->prepare("DELETE FROM items_carrito WHERE user_id = ? AND product_id = ?");
        $stmt->execute([$userId, $productId]);

        // Return updated cart
        $stmt = $pdo->prepare("SELECT p.id as productId, p.name, p.price, p.image, ic.quantity FROM items_carrito ic JOIN productos p ON ic.product_id = p.id WHERE ic.user_id = ?");
        $stmt->execute([$userId]);
        $items = $stmt->fetchAll();
        foreach ($items as &$item) {
            $item['productId'] = (int) $item['productId'];
            $item['price'] = (float) $item['price'];
            $item['quantity'] = (int) $item['quantity'];
        }
        echo json_encode($items);
    }
}

function ensureCartExists($pdo, $userId)
{
    $stmt = $pdo->prepare("INSERT IGNORE INTO carritos (user_id) VALUES (?)");
    $stmt->execute([$userId]);
}
?>