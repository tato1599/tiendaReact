<?php
require_once 'db.php';

try {
    $sql = "SHOW COLUMNS FROM usuarios LIKE 'role'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    if ($stmt->rowCount() == 0) {
        $alterSql = "ALTER TABLE usuarios ADD COLUMN role VARCHAR(20) DEFAULT 'user'";
        $pdo->exec($alterSql);
        echo "Columna role agregada exitosamente.\n";
    } else {
        echo "La columna role ya existe.\n";
    }

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>