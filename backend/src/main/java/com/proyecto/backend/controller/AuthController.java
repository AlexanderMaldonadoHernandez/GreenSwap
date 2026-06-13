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

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        if(usuarioRepository.findByCorreoElectronico(usuario.getCorreoElectronico()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "Error: El correo electrónico ya existe en el sistema."));
        }

        // Encriptamos la contraseña antes de guardar al usuario en la BD
        usuario.setPasswordHash(passwordEncoder.encode(usuario.getPasswordHash()));
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of("mensaje", "Usuario registrado con éxito"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario req) {
        Optional<Usuario> userOpt = usuarioRepository.findByCorreoElectronico(req.getCorreoElectronico());

        // Validamos usando passwordEncoder para comparar la contraseña en texto plano (req) con el hash (BD)
        if(userOpt.isPresent() && passwordEncoder.matches(req.getPasswordHash(), userOpt.get().getPasswordHash())) {
            // Generamos el token JWT si es exitoso
            String token = jwtUtil.generateToken(req.getCorreoElectronico());
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "usuario", Map.of(
                            "nombre", userOpt.get().getNombreCompleto(),
                            "correo", userOpt.get().getCorreoElectronico()
                    )
            ));
        }
        return ResponseEntity.status(401).body(Map.of("mensaje", "Error: Credenciales de acceso incorrectas."));
    }
}