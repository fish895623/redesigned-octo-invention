package com.projectmanage.main.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
// @EnableWebMvc
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

  @Override
  public void addViewControllers(ViewControllerRegistry registry) {
    // 정적 자원 (*.js, *.css 등)은 제외하고, 나머지 경로에 대해 index.html로 포워딩
    registry.addViewController("/{spring:[^\\.]+}").setViewName("forward:/index.html");
  }
}
