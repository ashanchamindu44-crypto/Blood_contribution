package com.blooddonation.inventoryservice.repository;

import com.blooddonation.inventoryservice.model.BloodInventory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BloodInventoryRepository extends MongoRepository<BloodInventory, String> {
    Optional<BloodInventory> findByBloodType(String bloodType);
}
