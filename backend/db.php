<?php
// backend/db.php
// Configuración de la conexión a la base de datos
$host = '127.0.0.1';
$usuario = 'root';
$password = ''; // Por defecto en XAMPP es vacío
$base_datos = 'tienda_react_bd';

try {
    $dsn = "mysql:host=$host;dbname=$base_datos;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    $pdo = new PDO($dsn, $usuario, $password, $options);

    // Si estás probando directamente este archivo:
    // echo "Conexión exitosa a la base de datos";

} catch (PDOException $e) {
    // En producción, no mostrar el error detallado al usuario
    die("Error de conexión: " . $e->getMessage());
}
?>