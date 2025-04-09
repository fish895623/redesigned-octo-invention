package com.projectmanage.main.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

  @Value("${app.cors.enabled}")
  private boolean corsEnabled;

  @Override
  public void addCorsMappings(@NonNull CorsRegistry registry) {
    if (corsEnabled) {
      registry.addMapping("/api/**").allowedOrigins("http://localhost:5173")
          .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS").allowedHeaders("*")
          .allowCredentials(true);
    }
  }

}
