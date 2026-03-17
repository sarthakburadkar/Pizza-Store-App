package com.pizzastore.API_Gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {
	@Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow React frontend
        config.addAllowedOrigin("http://localhost:5173");
        
        // Allow these HTTP methods
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        
        // Allow all headers including Authorization
        config.addAllowedHeader("*");
        
        // Allow cookies and credentials
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = 
            new UrlBasedCorsConfigurationSource();
        
        // Apply to all routes
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}
