package com.proyecto.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitudes")
public class Solicitud {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSolicitud;
    private Long idArticulo;
    private String tituloArticulo;
    private Long idUsuarioSolicitante;
    private Long idUsuarioPropietario;
    private LocalDateTime fecha = LocalDateTime.now();
    private String estado = "PENDIENTE";

    public Solicitud() {}
    public Long getIdSolicitud() { return idSolicitud; }
    public void setIdSolicitud(Long id) { this.idSolicitud = id; }
    public Long getIdArticulo() { return idArticulo; }
    public void setIdArticulo(Long id) { this.idArticulo = id; }
    public String getTituloArticulo() { return tituloArticulo; }
    public void setTituloArticulo(String t) { this.tituloArticulo = t; }
    public Long getIdUsuarioSolicitante() { return idUsuarioSolicitante; }
    public void setIdUsuarioSolicitante(Long id) { this.idUsuarioSolicitante = id; }
    public Long getIdUsuarioPropietario() { return idUsuarioPropietario; }
    public void setIdUsuarioPropietario(Long id) { this.idUsuarioPropietario = id; }
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime f) { this.fecha = f; }
    public String getEstado() { return estado; }
    public void setEstado(String e) { this.estado = e; }
}
