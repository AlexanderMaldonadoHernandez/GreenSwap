package com.proyecto.backend.controller;

import com.proyecto.backend.model.Articulo;
import com.proyecto.backend.model.Solicitud;
import com.proyecto.backend.model.Usuario;
import com.proyecto.backend.repository.ArticuloRepository;
import com.proyecto.backend.repository.SolicitudRepository;
import com.proyecto.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.proyecto.backend.model.Reporte;
import com.proyecto.backend.repository.ReporteRepository;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private ArticuloRepository articuloRepository;

    @Autowired
    private SolicitudRepository solicitudRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ReporteRepository reporteRepository;

    @GetMapping("/reportes")
    public List<Reporte> listarReportesPendientes() {
        return reporteRepository.findByEstadoOrderByFechaDesc("PENDIENTE");
    }

    @PutMapping("/reportes/{id}/ignorar")
    public ResponseEntity<?> ignorarReporte(@PathVariable Long id) {
        return reporteRepository.findById(id).map(r -> {
            r.setEstado("IGNORADO");
            reporteRepository.save(r);
            return ResponseEntity.ok(Map.of("mensaje", "Reporte ignorado."));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/reportes/{id}/sancionar")
    public ResponseEntity<?> sancionarReporte(@PathVariable Long id) {
        return reporteRepository.findById(id).map(r -> {
            r.setEstado("SANCIONADO");
            reporteRepository.save(r);
            return ResponseEntity.ok(Map.of("mensaje", "Reporte procesado y usuario sancionado."));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/articulos/pendientes")
    public List<Articulo> listarPendientes() {
        return articuloRepository.findByEstadoPublicacion("PENDIENTE");
    }

    @GetMapping("/articulos/todos")
    public List<Articulo> listarTodos() {
        return articuloRepository.findAll();
    }

    @PutMapping("/articulos/{id}/aprobar")
    public ResponseEntity<?> aprobar(@PathVariable Long id) {
        return articuloRepository.findById(id).map(art -> {
            art.setEstadoPublicacion("APROBADO");
            art.setMotivoRechazo(null);
            articuloRepository.save(art);
            return ResponseEntity.ok(Map.of("mensaje", "Publicación aprobada."));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/articulos/{id}/rechazar")
    public ResponseEntity<?> rechazar(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String motivo = body.getOrDefault("motivo", "No cumple con las políticas de GreenSwap.");
        return articuloRepository.findById(id).map(art -> {
            art.setEstadoPublicacion("RECHAZADO");
            art.setMotivoRechazo(motivo);
            articuloRepository.save(art);
            return ResponseEntity.ok(Map.of("mensaje", "Publicación rechazada."));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/intercambios")
    public List<Map<String, Object>> listarIntercambios(@RequestParam(required = false) String estado) {
        List<Solicitud> solicitudes = (estado != null && !estado.isBlank())
            ? solicitudRepository.findByEstadoOrderByFechaDesc(estado)
            : solicitudRepository.findAllByOrderByFechaDesc();

        return solicitudes.stream().map(s -> {
            String nombreComprador = usuarioRepository.findById(s.getIdUsuarioSolicitante())
                .map(Usuario::getNombreCompleto).orElse("Usuario eliminado");
            String nombreVendedor = usuarioRepository.findById(s.getIdUsuarioPropietario())
                .map(Usuario::getNombreCompleto).orElse("Usuario eliminado");
            Map<String, Object> m = new java.util.HashMap<>();
            m.put("idSolicitud", s.getIdSolicitud());
            m.put("tituloArticulo", s.getTituloArticulo());
            m.put("comprador", nombreComprador);
            m.put("vendedor", nombreVendedor);
            m.put("fecha", s.getFecha().toString());
            m.put("estado", s.getEstado());
            return m;
        }).collect(java.util.stream.Collectors.toList());
    }

    @DeleteMapping("/articulos/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        if (!articuloRepository.existsById(id)) return ResponseEntity.notFound().build();
        String motivo = body != null ? body.getOrDefault("motivo", "Eliminado por el administrador.") : "Eliminado por el administrador.";
        articuloRepository.findById(id).ifPresent(art -> {
            art.setEstadoPublicacion("RECHAZADO");
            art.setMotivoRechazo(motivo);
            art.setDisponible(false);
            articuloRepository.save(art);
        });
        return ResponseEntity.ok(Map.of("mensaje", "Publicación eliminada y usuario notificado."));
    }
}
