package com.proyecto.backend.repository;

import com.proyecto.backend.model.Articulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticuloRepository extends JpaRepository<Articulo, Long> {
    List<Articulo> findByDisponibleTrueAndEstadoPublicacion(String estadoPublicacion);
    List<Articulo> findByEstadoPublicacion(String estadoPublicacion);
    List<Articulo> findByIdUsuarioPropietario(Long idUsuarioPropietario);
    List<Articulo> findByIdCategoriaAndDisponibleTrueAndEstadoPublicacion(Long idCategoria, String estadoPublicacion);

    @Query("SELECT a FROM Articulo a WHERE a.disponible = true AND a.estadoPublicacion = 'APROBADO' AND (LOWER(a.tituloArticulo) LIKE LOWER(CONCAT('%', :texto, '%')) OR LOWER(a.descripcionDetallada) LIKE LOWER(CONCAT('%', :texto, '%')))")
    List<Articulo> buscarPorTexto(@Param("texto") String texto);

    @Query(value = "SELECT * FROM articulos WHERE disponible = true AND estado_publicacion = 'APROBADO' AND (6371 * acos(cos(radians(:lat)) * cos(radians(latitud_ubicacion)) * cos(radians(longitud_ubicacion) - radians(:lng)) + sin(radians(:lat)) * sin(radians(latitud_ubicacion)))) <= :radio", nativeQuery = true)
    List<Articulo> buscarCercanos(@Param("lat") double lat, @Param("lng") double lng, @Param("radio") double radio);
}
