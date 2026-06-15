package com.proyecto.backend.controller;

import com.proyecto.backend.model.Articulo;
import com.proyecto.backend.model.Solicitud;
import com.proyecto.backend.repository.ArticuloRepository;
import com.proyecto.backend.repository.SolicitudRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/solicitudes")
@CrossOrigin(origins = "*")
public class SolicitudController {

    @Autowired
    private SolicitudRepository solicitudRepository;

    @Autowired
    private ArticuloRepository articuloRepository;

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Map<String, Object> body) {
        Long idArticulo = Long.valueOf(body.get("idArticulo").toString());
        Long idSolicitante = Long.valueOf(body.get("idUsuarioSolicitante").toString());

        Articulo articulo = articuloRepository.findById(idArticulo).orElse(null);
        if (articulo == null) return ResponseEntity.badRequest().body(Map.of("mensaje", "Artículo no encontrado."));
        if (articulo.getIdUsuarioPropietario().equals(idSolicitante)) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "No puedes solicitar tu propio artículo."));
        }

        if (solicitudRepository.findByIdArticuloAndIdUsuarioSolicitante(idArticulo, idSolicitante).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "Ya enviaste una solicitud para este artículo."));
        }

        Solicitud s = new Solicitud();
        s.setIdArticulo(idArticulo);
        s.setTituloArticulo(articulo.getTituloArticulo());
        s.setIdUsuarioSolicitante(idSolicitante);
        s.setIdUsuarioPropietario(articulo.getIdUsuarioPropietario());

        return ResponseEntity.ok(solicitudRepository.save(s));
    }

    @GetMapping("/compras/{idUsuario}")
    public List<Solicitud> compras(@PathVariable Long idUsuario) {
        return solicitudRepository.findByIdUsuarioSolicitanteOrderByFechaDesc(idUsuario);
    }

    @GetMapping("/ventas/{idUsuario}")
    public List<Solicitud> ventas(@PathVariable Long idUsuario) {
        return solicitudRepository.findByIdUsuarioPropietarioOrderByFechaDesc(idUsuario);
    }

    @PutMapping("/{id}/aceptar")
    public ResponseEntity<?> aceptar(@PathVariable Long id) {
        return solicitudRepository.findById(id).map(s -> {
            s.setEstado("ACEPTADA");
            solicitudRepository.save(s);
            articuloRepository.findById(s.getIdArticulo()).ifPresent(art -> {
                art.setDisponible(false);
                articuloRepository.save(art);
            });
            return ResponseEntity.ok(s);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/rechazar")
    public ResponseEntity<?> rechazar(@PathVariable Long id) {
        return solicitudRepository.findById(id).map(s -> {
            s.setEstado("RECHAZADA");
            return ResponseEntity.ok(solicitudRepository.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/entregar")
    public ResponseEntity<?> entregar(@PathVariable Long id) {
        return solicitudRepository.findById(id).map(s -> {
            if (!s.getEstado().equals("ACEPTADA"))
                return ResponseEntity.badRequest().body(Map.of("mensaje", "La solicitud no está en estado ACEPTADA."));
            s.setEstado("ENTREGADO");
            return ResponseEntity.ok(solicitudRepository.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/recibido")
    public ResponseEntity<?> recibido(@PathVariable Long id) {
        return solicitudRepository.findById(id).map(s -> {
            if (!s.getEstado().equals("ENTREGADO"))
                return ResponseEntity.badRequest().body(Map.of("mensaje", "El vendedor aún no ha marcado la entrega."));
            s.setEstado("COMPLETADA");
            return ResponseEntity.ok(solicitudRepository.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }
}
