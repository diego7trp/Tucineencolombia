CREATE TABLE IF NOT EXISTS resenas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pelicula_id INT NULL,
  item_id VARCHAR(50) NOT NULL,
  item_tipo VARCHAR(20) NOT NULL DEFAULT 'pelicula',
  origen VARCHAR(20) NOT NULL DEFAULT 'local',
  autor VARCHAR(100) NOT NULL,
  calificacion INT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
  comentario TEXT,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pelicula_id) REFERENCES peliculas(id) ON DELETE CASCADE,
  INDEX idx_resenas_item (item_id, item_tipo, origen, fecha)
);
