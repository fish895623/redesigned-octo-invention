package com.projectmanage.main.config;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.projectmanage.main.jwt.JWTFilter;
import com.projectmanage.main.jwt.JWTUtil;
import com.projectmanage.main.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final JWTUtil jwtUtil;
  private final UserRepository userRepository;

  @Value("${app.cors.enabled}")
  private boolean corsEnabled;

  @Bean
  SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    if (corsEnabled) {
      http.cors(corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource() {
        @Override
        public CorsConfiguration getCorsConfiguration(@NonNull HttpServletRequest request) {
          CorsConfiguration configuration = new CorsConfiguration();
          configuration.setAllowedOrigins(Collections.singletonList("http://localhost:5173"));
          configuration.setAllowedMethods(Collections.singletonList("*"));
          configuration.setAllowCredentials(true);
          configuration.setAllowedHeaders(Collections.singletonList("*"));
          configuration.setMaxAge(3600L);
          configuration.setExposedHeaders(Collections.singletonList("Authorization"));
          configuration.addExposedHeader("Set-Cookie");
          return configuration;
        }
      }));
    }
    http.csrf((auth) -> auth.disable());
    http.formLogin((auth) -> auth.disable());
    http.httpBasic((auth) -> auth.disable());
    http.addFilterBefore(new JWTFilter(jwtUtil, userRepository),
        UsernamePasswordAuthenticationFilter.class);
    http.authorizeHttpRequests((auth) -> {
      auth.requestMatchers("/", "/error", "index", "/index", "/login", "/project/**").permitAll()
          .requestMatchers("/index.html").permitAll().requestMatchers("/api/auth/login").permitAll()
          .requestMatchers("/api/auth/register").permitAll().requestMatchers("/api/auth/refresh")
          .permitAll().requestMatchers("/api/auth/status").permitAll()
          .requestMatchers("/api/auth/user").permitAll().requestMatchers("/assets/**").permitAll()
          .requestMatchers("/api/projects/**").authenticated().requestMatchers("/my")
          .hasRole("USER").anyRequest().authenticated();
    });
    http.sessionManagement(
        (session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
    return http.build();
  }

  @Bean
  AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }

  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public WebServerFactoryCustomizer<TomcatServletWebServerFactory> containerCustomizer() {
    return factory -> {
      ErrorPage error404Page = new ErrorPage(HttpStatus.NOT_FOUND, "/index.html");
      factory.addErrorPages(error404Page);
    };
  }
}
