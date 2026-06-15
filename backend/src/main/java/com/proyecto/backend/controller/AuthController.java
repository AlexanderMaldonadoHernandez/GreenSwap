package com.proyecto.backend.controller;

import com.proyecto.backend.model.Usuario;
import com.proyecto.backend.repository.UsuarioRepository;
import com.proyecto.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private com.proyecto.backend.service.EmailService emailService;

    @PostMapping("/solicitar-recuperacion")
    public ResponseEntity<?> solicitarRecuperacion(@RequestBody Map<String, String> request) {
        String correo = request.get("correoElectronico");
        Optional<Usuario> userOpt = usuarioRepository.findByCorreoElectronico(correo);

        if(userOpt.isPresent()) {
            Usuario usuario = userOpt.get();
            // Generar código aleatorio de 6 dígitos
            String codigo = String.format("%06d", new java.util.Random().nextInt(999999));
            usuario.setCodigoRecuperacion(codigo);
            usuarioRepository.save(usuario); // Guardamos el código en MySQL

            // Enviamos el correo
            emailService.enviarCodigoRecuperacion(correo, codigo);
            return ResponseEntity.ok(Map.of("mensaje", "Si el correo existe, se ha enviado un código de validación."));
        }

        // Mensaje genérico por seguridad
        return ResponseEntity.ok(Map.of("mensaje", "Si el correo existe, se ha enviado un código de validación."));
    }

    @PostMapping("/restablecer-password")
    public ResponseEntity<?> restablecerPassword(@RequestBody Map<String, String> request) {
        String correo = request.get("correoElectronico");
        String codigo = request.get("codigo");
        String nuevaPassword = request.get("nuevaPassword");

        Optional<Usuario> userOpt = usuarioRepository.findByCorreoElectronico(correo);

        if(userOpt.isPresent()) {
            Usuario usuario = userOpt.get();
            // Validamos que el código coincida y no sea nulo
            if(usuario.getCodigoRecuperacion() != null && usuario.getCodigoRecuperacion().equals(codigo)) {
                // Encriptamos la nueva contraseña
                usuario.setPasswordHash(passwordEncoder.encode(nuevaPassword));
                usuario.setCodigoRecuperacion(null); // Borramos el código para que no se re-use
                usuarioRepository.save(usuario);
                return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada con éxito."));
            }
        }
        return ResponseEntity.badRequest().body(Map.of("mensaje", "Código incorrecto o inválido."));
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {

        if (usuarioRepository.findByCorreoElectronico(usuario.getCorreoElectronico()).isPresent()) {
            return ResponseEntity.badRequest().body(
                    Map.of("mensaje", "Error: El correo electrónico ya existe en el sistema.")
            );
        }

        // Encriptamos la contraseña antes de guardar al usuario en la BD
        usuario.setPasswordHash(passwordEncoder.encode(usuario.getPasswordHash()));

        // Lógica de validación de correo
        usuario.setCuentaActiva(false);
        String token = java.util.UUID.randomUUID().toString();
        usuario.setTokenActivacion(token);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        // Enviamos el correo de activación
        emailService.enviarCorreoActivacion(usuarioGuardado.getCorreoElectronico(), token);

        return ResponseEntity.ok(Map.of(
                "mensaje", "Registro exitoso. Revisa tu bandeja de entrada o SPAM para activar tu cuenta.",
                "usuario", Map.of(
                        "idUsuario", usuarioGuardado.getIdUsuario(),
                        "nombre", usuarioGuardado.getNombreCompleto(),
                        "correo", usuarioGuardado.getCorreoElectronico()
                )
        ));
    }

    @GetMapping("/activar")
    public ResponseEntity<String> activarCuenta(@RequestParam String token) {
        Optional<Usuario> userOpt = usuarioRepository.findByTokenActivacion(token);

        if(userOpt.isPresent()) {
            Usuario usuario = userOpt.get();
            usuario.setCuentaActiva(true); // Se activa el acceso
            usuario.setTokenActivacion(null); // Se quema el token
            usuarioRepository.save(usuario);

            return ResponseEntity.ok("<div style='font-family: sans-serif; text-align: center; margin-top: 50px;'><h1 style='color: #2e7d32;'>Cuenta activada exitosamente</h1><p>Ya puedes cerrar esta pestaña e iniciar sesión en GreenSwap.</p></div>");
        }

        return ResponseEntity.badRequest().body("<div style='font-family: sans-serif; text-align: center; margin-top: 50px;'><h1 style='color: #c62828;'>Error de Activación</h1><p>El enlace es inválido o la cuenta ya fue activada previamente.</p></div>");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario req) {

        Optional<Usuario> userOpt = usuarioRepository.findByCorreoElectronico(req.getCorreoElectronico());

        if (userOpt.isPresent()) {
            Usuario usuarioEncontrado = userOpt.get();

            // Bloqueo estricto si la cuenta no ha sido verificada por correo
            if (!usuarioEncontrado.isCuentaActiva()) {
                return ResponseEntity.status(401).body(
                        Map.of("mensaje", "Error: Debes activar tu cuenta revisando el enlace en tu correo electrónico antes de iniciar sesión.")
                );
            }

            // Validación de contraseña
            if (passwordEncoder.matches(req.getPasswordHash(), usuarioEncontrado.getPasswordHash())) {

                // Generamos el token JWT si el login es correcto
                String token = jwtUtil.generateToken(usuarioEncontrado.getCorreoElectronico());

                return ResponseEntity.ok(Map.of(
                        "token", token,
                        "usuario", Map.of(
                                "idUsuario", usuarioEncontrado.getIdUsuario(),
                                "nombre", usuarioEncontrado.getNombreCompleto(),
                                "correo", usuarioEncontrado.getCorreoElectronico(),
                                "rol", usuarioEncontrado.getRol(),
                                "telefonoContacto", usuarioEncontrado.getTelefonoContacto()
                        )
                ));
            }
        }

        return ResponseEntity.status(401).body(
                Map.of("mensaje", "Error: Credenciales de acceso incorrectas.")
        );
    }
}