package com.proyecto.backend.repository;

import com.proyecto.backend.model.Reporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReporteRepository extends JpaRepository<Reporte, Long> {
    List<Reporte> findByEstadoOrderByFechaDesc(String estado);
}