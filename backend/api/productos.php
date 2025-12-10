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
} elseif ($method === 'POST') {
    // Manejo de creación de producto con imagen
    $name = $_POST['name'] ?? '';
    $description = $_POST['description'] ?? '';
    $price = $_POST['price'] ?? 0;
    $category = $_POST['category'] ?? '';
    // Generar un ID numérico o usar auto-increment si la base de datos lo soporta. 
    // Los JSONs usaban IDs numéricos manuales, aquí usaremos time() para simplicidad si no es auto-increment
    // O mejor, dejemos que la BD maneje el ID si es AUTO_INCREMENT, si no, generamos uno.
    $id = time();

    if (empty($name) || empty($price)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Nombre y precio son obligatorios']);
        exit;
    }

    $imagePath = '';

    // Manejo de subida de imagenes
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/../../public/images/';

        // Asegurar que el directorio existe (aunque ya lo creamos con comando)
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $fileExtension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $fileName = 'prod_' . uniqid() . '.' . $fileExtension;
        $targetFile = $uploadDir . $fileName;

        // Validar tipo de imagen
        $check = getimagesize($_FILES['image']['tmp_name']);
        if ($check !== false) {
            if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
                $imagePath = '/images/' . $fileName; // Ruta relativa para el frontend
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Error al subir la imagen']);
                exit;
            }
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'El archivo no es una imagen válida']);
            exit;
        }
    } else {
        // Imagen por defecto o error si es obligatoria. Asumiremos opcional o placeholder.
        $imagePath = '/images/placeholder.jpg';
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO productos (id, name, description, price, category, image) VALUES (?, ?, ?, ?, ?, ?)");
        if ($stmt->execute([$id, $name, $description, $price, $category, $imagePath])) {
            echo json_encode([
                'success' => true,
                'message' => 'Producto creado exitosamente',
                'product' => [
                    'id' => $id,
                    'name' => $name,
                    'price' => $price,
                    'image' => $imagePath
                ]
            ]);
        } else {
            throw new Exception("Error al insertar en BD");
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
}
?>