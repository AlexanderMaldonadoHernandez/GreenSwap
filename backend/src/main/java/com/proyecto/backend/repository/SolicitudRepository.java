package com.proyecto.backend.repository;

import com.proyecto.backend.model.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {
    List<Solicitud> findByIdUsuarioSolicitanteOrderByFechaDesc(Long idUsuarioSolicitante);
    List<Solicitud> findByIdUsuarioPropietarioOrderByFechaDesc(Long idUsuarioPropietario);
    Optional<Solicitud> findByIdArticuloAndIdUsuarioSolicitante(Long idArticulo, Long idUsuarioSolicitante);
    List<Solicitud> findAllByOrderByFechaDesc();
    List<Solicitud> findByEstadoOrderByFechaDesc(String estado);
    List<Solicitud> findByIdUsuarioPropietarioAndCalificacionIsNotNull(Long idUsuarioPropietario);
}
