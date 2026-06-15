package com.proyecto.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCodigoRecuperacion(String destino, String codigo) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destino);
        message.setSubject("Código de Recuperación - GreenSwap");
        message.setText("Hola,\n\nHas solicitado restablecer tu contraseña.\n"
                + "Tu código de seguridad de 6 dígitos es: " + codigo + "\n\n"
                + "Si no fuiste tú, por favor ignora este correo.");
        mailSender.send(message);
    }
}