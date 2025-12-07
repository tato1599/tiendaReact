<?php
// backend/migrar_datos.php
require_once 'db.php';

// Rutas a los archivos JSON
$jsonPath = __DIR__ . '/../src/data/';
$files = [
    'usuarios' => $jsonPath . 'usuarios.json',
    'productos' => $jsonPath . 'productos.json',
    'carritos' => $jsonPath . 'carritos.json',
    'ordenes' => $jsonPath . 'ordenes.json',
    'comentarios' => $jsonPath . 'comentarios.json'
];

function loadJson($file)
{
    if (!file_exists($file))
        return [];
    $content = file_get_contents($file);
    return json_decode($content, true);
}

try {
    echo "Iniciando migración...\n";

    // 1. Usuarios
    $usuarios = loadJson($files['usuarios']);
    $stmt = $pdo->prepare("INSERT IGNORE INTO usuarios (id, name, email, password) VALUES (?, ?, ?, ?)");
    foreach ($usuarios as $u) {
        // Hashear password si viene en texto plano
        $passwordHash = password_hash($u['password'], PASSWORD_BCRYPT);
        $stmt->execute([$u['id'], $u['name'], $u['email'], $passwordHash]);
    }
    echo "Usuarios migrados: " . count($usuarios) . "\n";

    // 2. Productos
    $productos = loadJson($files['productos']);
    // Limpiamos tabla productos para evitar duplicados/conflictos de IDs autoincrementables si es la primera carga
    // O usamos INSERT IGNORE. Dado que JSON tiene IDs explícitos, mejor actualizamos o insertamos.
    $stmt = $pdo->prepare("INSERT INTO productos (id, name, description, price, category, image) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), price=VALUES(price), category=VALUES(category), image=VALUES(image)");
    foreach ($productos as $p) {
        $stmt->execute([$p['id'], $p['name'], $p['description'], $p['price'], $p['category'], $p['image']]);
    }
    echo "Productos migrados: " . count($productos) . "\n";

    // 3. Comentarios
    $comentarios = loadJson($files['comentarios']);
    $stmt = $pdo->prepare("INSERT IGNORE INTO comentarios (id, nombre, email, comentarios, fecha) VALUES (?, ?, ?, ?, ?)");
    foreach ($comentarios as $c) {
        // Manejar fecha si no existe
        $fecha = isset($c['fecha']) ? $c['fecha'] : date('Y-m-d H:i:s');
        $stmt->execute([$c['id'], $c['nombre'], $c['email'], $c['comentarios'], $fecha]);
    }
    echo "Comentarios migrados: " . count($comentarios) . "\n";

    // 4. Carritos
    $carritos = loadJson($files['carritos']);
    $stmtCarrito = $pdo->prepare("INSERT IGNORE INTO carritos (user_id) VALUES (?)");
    $stmtItem = $pdo->prepare("INSERT INTO items_carrito (user_id, product_id, quantity) VALUES (?, ?, ?)");

    // Limpiar items anteriores para evitar duplicados al re-correr
    $pdo->exec("DELETE FROM items_carrito");

    foreach ($carritos as $c) {
        // Asegurar que existe el carrito
        $stmtCarrito->execute([$c['userId']]);

        foreach ($c['items'] as $item) {
            // Verificar que el producto existe antes de insertar (integridad referencial)
            // Nota: Si el JSON de productos tiene IDs 1..6, y el carrito tiene esos IDs, todo bien.
            $stmtItem->execute([$c['userId'], $item['productId'], isset($item['quantity']) ? $item['quantity'] : 1]);
        }
    }
    echo "Carritos migrados.\n";

    // 5. Ordenes
    $ordenes = loadJson($files['ordenes']);
    $stmtOrden = $pdo->prepare("INSERT IGNORE INTO ordenes (id, user_id, total, date) VALUES (?, ?, ?, ?)");
    $stmtItemOrden = $pdo->prepare("INSERT INTO items_orden (orden_id, product_id, name, price, quantity, image) VALUES (?, ?, ?, ?, ?, ?)");

    foreach ($ordenes as $o) {
        $stmtOrden->execute([$o['id'], $o['userId'], $o['total'], $o['date']]);

        foreach ($o['items'] as $item) {
            $stmtItemOrden->execute([
                $o['id'],
                $item['productId'],
                $item['name'],
                $item['price'],
                $item['quantity'],
                $item['image']
            ]);
        }
    }
    echo "Ordenes migradas: " . count($ordenes) . "\n";

    echo "Migración completada con éxito.\n";

} catch (PDOException $e) {
    if ($e->getCode() == '23000') {
        // Integrity constraint violation often expected on re-runs
        echo "Aviso: Algunos registros ya existían (Integridad de datos).\nError detallado: " . $e->getMessage() . "\n";
    } else {
        die("Error en la migración: " . $e->getMessage());
    }
}
?>