package com.proyecto.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import java.io.UnsupportedEncodingException;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.backend.url}")
    private String backendUrl;

    @Value("${spring.mail.username}")
    private String correoRemitente;

    public void enviarCorreoActivacion(String destino, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(correoRemitente, "El equipo de GreenSwap");
            helper.setTo(destino);
            helper.setSubject("Activa tu cuenta - GreenSwap");

            String url = backendUrl + "/api/auth/activar?token=" + token;

            String htmlMsg = "<div style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>"
                    + "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);'>"
                    + "<div style='text-align: center; margin-bottom: 20px;'>"
                    + "<img src='cid:logoImagen' alt='Logo de la empresa' style='max-width: 120px;'>"
                    + "</div>"
                    + "<h2 style='color: #2e7d32; text-align: center;'>¡Bienvenido a la plataforma!</h2>"
                    + "<p style='color: #555555; font-size: 16px; line-height: 1.5;'>Hola,</p>"
                    + "<p style='color: #555555; font-size: 16px; line-height: 1.5;'>Gracias por registrarte. Para comenzar a utilizar los servicios por favor activa tu cuenta haciendo clic en el siguiente botón:</p>"
                    + "<div style='text-align: center; margin: 30px 0;'>"
                    + "<a href='" + url + "' style='background-color: #2e7d32; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;'>Activar mi cuenta</a>"
                    + "</div>"
                    + "<p style='color: #999999; font-size: 12px; text-align: center; margin-top: 30px;'>Si no solicitaste este registro ignora este mensaje.</p>"
                    + "</div>"
                    + "</div>";

            helper.setText(htmlMsg, true);

            ClassPathResource image = new ClassPathResource("logo-azul.png");
            helper.addInline("logoImagen", image);

            mailSender.send(message);

        } catch (MessagingException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    public void enviarCodigoRecuperacion(String destino, String codigo) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(correoRemitente, "El equipo de GreenSwap");
            helper.setTo(destino);
            helper.setSubject("Código de recuperación - GreenSwap");

            String htmlMsg = "<div style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>"
                    + "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);'>"
                    + "<div style='text-align: center; margin-bottom: 20px;'>"
                    + "<img src='cid:logoImagen' alt='Logo de la empresa' style='max-width: 120px;'>"
                    + "</div>"
                    + "<h2 style='color: #2e7d32; text-align: center;'>Recuperación de Contraseña</h2>"
                    + "<p style='color: #555555; font-size: 16px; line-height: 1.5;'>Hola,</p>"
                    + "<p style='color: #555555; font-size: 16px; line-height: 1.5;'>Has solicitado restablecer tu contraseña. Tu código de seguridad de 6 dígitos es el siguiente:</p>"
                    + "<div style='text-align: center; margin: 30px 0;'>"
                    + "<span style='background-color: #f0f0f0; color: #333333; padding: 15px 30px; border-radius: 5px; font-weight: bold; font-size: 24px; letter-spacing: 5px;'>" + codigo + "</span>"
                    + "</div>"
                    + "<p style='color: #999999; font-size: 12px; text-align: center; margin-top: 30px;'>Si no fuiste tú por favor ignora este correo.</p>"
                    + "</div>"
                    + "</div>";

            helper.setText(htmlMsg, true);

            ClassPathResource image = new ClassPathResource("logo-azul.png");
            helper.addInline("logoImagen", image);

            mailSender.send(message);

        } catch (MessagingException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }
}