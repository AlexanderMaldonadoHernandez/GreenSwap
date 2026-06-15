package com.proyecto.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class ArchivoController {

    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping
    public ResponseEntity<?> subirImagen(@RequestParam("archivo") MultipartFile archivo) {
        if (archivo.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "El archivo está vacío."));
        }

        String tipo = archivo.getContentType();
        if (tipo == null || (!tipo.equals("image/jpeg") && !tipo.equals("image/png"))) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "Solo se permiten archivos JPG o PNG."));
        }

        try {
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) dir.mkdirs();

            String extension = tipo.equals("image/png") ? ".png" : ".jpg";
            String nombreArchivo = UUID.randomUUID().toString() + extension;
            Path ruta = Paths.get(UPLOAD_DIR + nombreArchivo);
            Files.write(ruta, archivo.getBytes());

            String url = "http://localhost:8080/uploads/" + nombreArchivo;
            return ResponseEntity.ok(Map.of("url", url));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("mensaje", "Error al guardar el archivo."));
        }
    }
}
