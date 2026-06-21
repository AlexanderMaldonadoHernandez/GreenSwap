package com.proyecto.backend.controller;

import com.proyecto.backend.model.Reporte;
import com.proyecto.backend.repository.ReporteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    @Autowired
    private ReporteRepository reporteRepository;

    @PostMapping
    public ResponseEntity<?> crearReporte(@RequestBody Reporte reporte) {
        return ResponseEntity.ok(reporteRepository.save(reporte));
    }
}