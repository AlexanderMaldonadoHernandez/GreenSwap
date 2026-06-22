package com.proyecto.backend.repository;

import com.proyecto.backend.model.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {
    List<Mensaje> findByTipoAndIdReferenciaOrderByFechaAsc(String tipo, Long idReferencia);

    @Modifying
    @Transactional
    @Query("DELETE FROM Mensaje m WHERE m.idReferencia = :idReferencia AND m.tipo = :tipo")
    void deleteByIdReferenciaAndTipo(Long idReferencia, String tipo);

    @Query("SELECT DISTINCT m.idReferencia FROM Mensaje m WHERE m.tipo = 'SOPORTE'")
    List<Long> findUsuariosConSoporte();
}
