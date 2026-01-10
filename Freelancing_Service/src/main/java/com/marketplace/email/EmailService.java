package com.marketplace.email;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    
    private final JavaMailSender mailSender;
    @SuppressWarnings("unused")
	private final TemplateEngine templateEngine;
    
    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }
    
    // Send simple text email
    public void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        message.setFrom("noreply@freelancemarketplace.com");
        
        mailSender.send(message);
    }
    
    // Send HTML email
    public void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        helper.setFrom("noreply@freelancemarketplace.com");
        
        mailSender.send(message);
    }
    
    // Send welcome email
    public void sendWelcomeEmail(String to, String name) {
        String subject = "Welcome to Freelance Marketplace!";
        String text = "Hello " + name + ",\n\n" +
                      "Your account has been created successfully.\n\n" +
                      "Best regards,\nFreelance Marketplace Team";
        
        sendSimpleEmail(to, subject, text);  // Use simple email instead of HTML
    }
    
    // Send password reset email
    public void sendPasswordResetEmail(String to, String token) {
        String resetLink = "http://localhost:3000/reset-password?token=" + token;
        String subject = "Password Reset Request";
        String text = "Click this link to reset your password:\n" + resetLink + 
                      "\n\nThis link expires in 24 hours.\n\n" +
                      "If you didn't request this, please ignore this email.";
        
        sendSimpleEmail(to, subject, text);  // Use simple email instead of HTML
    }
    
    // Send proposal notification
    public void sendProposalNotification(String clientEmail, String clientName, 
                                        String freelancerName, String jobTitle) {
        String subject = "New Proposal Received for: " + jobTitle;
        String text = String.format(
            "Hello %s,\n\nYou have received a new proposal from %s for your job: %s\n\n" +
            "Please login to review the proposal.\n\nBest regards,\nFreelance Marketplace Team",
            clientName, freelancerName, jobTitle
        );
        
        sendSimpleEmail(clientEmail, subject, text);
    }
    
    // Send contract notification
    public void sendContractNotification(String freelancerEmail, String freelancerName,
                                        String clientName, String jobTitle) {
        String subject = "Congratulations! Your Proposal was Accepted";
        String text = String.format(
            "Hello %s,\n\n%s has accepted your proposal for: %s\n\n" +
            "A contract has been created. Please login to review and accept the contract terms.\n\n" +
            "Best regards,\nFreelance Marketplace Team",
            freelancerName, clientName, jobTitle
        );
        
        sendSimpleEmail(freelancerEmail, subject, text);
    }
}