package com.proyecto.backend.controller;

import com.proyecto.backend.model.Articulo;
import com.proyecto.backend.repository.ArticuloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/articulos")
@CrossOrigin(origins = "*")
public class ArticuloController {

    @Autowired
    private ArticuloRepository articuloRepository;

    @PostMapping
    public Articulo crear(@RequestBody Articulo articulo) {
        articulo.setDisponible(true);
        return articuloRepository.save(articulo);
    }

    @GetMapping
    public List<Articulo> listar(@RequestParam(required = false) Long categoriaId) {
        if(categoriaId != null) {
            return articuloRepository.findByIdCategoriaAndDisponibleTrue(categoriaId);
        }
        return articuloRepository.findByDisponibleTrue();
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
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        if(articuloRepository.existsById(id)) {
            articuloRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
