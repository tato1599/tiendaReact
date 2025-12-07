CREATE DATABASE IF NOT EXISTS tienda_react_bd;
USE tienda_react_bd;


CREATE TABLE IF NOT EXISTS contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    comentarios TEXT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    imagen VARCHAR(255),
    descripcion TEXT
);


INSERT INTO contactos (nombre, email, comentarios) VALUES 
('Juan Perez', 'juan@example.com', 'Excelente tienda, muy buenos productos.');
