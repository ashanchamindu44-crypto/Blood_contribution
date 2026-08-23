package com.blooddonation.requestservice.repository;

import com.blooddonation.requestservice.model.BloodRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodRequestRepository extends MongoRepository<BloodRequest, String> {
    List<BloodRequest> findByStatusNot(String status);
}
