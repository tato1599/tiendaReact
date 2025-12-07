CREATE DATABASE IF NOT EXISTS tienda_react_bd;
USE tienda_react_bd;

DROP TABLE IF EXISTS items_orden;
DROP TABLE IF EXISTS ordenes;
DROP TABLE IF EXISTS items_carrito;
DROP TABLE IF EXISTS carritos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS comentarios;
DROP TABLE IF EXISTS contactos;

CREATE TABLE IF NOT EXISTS usuarios (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    image VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS carritos (
    user_id VARCHAR(50) PRIMARY KEY,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS items_carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES carritos(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES productos(id)
);

CREATE TABLE IF NOT EXISTS ordenes (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS items_orden (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_id VARCHAR(50) NOT NULL,
    product_id INT NOT NULL,
    name VARCHAR(100) NOT NULL, -- Guardamos nombre y precio por si cambia el producto
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    image VARCHAR(255),
    FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE
    -- No foreign key a productos obligatoria por si se borra el producto
);

CREATE TABLE IF NOT EXISTS comentarios (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    comentarios TEXT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla legacy si se necesita mantener compatibilidad
CREATE TABLE IF NOT EXISTS contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    comentarios TEXT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);
