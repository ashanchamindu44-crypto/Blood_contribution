package com.blooddonation.inventoryservice.config;

import com.blooddonation.inventoryservice.model.BloodInventory;
import com.blooddonation.inventoryservice.repository.BloodInventoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final BloodInventoryRepository repository;

    public DataSeeder(BloodInventoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        List<BloodInventory> seedData = List.of(
                new BloodInventory("A+", 45, "Central Blood Bank", now),
                new BloodInventory("A-", 12, "Central Blood Bank", now),
                new BloodInventory("B+", 38, "East Wing Vault", now),
                new BloodInventory("B-", 8, "East Wing Vault", now),
                new BloodInventory("AB+", 22, "Central Blood Bank", now),
                new BloodInventory("AB-", 5, "Central Blood Bank", now),
                new BloodInventory("O+", 60, "General Hospital Hub", now),
                new BloodInventory("O-", 4, "General Hospital Hub", now)
        );

        repository.saveAll(seedData);
    }
}
