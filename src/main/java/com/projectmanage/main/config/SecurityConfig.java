package com.projectmanage.main.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.projectmanage.main.service.CustomOAuth2UserService;

import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableWebSecurity
@Slf4j
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/", "/api/user/register", "/api/user/loginProc", "/api/user/profile",
                                "/api/user/logout",
                                "/login/oauth2/code/**", "/user", "/user/login", "/user/oauthLogin",
                                "/oauth2/authorization/**", "/js/**",
                                "/css/**", "/img/**")
                        .permitAll()
                        .anyRequest().authenticated())
                .formLogin((auth) -> auth.loginPage("/user/login")
                        .loginProcessingUrl("/api/user/loginProc")
                        .usernameParameter("LoginId")
                        .passwordParameter("Password")
                        .defaultSuccessUrl("/user/", true)
                        .failureUrl("/user?error=true")
                        .permitAll())

                .oauth2Login((oauth2) -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService()))
                        .successHandler(oauth2AuthenticationSuccessHandler())
                        .authorizationEndpoint(authEndpoint -> authEndpoint.baseUri("/oauth2/authorization"))
                        .redirectionEndpoint(redirectEndpoint -> redirectEndpoint.baseUri("/login/oauth2/code/**")))

                .logout((auth) -> auth.logoutUrl("/api/user/logout")
                        .invalidateHttpSession(true)
                        .logoutSuccessUrl("/user")
                        .deleteCookies("JSESSIONID")
                        .permitAll())

                .exceptionHandling(
                        (auth) -> auth.authenticationEntryPoint((req, resp, e) -> resp.sendRedirect("/user/login")))

                .csrf((auth) -> auth.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .sessionManagement(session -> session
                        .maximumSessions(1)
                        .maxSessionsPreventsLogin(true));

        return http.build();
    }

    // 개발 환경용 빈등록
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler() {
        SimpleUrlAuthenticationSuccessHandler handler = new SimpleUrlAuthenticationSuccessHandler();
        handler.setRedirectStrategy(((request, response, url) -> {
            log.info("Google Authentication");
            response.sendRedirect("/user/?oauthSuccess=true");
        }));
        return handler;
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CustomOAuth2UserService customOAuth2UserService() {
        log.info("CustomOAuth2UserService");
        return new CustomOAuth2UserService();
    }
}
