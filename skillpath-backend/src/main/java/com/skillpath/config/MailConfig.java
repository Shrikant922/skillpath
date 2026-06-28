package com.skillpath.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;

@Configuration
public class MailConfig {
    // JavaMailSender is auto-configured by Spring Boot via application.properties
    // This class is reserved for additional mail configuration if needed
}
