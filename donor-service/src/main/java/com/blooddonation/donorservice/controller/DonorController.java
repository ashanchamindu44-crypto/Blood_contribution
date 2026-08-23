package com.blooddonation.donorservice.controller;

import com.blooddonation.donorservice.dto.DonationRequestDTO;
import com.blooddonation.donorservice.dto.DonorDTO;
import com.blooddonation.donorservice.model.DonationHistory;
import com.blooddonation.donorservice.service.DonorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/donors")
@Tag(name = "Donor API", description = "API for managing donors and their donations")
@SecurityRequirement(name = "ApiKey")
public class DonorController {

    private final DonorService donorService;

    @Autowired
    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }

    @GetMapping
    @Operation(summary = "Get all donors")
    public ResponseEntity<List<DonorDTO>> getAllDonors() {
        return ResponseEntity.ok(donorService.getAllDonors());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a donor by ID")
    public ResponseEntity<DonorDTO> getDonorById(@PathVariable String id) {
        return donorService.getDonorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Register a new donor")
    public ResponseEntity<?> registerDonor(@RequestBody @Valid DonorDTO donorDTO) {
        try {
            return new ResponseEntity<>(donorService.registerDonor(donorDTO), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing donor")
    public ResponseEntity<?> updateDonor(@PathVariable String id, @RequestBody @Valid DonorDTO donorDTO) {
        try {
            return ResponseEntity.ok(donorService.updateDonor(id, donorDTO));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/donate")
    @Operation(summary = "Record a new donation for a donor")
    public ResponseEntity<?> recordDonation(@PathVariable String id, @RequestBody @Valid DonationRequestDTO request) {
        try {
            DonationHistory history = donorService.recordDonation(id, request);
            return new ResponseEntity<>(history, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/history")
    @Operation(summary = "Get donation history for a donor")
    public ResponseEntity<List<DonationHistory>> getDonationHistory(@PathVariable String id) {
        return ResponseEntity.ok(donorService.getDonationHistory(id));
    }

    @GetMapping("/{id}/eligibility")
    @Operation(summary = "Check if a donor is eligible to donate")
    public ResponseEntity<?> checkEligibility(@PathVariable String id) {
        try {
            boolean eligible = donorService.isEligibleToDonate(id);
            return ResponseEntity.ok(Map.of("donorId", id, "eligible", eligible));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
