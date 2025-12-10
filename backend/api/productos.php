<?php
require_once 'cors.php';
require_once '../db.php';

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    if (isset($_GET['id'])) {
        $sentencia = $pdo->prepare("SELECT * FROM productos WHERE id = ?");
        $sentencia->execute([$_GET['id']]);
        $producto = $sentencia->fetch();

        if ($producto) {
            $producto['id'] = (int) $producto['id'];
            $producto['price'] = (float) $producto['price'];
        }

        echo json_encode($producto ?: null);
    } else {
        $sentencia = $pdo->query("SELECT * FROM productos");
        $productos = $sentencia->fetchAll();
        foreach ($productos as &$p) {
            $p['id'] = (int) $p['id'];
            $p['price'] = (float) $p['price'];
        }
        echo json_encode($productos);
    }
} elseif ($metodo === 'POST') {
    $nombre = $_POST['name'] ?? '';
    $descripcion = $_POST['description'] ?? '';
    $precio = $_POST['price'] ?? 0;
    $categoria = $_POST['category'] ?? '';

    // Verificar si es una actualización
    $id = isset($_POST['id']) ? $_POST['id'] : null;
    $esActualizacion = !empty($id);

    if (empty($nombre) || empty($precio)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Nombre y precio son obligatorios']);
        exit;
    }

    $rutaImagen = '';
    if ($esActualizacion) {
        // Obtener imagen actual si no se sube una nueva
        $stmt = $pdo->prepare("SELECT image FROM productos WHERE id = ?");
        $stmt->execute([$id]);
        $prodActual = $stmt->fetch();
        $rutaImagen = $prodActual['image'] ?? '';
    }

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $directorioSubida = __DIR__ . '/../../public/images/';
        if (!is_dir($directorioSubida)) {
            mkdir($directorioSubida, 0777, true);
        }

        $extensionArchivo = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $nombreArchivo = 'prod_' . uniqid() . '.' . $extensionArchivo;
        $archivoDestino = $directorioSubida . $nombreArchivo;

        $check = getimagesize($_FILES['image']['tmp_name']);
        if ($check !== false) {
            if (move_uploaded_file($_FILES['image']['tmp_name'], $archivoDestino)) {
                $rutaImagen = '/images/' . $nombreArchivo;
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
    } elseif (!$esActualizacion) {
        $rutaImagen = '/images/placeholder.jpg';
    }

    try {
        if ($esActualizacion) {
            $sentencia = $pdo->prepare("UPDATE productos SET name = ?, description = ?, price = ?, category = ?, image = ? WHERE id = ?");
            $resultado = $sentencia->execute([$nombre, $descripcion, $precio, $categoria, $rutaImagen, $id]);
            $mensaje = 'Producto actualizado exitosamente';
        } else {
            $id = time(); // O usar auto-increment si la base de datos está configurada
            $sentencia = $pdo->prepare("INSERT INTO productos (id, name, description, price, category, image) VALUES (?, ?, ?, ?, ?, ?)");
            $resultado = $sentencia->execute([$id, $nombre, $descripcion, $precio, $categoria, $rutaImagen]);
            $mensaje = 'Producto creado exitosamente';
        }

        if ($resultado) {
            echo json_encode([
                'success' => true,
                'message' => $mensaje,
                'product' => [
                    'id' => $id,
                    'name' => $nombre,
                    'price' => $precio,
                    'image' => $rutaImagen
                ]
            ]);
        } else {
            throw new Exception("Error en la base de datos");
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
} elseif ($metodo === 'DELETE') {
    $id = $_GET['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID es requerido para eliminar']);
        exit;
    }

    try {
        $sentencia = $pdo->prepare("DELETE FROM productos WHERE id = ?");
        if ($sentencia->execute([$id])) {
            echo json_encode(['success' => true, 'message' => 'Producto eliminado correctamente']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'No se pudo eliminar el producto']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
}
?>