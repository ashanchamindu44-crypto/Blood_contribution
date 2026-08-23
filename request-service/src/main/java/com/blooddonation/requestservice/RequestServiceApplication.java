package com.blooddonation.requestservice;

import com.blooddonation.requestservice.model.BloodRequest;
import com.blooddonation.requestservice.repository.BloodRequestRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootApplication
public class RequestServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(RequestServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedRequests(BloodRequestRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.saveAll(List.of(
                        new BloodRequest("Saman Kumara", "O-", 3, "CRITICAL", "National Hospital Colombo", "Colombo", "+94 71 222 3344", "MATCHING", LocalDateTime.now()),
                        new BloodRequest("Malini Wickramasinghe", "A+", 2, "HIGH", "Teaching Hospital Kandy", "Kandy", "+94 77 444 5566", "PENDING", LocalDateTime.now()),
                        new BloodRequest("Sunil Shantha", "B+", 1, "NORMAL", "Karapitiya Hospital Galle", "Galle", "+94 78 999 1122", "FULFILLED", LocalDateTime.now())
                ));
            }
        };
    }
}
