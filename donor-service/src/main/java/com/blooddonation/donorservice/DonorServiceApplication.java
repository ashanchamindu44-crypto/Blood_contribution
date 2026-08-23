package com.blooddonation.donorservice;

import com.blooddonation.donorservice.model.Donor;
import com.blooddonation.donorservice.repository.DonorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
public class DonorServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DonorServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedDonors(DonorRepository donorRepository) {
        return args -> {
            if (donorRepository.count() == 0) {
                donorRepository.saveAll(List.of(
                        new Donor("Kasun Perera", "kasun@gmail.com", "+94 77 123 4567", "O+", "Colombo", LocalDate.of(2026, 4, 12), "ELIGIBLE"),
                        new Donor("Dilhani Silva", "dilhani@yahoo.com", "+94 71 987 6543", "A-", "Kandy", LocalDate.of(2026, 1, 20), "ELIGIBLE"),
                        new Donor("Nuwan Fernando", "nuwan@outlook.com", "+94 75 456 7890", "B+", "Galle", LocalDate.of(2026, 7, 15), "INELIGIBLE"),
                        new Donor("Sahan Jayawardena", "sahan@gmail.com", "+94 70 333 2211", "O-", "Colombo", LocalDate.of(2026, 2, 10), "ELIGIBLE"),
                        new Donor("Anusha Ranasinghe", "anusha@gmail.com", "+94 76 888 9900", "AB+", "Kurunegala", LocalDate.of(2026, 3, 5), "ELIGIBLE")
                ));
            }
        };
    }
}
