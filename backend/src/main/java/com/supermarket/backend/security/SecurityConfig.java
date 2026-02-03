package com.supermarket.backend.security;

import com.supermarket.backend.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserRepository userRepository;

    public SecurityConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            com.supermarket.backend.model.User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("Staff member not found: " + username));
            return User.builder()
                    .username(user.getUsername())
                    .password(user.getPassword())
                    .roles(user.getRole().name())
                    .build();
        };
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. Ruhusu CORS (Maelekezo yapo chini kwenye Bean ya corsConfigurationSource)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // 2. Disable CSRF kwa sababu tunatumia API (stateless)
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // 3. Ruhusu kila kitu kwenye /api/auth/** na ruhusu OPTIONS (Preflight)
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/products/**").permitAll()
                        .requestMatchers("/api/sales/**").permitAll()
                        .requestMatchers("/api/dashboard/**").permitAll()
                        .anyRequest().authenticated()
                );
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // HAPA WEKA URL YAKO YA NETLIFY BILA "/" MWISHONI
        configuration.setAllowedOrigins(List.of(
                "https://oka-oven.netlify.app",
                "http://localhost:5173"
        ));

        // Ruhusu amri zote muhimu
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Ruhusu header zote (Content-Type, Authorization, nk)
        configuration.setAllowedHeaders(List.of("*"));

        // Ruhusu cookies/credentials kama zikihitajika
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
