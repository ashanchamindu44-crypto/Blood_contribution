package com.blooddonation.gateway.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        final String apiKeySchemeName = "apiKeyAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("API Gateway & User Auth Service API")
                        .version("1.0.0")
                        .description("Microservices API Gateway & User/Auth Service for Blood Donation System (Student 1 - Gateway Lead)")
                        .contact(new Contact().name("Gateway Lead").email("gateway@blooddonation.com")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName).addList(apiKeySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT"))
                        .addSecuritySchemes(apiKeySchemeName,
                                new SecurityScheme()
                                        .name("X-API-KEY")
                                        .type(SecurityScheme.Type.APIKEY)
                                        .in(SecurityScheme.In.HEADER)));
    }
}
