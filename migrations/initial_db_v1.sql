-- Tabla: Productos (products)
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    composicion VARCHAR(255),
    link_producto VARCHAR(255),
    tipo ENUM('insecticida', 'fungicida', 'herbicida', 'nutricion', 'feromonas', 'otros insumos') NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN DEFAULT TRUE
);

-- Tabla: Objetivos (objectives)
CREATE TABLE objectives (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    imagen VARCHAR(255),
    producto_id INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES products(id)
);

-- Tabla: Etapas Fenológicas (phenological_stages)
CREATE TABLE phenological_stages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    imagen VARCHAR(255),
    fecha_inicio DATE,
    fecha_fin DATE,
    producto_id INT,
    FOREIGN KEY (producto_id) REFERENCES products(id)
);

-- Tabla: Segmentos (segments)
CREATE TABLE segments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    etapa_id INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (etapa_id) REFERENCES phenological_stages(id)
);

-- Tabla: Cultivos (crops)
CREATE TABLE crops (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    pais_id INT
);

-- Tabla: Países (countries)
CREATE TABLE countries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL
);

-- Tabla: productos_cultivos_relacion (products_crops_relation)
CREATE TABLE products_crops_relation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT,
    cultivo_id INT,
    pais_id INT,
    objetivo_id INT,
    etapa_id INT,
    segmento_id INT,
    porcentaje_inicio DECIMAL(5,2),
    porcentaje_fin DECIMAL(5,2),
    FOREIGN KEY (producto_id) REFERENCES products(id),
    FOREIGN KEY (cultivo_id) REFERENCES crops(id),
    FOREIGN KEY (pais_id) REFERENCES countries(id),
    FOREIGN KEY (objetivo_id) REFERENCES objectives(id),
    FOREIGN KEY (etapa_id) REFERENCES phenological_stages(id),
    FOREIGN KEY (segmento_id) REFERENCES segments(id)
);
