package com.proyecto.backend.controller;

import com.proyecto.backend.model.Reporte;
import com.proyecto.backend.repository.ReporteRepository;
import com.proyecto.backend.repository.SolicitudRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    @Autowired
    private ReporteRepository reporteRepository;

    @Autowired
    private SolicitudRepository solicitudRepository;

    @PostMapping
    public ResponseEntity<?> crearReporte(@RequestBody Map<String, Object> payload) {
        Reporte reporte = new Reporte();
        reporte.setIdReportante(Long.valueOf(payload.get("idReportante").toString()));
        reporte.setNombreReportante(payload.get("nombreReportante").toString());
        reporte.setIdReportado(Long.valueOf(payload.get("idReportado").toString()));
        reporte.setNombreReportado(payload.get("nombreReportado").toString());
        reporte.setMotivo(payload.get("motivo").toString());

        // Si viene de un chat de intercambio, bloqueamos el chat
        if (payload.containsKey("idSolicitud")) {
            Long idSol = Long.valueOf(payload.get("idSolicitud").toString());
            solicitudRepository.findById(idSol).ifPresent(s -> {
                s.setEstado("BLOQUEADO");
                solicitudRepository.save(s);
            });
        }

        return ResponseEntity.ok(reporteRepository.save(reporte));
    }
}