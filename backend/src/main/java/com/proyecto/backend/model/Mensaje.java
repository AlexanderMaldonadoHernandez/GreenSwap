package com.proyecto.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensajes")
public class Mensaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMensaje;
    private Long idRemitente;
    private String nombreRemitente;
    private String contenido;
    private LocalDateTime fecha = LocalDateTime.now();
    private String tipo; // INTERCAMBIO | SOPORTE
    private Long idReferencia; // idSolicitud o idUsuario según tipo

    public Mensaje() {}
    public Long getIdMensaje() { return idMensaje; }
    public void setIdMensaje(Long id) { this.idMensaje = id; }
    public Long getIdRemitente() { return idRemitente; }
    public void setIdRemitente(Long id) { this.idRemitente = id; }
    public String getNombreRemitente() { return nombreRemitente; }
    public void setNombreRemitente(String n) { this.nombreRemitente = n; }
    public String getContenido() { return contenido; }
    public void setContenido(String c) { this.contenido = c; }
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime f) { this.fecha = f; }
    public String getTipo() { return tipo; }
    public void setTipo(String t) { this.tipo = t; }
    public Long getIdReferencia() { return idReferencia; }
    public void setIdReferencia(Long id) { this.idReferencia = id; }
}
