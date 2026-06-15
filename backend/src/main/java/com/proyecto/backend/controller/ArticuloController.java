package com.proyecto.backend.controller;

import com.proyecto.backend.model.Articulo;
import com.proyecto.backend.repository.ArticuloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/articulos")
@CrossOrigin(origins = "*")
public class ArticuloController {

    @Autowired
    private ArticuloRepository articuloRepository;

    @PostMapping
    public Articulo crear(@RequestBody Articulo articulo) {
        articulo.setDisponible(true);
        articulo.setEstadoPublicacion("PENDIENTE");
        return articuloRepository.save(articulo);
    }

    @GetMapping
    public List<Articulo> listar(
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) String busqueda) {
        if (busqueda != null && !busqueda.isBlank()) {
            return articuloRepository.buscarPorTexto(busqueda.trim());
        }
        if (categoriaId != null) {
            return articuloRepository.findByIdCategoriaAndDisponibleTrueAndEstadoPublicacion(categoriaId, "APROBADO");
        }
        return articuloRepository.findByDisponibleTrueAndEstadoPublicacion("APROBADO");
    }

    @GetMapping("/cercanos")
    public List<Articulo> cercanos(@RequestParam double lat, @RequestParam double lng, @RequestParam double radio) {
        return articuloRepository.buscarCercanos(lat, lng, radio);
    }

    @GetMapping("/usuario/{id}")
    public List<Articulo> listarPorUsuario(@PathVariable Long id) {
        return articuloRepository.findByIdUsuarioPropietario(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id, @RequestParam Long idUsuario) {
        return articuloRepository.findById(id).map(art -> {
            if (!art.getIdUsuarioPropietario().equals(idUsuario)) {
                return ResponseEntity.status(403).body(Map.of("mensaje", "No tienes permiso para eliminar este artículo."));
            }
            articuloRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
