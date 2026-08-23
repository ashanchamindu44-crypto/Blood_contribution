package com.blooddonation.donorservice.repository;

import com.blooddonation.donorservice.model.DonationHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationHistoryRepository extends MongoRepository<DonationHistory, String> {
    List<DonationHistory> findByDonorId(String donorId);
}
