package com.proyecto.backend.controller;

import com.proyecto.backend.model.Articulo;
import com.proyecto.backend.model.Usuario;
import com.proyecto.backend.repository.ArticuloRepository;
import com.proyecto.backend.repository.UsuarioRepository;
import com.proyecto.backend.service.EmailService;
import com.proyecto.backend.repository.SolicitudRepository;
import com.proyecto.backend.repository.MensajeRepository;
import com.proyecto.backend.model.Solicitud;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ArticuloRepository articuloRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SolicitudRepository solicitudRepository;

    @Autowired
    private MensajeRepository mensajeRepository;

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarPerfil(@PathVariable Long id, @RequestBody Usuario datosActualizados) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);

        if (usuarioOpt.isPresent()) {
            Usuario usuarioExistente = usuarioOpt.get();
            boolean cambioCorreo = false;

            // Actualizamos los campos básicos permitidos
            usuarioExistente.setNombreCompleto(datosActualizados.getNombreCompleto());
            usuarioExistente.setTelefonoContacto(datosActualizados.getTelefonoContacto());

            // Validamos si quiere cambiar el correo y si el nuevo ya está en uso
            if(!usuarioExistente.getCorreoElectronico().equals(datosActualizados.getCorreoElectronico())) {
                if(usuarioRepository.findByCorreoElectronico(datosActualizados.getCorreoElectronico()).isPresent()) {
                    return ResponseEntity.badRequest().body(Map.of("mensaje", "El correo electrónico ingresado ya está en uso por otra cuenta."));
                }

                usuarioExistente.setCorreoElectronico(datosActualizados.getCorreoElectronico());

                usuarioExistente.setCuentaActiva(false);
                String nuevoToken = java.util.UUID.randomUUID().toString();
                usuarioExistente.setTokenActivacion(nuevoToken);

                emailService.enviarCorreoActivacion(usuarioExistente.getCorreoElectronico(), nuevoToken);

                cambioCorreo = true;
            }

            usuarioRepository.save(usuarioExistente);

            // Respondemos distinto dependiendo de si cambió el correo o no
            if (cambioCorreo) {
                return ResponseEntity.ok(Map.of(
                        "mensaje", "Hemos enviado un enlace de confirmación a tu nuevo correo. Por seguridad, tu sesión se cerrará.",
                        "requiereReinicio", true
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                        "mensaje", "Perfil actualizado con éxito.",
                        "requiereReinicio", false
                ));
            }
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> cambiarPassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            String passwordActual = request.get("passwordActual");
            String nuevaPassword = request.get("nuevaPassword");

            if (!passwordEncoder.matches(passwordActual, usuario.getPasswordHash())) {
                return ResponseEntity.badRequest().body(Map.of("mensaje", "La contraseña actual es incorrecta."));
            }

            usuario.setPasswordHash(passwordEncoder.encode(nuevaPassword));
            usuarioRepository.save(usuario);

            return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada con éxito."));
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCuenta(@PathVariable Long id) {
        if (usuarioRepository.existsById(id)) {
            // 1. Eliminar artículos del usuario
            List<Articulo> articulosDelUsuario = articuloRepository.findByIdUsuarioPropietario(id);
            if (!articulosDelUsuario.isEmpty()) {
                articuloRepository.deleteAll(articulosDelUsuario);
            }

            // 2. Encontrar todas las solicitudes (compras y ventas) del usuario
            List<Solicitud> compras = solicitudRepository.findByIdUsuarioSolicitanteOrderByFechaDesc(id);
            List<Solicitud> ventas = solicitudRepository.findByIdUsuarioPropietarioOrderByFechaDesc(id);

            // 3. Borrar los mensajes (el chat) y luego la solicitud para que desaparezca para ambos
            for(Solicitud s : compras) {
                mensajeRepository.deleteByIdReferenciaAndTipo(s.getIdSolicitud(), "INTERCAMBIO");
                solicitudRepository.delete(s);
            }
            for(Solicitud s : ventas) {
                mensajeRepository.deleteByIdReferenciaAndTipo(s.getIdSolicitud(), "INTERCAMBIO");
                solicitudRepository.delete(s);
            }

            // 4. Borrar mensajes de soporte del usuario
            mensajeRepository.deleteByIdReferenciaAndTipo(id, "SOPORTE");

            // 5. Finalmente, eliminar el usuario
            usuarioRepository.deleteById(id);

            return ResponseEntity.ok(Map.of("mensaje", "Cuenta, artículos y chats eliminados exitosamente."));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> obtenerTodos() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }
}