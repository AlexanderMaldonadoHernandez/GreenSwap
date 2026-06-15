package com.proyecto.backend.controller;

import com.proyecto.backend.model.Mensaje;
import com.proyecto.backend.model.Usuario;
import com.proyecto.backend.repository.MensajeRepository;
import com.proyecto.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private MensajeRepository mensajeRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/intercambio/{idSolicitud}")
    public List<Mensaje> getMensajesIntercambio(@PathVariable Long idSolicitud) {
        return mensajeRepository.findByTipoAndIdReferenciaOrderByFechaAsc("INTERCAMBIO", idSolicitud);
    }

    @PostMapping("/intercambio/{idSolicitud}")
    public ResponseEntity<?> enviarIntercambio(@PathVariable Long idSolicitud, @RequestBody Map<String, Object> body) {
        return crearMensaje("INTERCAMBIO", idSolicitud, body);
    }

    @GetMapping("/soporte/{idUsuario}")
    public List<Mensaje> getMensajesSoporte(@PathVariable Long idUsuario) {
        return mensajeRepository.findByTipoAndIdReferenciaOrderByFechaAsc("SOPORTE", idUsuario);
    }

    @PostMapping("/soporte/{idUsuario}")
    public ResponseEntity<?> enviarSoporte(@PathVariable Long idUsuario, @RequestBody Map<String, Object> body) {
        return crearMensaje("SOPORTE", idUsuario, body);
    }

    @GetMapping("/admin/tickets")
    public ResponseEntity<?> getTicketsSoporte() {
        List<Long> ids = mensajeRepository.findUsuariosConSoporte();
        List<Map<String, Object>> tickets = ids.stream().map(idUsuario -> {
            String nombre = usuarioRepository.findById(idUsuario)
                .map(Usuario::getNombreCompleto).orElse("Usuario eliminado");
            List<Mensaje> msgs = mensajeRepository.findByTipoAndIdReferenciaOrderByFechaAsc("SOPORTE", idUsuario);
            Map<String, Object> m = new java.util.HashMap<>();
            m.put("idUsuario", idUsuario);
            m.put("nombre", nombre);
            m.put("totalMensajes", msgs.size());
            m.put("ultimoMensaje", msgs.isEmpty() ? "" : msgs.get(msgs.size() - 1).getContenido());
            return m;
        }).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(tickets);
    }

    private ResponseEntity<?> crearMensaje(String tipo, Long idReferencia, Map<String, Object> body) {
        Long idRemitente = Long.valueOf(body.get("idRemitente").toString());
        String contenido = body.get("contenido").toString().trim();
        if (contenido.isEmpty()) return ResponseEntity.badRequest().body(Map.of("mensaje", "El mensaje no puede estar vacío."));

        String nombre = usuarioRepository.findById(idRemitente)
            .map(Usuario::getNombreCompleto).orElse("Usuario");

        Mensaje m = new Mensaje();
        m.setTipo(tipo);
        m.setIdReferencia(idReferencia);
        m.setIdRemitente(idRemitente);
        m.setNombreRemitente(nombre);
        m.setContenido(contenido);
        return ResponseEntity.ok(mensajeRepository.save(m));
    }
}
