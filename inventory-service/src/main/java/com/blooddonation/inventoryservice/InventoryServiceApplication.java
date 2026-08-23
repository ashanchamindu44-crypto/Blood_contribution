package com.blooddonation.inventoryservice;

import com.blooddonation.inventoryservice.model.BloodInventory;
import com.blooddonation.inventoryservice.repository.BloodInventoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootApplication
public class InventoryServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedInventory(BloodInventoryRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.saveAll(List.of(
                        new BloodInventory("A+", 45, "Central Blood Bank", LocalDateTime.now()),
                        new BloodInventory("A-", 12, "Central Blood Bank", LocalDateTime.now()),
                        new BloodInventory("B+", 38, "East Wing Vault", LocalDateTime.now()),
                        new BloodInventory("B-", 8, "East Wing Vault", LocalDateTime.now()),
                        new BloodInventory("AB+", 22, "Central Blood Bank", LocalDateTime.now()),
                        new BloodInventory("AB-", 5, "Central Blood Bank", LocalDateTime.now()),
                        new BloodInventory("O+", 60, "General Hospital Hub", LocalDateTime.now()),
                        new BloodInventory("O-", 4, "General Hospital Hub", LocalDateTime.now())
                ));
            }
        };
    }
}
