package com.blooddonation.donorservice.repository;

import com.blooddonation.donorservice.model.Donor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DonorRepository extends MongoRepository<Donor, String> {
    Optional<Donor> findByEmail(String email);
}
