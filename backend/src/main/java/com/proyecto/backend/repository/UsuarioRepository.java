package com.proyecto.backend.repository;

import com.proyecto.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByCorreoElectronico(String correoElectronico);
    Optional<Usuario> findByCorreoElectronico(String correoElectronico);
    Optional<Usuario> findByTokenActivacion(String tokenActivacion);
}
