package com.proyecto.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;
    private String nombreCompleto;
    @Column(unique = true)
    private String correoElectronico;
    private String passwordHash;
    private String telefonoContacto;
    private String rol = "USUARIO";
    @Column(length = 6)
    private String codigoRecuperacion;
    private String tokenActivacion;

    public Usuario() {}
    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long id) { this.idUsuario = id; }
    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String n) { this.nombreCompleto = n; }
    public String getCorreoElectronico() { return correoElectronico; }
    public void setCorreoElectronico(String e) { this.correoElectronico = e; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String p) { this.passwordHash = p; }
    public String getTelefonoContacto() { return telefonoContacto; }
    public void setTelefonoContacto(String t) { this.telefonoContacto = t; }
    public String getRol() { return rol; }
    public void setRol(String r) { this.rol = r; }
    public String getCodigoRecuperacion() { return codigoRecuperacion; }
    public void setCodigoRecuperacion(String codigo) { this.codigoRecuperacion = codigo; }
    private boolean cuentaActiva = false;
    public boolean isCuentaActiva() { return cuentaActiva; }
    public void setCuentaActiva(boolean cuentaActiva) { this.cuentaActiva = cuentaActiva; }
    public String getTokenActivacion() { return tokenActivacion; }
    public void setTokenActivacion(String tokenActivacion) { this.tokenActivacion = tokenActivacion; }
}
