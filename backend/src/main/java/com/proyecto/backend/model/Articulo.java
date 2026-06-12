package com.proyecto.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "articulos")
public class Articulo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idArticulo;
    private String tituloArticulo;
    private String descripcionDetallada;
    private String estadoConservacion;
    private boolean disponible = true;
    private double latitudUbicacion;
    private double longitudUbicacion;
    private String urlImagen;
    private Long idUsuarioPropietario;
    private Long idCategoria;

    public Articulo() {}
    public Long getIdArticulo() { return idArticulo; }
    public void setIdArticulo(Long id) { this.idArticulo = id; }
    public String getTituloArticulo() { return tituloArticulo; }
    public void setTituloArticulo(String t) { this.tituloArticulo = t; }
    public String get遊戏() { return descripcionDetallada; }
    public String getDescripcionDetallada() { return descripcionDetallada; }
    public void setDescripcionDetallada(String d) { this.descripcionDetallada = d; }
    public String getEstadoConservacion() { return estadoConservacion; }
    public void setEstadoConservacion(String e) { this.estadoConservacion = e; }
    public boolean isDisponible() { return disponible; }
    public void setDisponible(boolean d) { this.disponible = d; }
    public double getLatitudUbicacion() { return latitudUbicacion; }
    public void setLatitudUbicacion(double l) { this.latitudUbicacion = l; }
    public double getLongitudUbicacion() { return longitudUbicacion; }
    public void setLongitudUbicacion(double l) { this.longitudUbicacion = l; }
    public String getUrlImagen() { return urlImagen; }
    public void setUrlImagen(String u) { this.urlImagen = u; }
    public Long getIdUsuarioPropietario() { return idUsuarioPropietario; }
    public void setIdUsuarioPropietario(Long id) { this.idUsuarioPropietario = id; }
    public Long getIdCategoria() { return idCategoria; }
    public void setIdCategoria(Long id) { this.idCategoria = id; }
}
