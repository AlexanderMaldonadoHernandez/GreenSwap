package com.proyecto.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reportes")
public class Reporte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idReporte;
    private Long idReportante;
    private String nombreReportante;
    private Long idReportado;
    private String nombreReportado;
    private String motivo;
    private String estado = "PENDIENTE"; // PENDIENTE, IGNORADO, SANCIONADO
    private LocalDateTime fecha = LocalDateTime.now();

    public Reporte() {}

    public Long getIdReporte() { return idReporte; }
    public void setIdReporte(Long idReporte) { this.idReporte = idReporte; }
    public Long getIdReportante() { return idReportante; }
    public void setIdReportante(Long idReportante) { this.idReportante = idReportante; }
    public String getNombreReportante() { return nombreReportante; }
    public void setNombreReportante(String nombreReportante) { this.nombreReportante = nombreReportante; }
    public Long getIdReportado() { return idReportado; }
    public void setIdReportado(Long idReportado) { this.idReportado = idReportado; }
    public String getNombreReportado() { return nombreReportado; }
    public void setNombreReportado(String nombreReportado) { this.nombreReportado = nombreReportado; }
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
}