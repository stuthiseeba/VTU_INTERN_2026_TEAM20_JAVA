package com.recruitment.placement_system.config;

import com.recruitment.placement_system.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                // ── Team 1: Auth endpoints (public) ───────────────────────
                .requestMatchers("/api/auth/**").permitAll()

                // ── Team 3: All PAT frontend endpoints (public) ───────────
                // No JWT for Team 3 — it uses its own session/userId flow
                .requestMatchers("/api/student/**").permitAll()
                .requestMatchers("/api/tpo/**").permitAll()
                .requestMatchers("/api/content/**").permitAll()
                .requestMatchers("/applications/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/applications/student/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/applications/drive/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/applications").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/applications/*").permitAll()

                // ── Team 2: Drive and Application endpoints (protected) ────
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
