-- Insertar tipos de usuario
INSERT INTO tipousuario (tipo) VALUES ('Admin');
INSERT INTO tipousuario (tipo) VALUES ('Cocinero');
INSERT INTO tipousuario (tipo) VALUES ('Mesero');

-- Insertar usuarios
-- Password: mesero123 (hasheado con bcrypt)
INSERT INTO usuarios (nombre, correo, password, activo, id_tipo, creation_date) 
VALUES ('Santiago Mesero', 'mesero@gmail.com', '$2b$10$YIu6gKJQfvXJJmZLUXQ1d.uSs8.KcFnqZKvNW0UpSe0J3nBtjq5h6', true, 3, NOW());

-- Insertar categorías
INSERT INTO categoria_producto (categoria, descripcion) VALUES ('Pizzas', 'Pizzas variadas');
INSERT INTO categoria_producto (categoria, descripcion) VALUES ('Pastas', 'Pastas frescas');
INSERT INTO categoria_producto (categoria, descripcion) VALUES ('Bebidas', 'Bebidas varias');

-- Insertar mesas
INSERT INTO mesas (numero_mesa, atendida, activo) VALUES (1, false, true);
INSERT INTO mesas (numero_mesa, atendida, activo) VALUES (2, false, true);
INSERT INTO mesas (numero_mesa, atendida, activo) VALUES (3, false, true);
INSERT INTO mesas (numero_mesa, atendida, activo) VALUES (4, false, true);

-- Insertar productos
INSERT INTO productos (nombre, ingredientes, precio, imagen, disponibilidad, id_categoria, creation_date) 
VALUES ('Pizza Margherita', 'Tomate, queso, albahaca', 9.99, '/images/pizza.jpg', true, 1, NOW());
INSERT INTO productos (nombre, ingredientes, precio, imagen, disponibilidad, id_categoria, creation_date) 
VALUES ('Pasta Carbonara', 'Pasta, huevo, jamón, queso', 12.99, '/images/pasta.jpg', true, 2, NOW());
INSERT INTO productos (nombre, ingredientes, precio, imagen, disponibilidad, id_categoria, creation_date) 
VALUES ('Coca Cola', 'Bebida gaseosa', 2.50, '/images/cocacola.jpg', true, 3, NOW());

-- Insertar estados de orden
INSERT INTO estados_orden (nombre, descripcion) VALUES ('Pendiente', 'Orden recibida, esperando cocina');
INSERT INTO estados_orden (nombre, descripcion) VALUES ('Preparando', 'En preparación en cocina');
INSERT INTO estados_orden (nombre, descripcion) VALUES ('Listo', 'Listo para servir');
INSERT INTO estados_orden (nombre, descripcion) VALUES ('Cancelado', 'Orden cancelada');
