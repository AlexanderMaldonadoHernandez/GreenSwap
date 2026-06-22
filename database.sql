-- 1. POPULAR USUARIOS
-- La contraseña para todas las cuentas es: 123456
INSERT INTO usuarios (nombre_completo, correo_electronico, password_hash, rol, cuenta_activa) VALUES
                                                                                                  ('Admin GreenSwap', 'admin@greenswap.com', '$2a$10$7EqJtq98hPqEX7fNZaSQjeV2w2.LIfPGE7b2a6/1K2/U0rR.e13qW', 'ADMIN', true),
                                                                                                  ('Juan Pérez', 'juan@ipn.mx', '$2a$10$7EqJtq98hPqEX7fNZaSQjeV2w2.LIfPGE7b2a6/1K2/U0rR.e13qW', 'USUARIO', true),
                                                                                                  ('María González', 'maria@ipn.mx', '$2a$10$7EqJtq98hPqEX7fNZaSQjeV2w2.LIfPGE7b2a6/1K2/U0rR.e13qW', 'USUARIO', true),
                                                                                                  ('Carlos López', 'carlos@ipn.mx', '$2a$10$7EqJtq98hPqEX7fNZaSQjeV2w2.LIfPGE7b2a6/1K2/U0rR.e13qW', 'USUARIO', true);


-- 2. POPULAR ARTÍCULOS
-- Categorías: 1:Electrodomésticos, 2:Muebles, 3:Deportes, 4:Cocina, 5:Decoración
-- Todos están asignados a los usuarios normales (IDs 2, 3 y 4)

-- Artículo 1: Exactamente en ESCOM / Zacatenco (19.5046, -99.1467)
INSERT INTO articulos (titulo_articulo, descripcion_detallada, estado_conservacion, disponible, latitud_ubicacion, longitud_ubicacion, url_imagen, id_usuario_propietario, id_categoria, estado_publicacion) VALUES
    ('Microondas LG', 'Microondas casi nuevo, calienta perfecto. Lo cambio por mudanza.', 'Usado', true, 19.5046, -99.1467, 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078', 2, 1, 'APROBADO');

-- Artículo 2: Cerca de Lindavista (~ 2 km de Zacatenco)
INSERT INTO articulos (titulo_articulo, descripcion_detallada, estado_conservacion, disponible, latitud_ubicacion, longitud_ubicacion, url_imagen, id_usuario_propietario, id_categoria, estado_publicacion) VALUES
    ('Silla de Oficina Ergonómica', 'Silla ergonómica negra. Muy cómoda para estudiar horas y horas.', 'Usado', true, 19.4900, -99.1350, 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1', 3, 2, 'APROBADO');

-- Artículo 3: Cerca de Ticomán (~ 1.5 km al norte de Zacatenco)
INSERT INTO articulos (titulo_articulo, descripcion_detallada, estado_conservacion, disponible, latitud_ubicacion, longitud_ubicacion, url_imagen, id_usuario_propietario, id_categoria, estado_publicacion) VALUES
    ('Bicicleta de Montaña R26', 'Bicicleta rodada 26, le falta aire a las llantas pero de ahí en fuera funciona bien.', 'Usado', true, 19.5180, -99.1380, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e', 4, 3, 'APROBADO');

-- Artículo 4: Cerca de La Villa (~ 3.5 km al sureste de Zacatenco)
INSERT INTO articulos (titulo_articulo, descripcion_detallada, estado_conservacion, disponible, latitud_ubicacion, longitud_ubicacion, url_imagen, id_usuario_propietario, id_categoria, estado_publicacion) VALUES
    ('Licuadora Oster 10 vel', 'Licuadora de 10 velocidades con vaso de vidrio. Apenas se sacó de la caja.', 'Nuevo', true, 19.4820, -99.1180, 'https://plus.unsplash.com/premium_photo-1718043036199-d98bef36af46', 2, 4, 'APROBADO');

-- Artículo 5: Cerca de Vallejo (~ 1.5 km al suroeste de Zacatenco)
INSERT INTO articulos (titulo_articulo, descripcion_detallada, estado_conservacion, disponible, latitud_ubicacion, longitud_ubicacion, url_imagen, id_usuario_propietario, id_categoria, estado_publicacion) VALUES
    ('Lámpara de Escritorio LED', 'Lámpara con intensidad regulable. Incluye cable USB.', 'Nuevo', true, 19.4950, -99.1550, 'https://images.unsplash.com/photo-1570974802254-4b0ad1a755f5', 3, 5, 'APROBADO');

-- Artículo 6: Artículo pendiente de aprobación (para probar el panel de Admin)
INSERT INTO articulos (titulo_articulo, descripcion_detallada, estado_conservacion, disponible, latitud_ubicacion, longitud_ubicacion, url_imagen, id_usuario_propietario, id_categoria, estado_publicacion) VALUES
    ('Mancuernas 5kg', 'Par de mancuernas de neopreno en buen estado.', 'Usado', true, 19.5100, -99.1420, 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61', 4, 3, 'PENDIENTE');

-- 3. POPULAR SOLICITUDES (Opcional, para que haya algo en los historiales de los usuarios)
-- Juan le pide a María la Silla de oficina
INSERT INTO solicitudes (id_articulo, titulo_articulo, id_usuario_solicitante, id_usuario_propietario, fecha, estado) VALUES
    (2, 'Silla de Oficina Ergonómica', 2, 3, NOW(), 'PENDIENTE');

-- Carlos le pidió a Juan el microondas, y el intercambio ya se completó
INSERT INTO solicitudes (id_articulo, titulo_articulo, id_usuario_solicitante, id_usuario_propietario, fecha, estado) VALUES
    (1, 'Microondas LG', 4, 2, DATE_SUB(NOW(), INTERVAL 2 DAY), 'COMPLETADA');