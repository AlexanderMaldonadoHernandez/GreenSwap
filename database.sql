-- 1. POPULAR USUARIOS
-- La contraseña para todas las cuentas es: qwerty
INSERT INTO usuarios (nombre_completo, correo_electronico, password_hash, rol, cuenta_activa) VALUES
                                                                                                  ('Admin GreenSwap', 'admin@greenswap.com', '$2a$10$FrygU2M02Z.Q4BdRk1ibc.060HTUd2CmWDY/J9ybPifVLFctufMwO', 'ADMIN', true),
                                                                                                  ('Juan Pérez', 'juan@ipn.mx', '$2a$10$FrygU2M02Z.Q4BdRk1ibc.060HTUd2CmWDY/J9ybPifVLFctufMwO', 'USUARIO', true),
                                                                                                  ('María González', 'maria@ipn.mx', '$2a$10$FrygU2M02Z.Q4BdRk1ibc.060HTUd2CmWDY/J9ybPifVLFctufMwO', 'USUARIO', true),
                                                                                                  ('Carlos López', 'carlos@ipn.mx', '$2a$10$FrygU2M02Z.Q4BdRk1ibc.060HTUd2CmWDY/J9ybPifVLFctufMwO', 'USUARIO', true);

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

-- 4. POPULAR CHATS (MENSAJES)
-- Chat de Intercambio 1 (Pendiente: Juan solicita la Silla de María - id_solicitud = 1)
INSERT INTO mensajes (id_remitente, nombre_remitente, contenido, fecha, tipo, id_referencia) VALUES
                                                                                                 (2, 'Juan Pérez', 'Hola María, me interesa mucho la silla de oficina. ¿Aún la tienes disponible?', DATE_SUB(NOW(), INTERVAL 1 DAY), 'INTERCAMBIO', 1),
                                                                                                 (3, 'María González', 'Hola Juan, sí, todavía la tengo. ¿Cuándo podrías pasar por ella?', DATE_SUB(NOW(), INTERVAL 23 HOUR), 'INTERCAMBIO', 1),
                                                                                                 (2, 'Juan Pérez', 'Podría pasar mañana saliendo de mis clases cerca de Lindavista, ¿te queda bien?', DATE_SUB(NOW(), INTERVAL 22 HOUR), 'INTERCAMBIO', 1);

-- Chat de Intercambio 2 (Completada: Carlos le pidió el Microondas a Juan - id_solicitud = 2)
INSERT INTO mensajes (id_remitente, nombre_remitente, contenido, fecha, tipo, id_referencia) VALUES
                                                                                                 (4, 'Carlos López', '¡Qué tal Juan! Ya estoy afuera de ESCOM para hacer el intercambio del microondas.', DATE_SUB(NOW(), INTERVAL 3 DAY), 'INTERCAMBIO', 2),
                                                                                                 (2, 'Juan Pérez', 'Perfecto Carlos, voy bajando con el microondas. Llevo playera azul.', DATE_SUB(NOW(), INTERVAL 3 DAY), 'INTERCAMBIO', 2),
                                                                                                 (4, 'Carlos López', 'Ya te vi, gracias. ¡Funciona perfecto!', DATE_SUB(NOW(), INTERVAL 2 DAY), 'INTERCAMBIO', 2);

-- 5. POPULAR REVIEWS (CALIFICACIONES EN SOLICITUDES)
-- Solo se pueden calificar solicitudes con estado 'COMPLETADA'.
-- En tus datos base, la solicitud 2 (Microondas) ya está completada.

-- Carlos califica a Juan por el intercambio del Microondas (5 estrellas)
UPDATE solicitudes
SET calificacion = 5
WHERE id_solicitud = 2;

-- 6. POPULAR REPORTES

-- Reporte 1: Juan reporta a Carlos (Estado: PENDIENTE, para ver en el panel de admin)
INSERT INTO reportes (id_reportante, nombre_reportante, id_reportado, nombre_reportado, motivo, estado, fecha) VALUES
    (2, 'Juan Pérez', 4, 'Carlos López', 'El usuario se mostró insistente y agresivo en otro intercambio que cancelé.', 'PENDIENTE', DATE_SUB(NOW(), INTERVAL 12 HOUR));

-- Reporte 2: María reporta un comportamiento anómalo de Juan (Estado: IGNORADO, el admin ya lo revisó)
INSERT INTO reportes (id_reportante, nombre_reportante, id_reportado, nombre_reportado, motivo, estado, fecha) VALUES
    (3, 'María González', 2, 'Juan Pérez', 'Publicó un artículo que parece ser falso o engañoso.', 'IGNORADO', DATE_SUB(NOW(), INTERVAL 5 DAY));

-- Reporte 3: Carlos reporta a un usuario (hipotético/prueba) (Estado: SANCIONADO)
INSERT INTO reportes (id_reportante, nombre_reportante, id_reportado, nombre_reportado, motivo, estado, fecha) VALUES
    (4, 'Carlos López', 3, 'María González', 'Me canceló el intercambio en el último minuto cuando ya estaba en el punto de encuentro.', 'SANCIONADO', DATE_SUB(NOW(), INTERVAL 10 DAY));