package com.blooddonation.donorservice.service;

import com.blooddonation.donorservice.dto.DonationRequestDTO;
import com.blooddonation.donorservice.dto.DonorDTO;
import com.blooddonation.donorservice.model.DonationHistory;
import com.blooddonation.donorservice.model.Donor;
import com.blooddonation.donorservice.repository.DonationHistoryRepository;
import com.blooddonation.donorservice.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DonorService {

    private final DonorRepository donorRepository;
    private final DonationHistoryRepository donationHistoryRepository;

    @Autowired
    public DonorService(DonorRepository donorRepository, DonationHistoryRepository donationHistoryRepository) {
        this.donorRepository = donorRepository;
        this.donationHistoryRepository = donationHistoryRepository;
    }

    public List<DonorDTO> getAllDonors() {
        return donorRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public Optional<DonorDTO> getDonorById(String id) {
        return donorRepository.findById(id).map(this::mapToDTO);
    }

    public DonorDTO registerDonor(DonorDTO donorDTO) {
        if (donorRepository.findByEmail(donorDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Donor with this email already exists");
        }
        
        Donor donor = new Donor(
                donorDTO.getName(),
                donorDTO.getEmail(),
                donorDTO.getPhone(),
                donorDTO.getBloodType(),
                donorDTO.getLocation(),
                null,
                "ELIGIBLE" // default state
        );
        
        Donor savedDonor = donorRepository.save(donor);
        return mapToDTO(savedDonor);
    }

    public DonorDTO updateDonor(String id, DonorDTO donorDTO) {
        Donor donor = donorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Donor not found"));
                
        donor.setName(donorDTO.getName());
        donor.setPhone(donorDTO.getPhone());
        donor.setBloodType(donorDTO.getBloodType());
        donor.setLocation(donorDTO.getLocation());
        
        Donor updatedDonor = donorRepository.save(donor);
        return mapToDTO(updatedDonor);
    }

    public DonationHistory recordDonation(String donorId, DonationRequestDTO request) {
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new IllegalArgumentException("Donor not found"));
                
        if (!isEligibleToDonate(donorId)) {
            throw new IllegalStateException("Donor is not currently eligible to donate.");
        }

        DonationHistory history = new DonationHistory(
                donorId,
                request.getDonationDate(),
                request.getUnitsDonated(),
                request.getLocation()
        );
        
        DonationHistory savedHistory = donationHistoryRepository.save(history);
        
        donor.setLastDonationDate(request.getDonationDate());
        donor.setEligibilityStatus("INELIGIBLE");
        donorRepository.save(donor);
        
        return savedHistory;
    }

    public List<DonationHistory> getDonationHistory(String donorId) {
        return donationHistoryRepository.findByDonorId(donorId);
    }

    public boolean isEligibleToDonate(String donorId) {
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new IllegalArgumentException("Donor not found"));
                
        if (donor.getLastDonationDate() == null) {
            return true;
        }
        
        // typically, 56 days is required between donations
        long daysSinceLastDonation = ChronoUnit.DAYS.between(donor.getLastDonationDate(), LocalDate.now());
        return daysSinceLastDonation >= 56;
    }

    private DonorDTO mapToDTO(Donor donor) {
        DonorDTO dto = new DonorDTO();
        dto.setId(donor.getId());
        dto.setName(donor.getName());
        dto.setEmail(donor.getEmail());
        dto.setPhone(donor.getPhone());
        dto.setBloodType(donor.getBloodType());
        dto.setLocation(donor.getLocation());
        dto.setLastDonationDate(donor.getLastDonationDate());
        
        // Dynamic eligibility update based on time
        if (donor.getLastDonationDate() != null) {
             long daysSince = ChronoUnit.DAYS.between(donor.getLastDonationDate(), LocalDate.now());
             if (daysSince >= 56 && "INELIGIBLE".equals(donor.getEligibilityStatus())) {
                 donor.setEligibilityStatus("ELIGIBLE");
                 donorRepository.save(donor);
             }
        }
        
        dto.setEligibilityStatus(donor.getEligibilityStatus());
        return dto;
    }
}
