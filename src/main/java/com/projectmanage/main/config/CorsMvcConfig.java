package com.projectmanage.main.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsMvcConfig implements WebMvcConfigurer {


  @Value("${app.cors.enabled}")
  private boolean corsEnabled;

  @Override
  public void addCorsMappings(@NonNull CorsRegistry corsRegistry) {
    if (corsEnabled) {
      corsRegistry.addMapping("/**").exposedHeaders("Set-Cookie", "Authorization")
          .allowedOrigins("http://localhost:5173")
          .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS").allowedHeaders("*")
          .allowCredentials(true).maxAge(3600L);
    }
  }
}
