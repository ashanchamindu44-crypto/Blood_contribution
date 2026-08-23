package com.blooddonation.requestservice.client;

import com.blooddonation.requestservice.dto.DonorResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

/**
 * Talks to donor-service to fetch the current donor list. Kept as its own
 * class so RequestService doesn't need to know about HTTP details.
 */
@Component
public class DonorServiceClient {

    private static final Logger log = LoggerFactory.getLogger(DonorServiceClient.class);
    private static final String API_KEY_HEADER = "X-API-KEY";

    private final RestTemplate restTemplate;

    @Value("${donor-service.url:http://localhost:8081}")
    private String donorServiceUrl;

    @Value("${api.security.key:blood_donation_secret_key_2026}")
    private String apiKey;

    public DonorServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<DonorResponseDTO> fetchAllDonors() {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set(API_KEY_HEADER, apiKey);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<DonorResponseDTO[]> response = restTemplate.exchange(
                    donorServiceUrl + "/donors",
                    HttpMethod.GET,
                    entity,
                    DonorResponseDTO[].class
            );

            DonorResponseDTO[] body = response.getBody();
            return body == null ? Collections.emptyList() : List.of(body);
        } catch (RestClientException e) {
            log.warn("Could not reach donor-service at {}: {}", donorServiceUrl, e.getMessage());
            return Collections.emptyList();
        }
    }
}
