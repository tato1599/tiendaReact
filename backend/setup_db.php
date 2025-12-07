<?php
require_once 'db.php';

$sqlFile = 'database.sql';
if (!file_exists($sqlFile)) {
    die("Error: No se encuentra database.sql\n");
}

$sql = file_get_contents($sqlFile);

try {
    $pdo->exec($sql);
    echo "Base de datos actualizada correctamente.\n";
} catch (PDOException $e) {
    die("Error al ejecutar SQL: " . $e->getMessage() . "\n");
}
?>