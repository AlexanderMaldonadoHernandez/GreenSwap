package com.proyecto.backend.repository;

import com.proyecto.backend.model.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {
    List<Mensaje> findByTipoAndIdReferenciaOrderByFechaAsc(String tipo, Long idReferencia);

    @Query("SELECT DISTINCT m.idReferencia FROM Mensaje m WHERE m.tipo = 'SOPORTE'")
    List<Long> findUsuariosConSoporte();
}
