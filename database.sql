CREATE DATABASE IF NOT EXISTS greenswap DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE greenswap;

-- 1. Tabla de Usuarios (RF1, RF2)
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono_contacto VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabla de Categorías de Artículos Domésticos
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Insertar las categorías oficiales del diseño de Figma
INSERT IGNORE INTO categorias (id_categoria, nombre_categoria) VALUES 
(1, 'Electrodomésticos'), (2, 'Muebles'), (3, 'Deportes'), (4, 'Cocina'), (5, 'Decoración');

-- 3. Tabla de Artículos para Donación o Intercambio (RF3, RF4, RF5, RF7, RF9)
CREATE TABLE IF NOT EXISTS articulos (
    id_articulo INT AUTO_INCREMENT PRIMARY KEY,
    titulo_articulo VARCHAR(100) NOT NULL,
    descripcion_detallada TEXT NOT NULL,
    estado_conservacion VARCHAR(20) NOT NULL,
    disponible BOOLEAN DEFAULT TRUE,
    latitud_ubicacion DOUBLE NOT NULL,
    longitud_ubicacion DOUBLE NOT NULL,
    url_imagen TEXT,
    id_usuario_propietario INT NOT NULL,
    id_categoria INT NOT NULL,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario_propietario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
) ENGINE=InnoDB;
