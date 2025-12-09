<?php
// backend/api/productos.php
require_once 'cors.php';
require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM productos WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $producto = $stmt->fetch();

        if ($producto) {
            $producto['id'] = (int) $producto['id'];
            $producto['price'] = (float) $producto['price'];
        }

        echo json_encode($producto ?: null);
    } else {
        $stmt = $pdo->query("SELECT * FROM productos");
        $productos = $stmt->fetchAll();
        // Asegurar tipos numéricos para compatibilidad
        foreach ($productos as &$p) {
            $p['id'] = (int) $p['id'];
            $p['price'] = (float) $p['price'];
        }
        echo json_encode($productos);
    }
}
?>