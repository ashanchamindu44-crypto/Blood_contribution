package com.blooddonation.notificationservice.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SecurityConfig {

    @Autowired
    private ApiKeyAuthFilter apiKeyAuthFilter;

    @Bean
    public FilterRegistrationBean<ApiKeyAuthFilter> filterRegistrationBean() {
        FilterRegistrationBean<ApiKeyAuthFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(apiKeyAuthFilter);
        registrationBean.addUrlPatterns("/notify/*");
        return registrationBean;
    }
}
