-- Datos de prueba para las órdenes

-- Asegurarse de que existan los tipos de usuario
INSERT INTO tipousuario (id, tipo, descripcion) VALUES 
  (1, 'admin', 'Administrador'),
  (2, 'cocinero', 'Cocinero'),
  (3, 'mesero', 'Mesero')
ON CONFLICT (id) DO NOTHING;

-- Crear usuarios de prueba
INSERT INTO usuarios (id, nombre, password, correo, creation_date, date_modification, activo, id_tipo) VALUES
  (4, 'Mesero Test', '$2b$10$7UZM.C8c9GJh4p9.E9x1S.KQFzqLtGCycqQz5QQo2t1PwQ9M0wBZy', 'mesero@gmail.com', NOW(), NOW(), true, 3),
  (5, 'Cocinero Test', '$2b$10$7UZM.C8c9GJh4p9.E9x1S.KQFzqLtGCycqQz5QQo2t1PwQ9M0wBZy', 'cocinero@gmail.com', NOW(), NOW(), true, 2)
ON CONFLICT (id) DO NOTHING;

-- Crear mesas
INSERT INTO mesas (id, numero_mesa, atendida, activo) VALUES
  (1, 1, false, true),
  (2, 2, false, true),
  (3, 3, false, true),
  (4, 4, false, true)
ON CONFLICT (id) DO NOTHING;

-- Crear categorías
INSERT INTO categoria_producto (id, categoria, descripcion) VALUES
  (1, 'Pizzas', 'Pizzas variadas'),
  (2, 'Bebidas', 'Bebidas frías y calientes'),
  (3, 'Postres', 'Postres deliciosos')
ON CONFLICT (id) DO NOTHING;

-- Crear productos
INSERT INTO productos (id, nombre, ingredientes, precio, imagen, disponibilidad, creation_date, date_modification, id_categoria) VALUES
  (1, 'Pizza Margherita', 'Tomate, queso, albahaca', 9.99, '', true, NOW(), NOW(), 1),
  (2, 'Pizza Pepperoni', 'Tomate, queso, pepperoni', 12.99, '', true, NOW(), NOW(), 1),
  (3, 'Coca Cola', 'Refresco', 2.50, '', true, NOW(), NOW(), 2),
  (4, 'Fanta Naranja', 'Refresco', 2.50, '', true, NOW(), NOW(), 2),
  (5, 'Tiramisú', 'Postre italiano', 5.99, '', true, NOW(), NOW(), 3)
ON CONFLICT (id) DO NOTHING;

-- Crear estados de orden
INSERT INTO estados_orden (id, estado, descripcion) VALUES
  (1, 'Pendiente', 'Orden creada, esperando'),
  (2, 'Preparando', 'En preparación en cocina'),
  (3, 'Listo', 'Listo para servir'),
  (4, 'Cancelado', 'Orden cancelada'),
  (5, 'Pagado', 'Orden pagada')
ON CONFLICT (id) DO NOTHING;

-- Crear una orden de PRUEBA en estado Pendiente (1)
INSERT INTO orden (id, nota, total, created_at, updated_at, id_mesa, usuario_atencion, id_estado) VALUES
  (100, 'Orden de prueba', 24.98, NOW(), NOW(), 2, 4, 1)
ON CONFLICT (id) DO NOTHING;

-- Agregar detalles a la orden
INSERT INTO detalles_orden (id, sub_total, producto_cantidad, nota, precio_unitario, nombre_producto, id_producto, id_orden) VALUES
  (200, 9.99, 1, 'Sin picante', 9.99, 'Pizza Margherita', 1, 100),
  (201, 5.00, 2, NULL, 2.50, 'Coca Cola', 3, 100)
ON CONFLICT (id) DO NOTHING;
