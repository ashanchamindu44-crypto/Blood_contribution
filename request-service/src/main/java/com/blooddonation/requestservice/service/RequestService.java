package com.blooddonation.requestservice.service;

import com.blooddonation.requestservice.client.DonorServiceClient;
import com.blooddonation.requestservice.dto.BloodRequestDTO;
import com.blooddonation.requestservice.dto.DonorMatchDTO;
import com.blooddonation.requestservice.dto.DonorResponseDTO;
import com.blooddonation.requestservice.dto.MatchResultDTO;
import com.blooddonation.requestservice.model.BloodRequest;
import com.blooddonation.requestservice.repository.BloodRequestRepository;
import com.blooddonation.requestservice.util.BloodCompatibility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RequestService {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final BloodRequestRepository requestRepository;
    private final DonorServiceClient donorServiceClient;

    @Autowired
    public RequestService(BloodRequestRepository requestRepository, DonorServiceClient donorServiceClient) {
        this.requestRepository = requestRepository;
        this.donorServiceClient = donorServiceClient;
    }

    public List<BloodRequestDTO> getAllRequests() {
        return requestRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Optional<BloodRequestDTO> getRequestById(String id) {
        return requestRepository.findById(id).map(this::mapToDTO);
    }

    public BloodRequestDTO createRequest(BloodRequestDTO dto) {
        BloodRequest request = new BloodRequest(
                dto.getRecipientName(),
                dto.getBloodType().trim().toUpperCase(),
                dto.getUnits(),
                dto.getUrgency() == null || dto.getUrgency().isBlank() ? "NORMAL" : dto.getUrgency().toUpperCase(),
                dto.getHospital(),
                dto.getCity(),
                dto.getContact(),
                "PENDING",
                LocalDateTime.now()
        );

        BloodRequest saved = requestRepository.save(request);
        return mapToDTO(saved);
    }

    /**
     * Runs the matching engine for a given request: pulls the current donor
     * list from donor-service, filters by blood-type compatibility and
     * eligibility, then ranks donors in the same city first (location
     * proximity). Updates the request status based on the outcome.
     */
    public MatchResultDTO matchDonorsForRequest(String requestId) {
        BloodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found: " + requestId));

        List<DonorResponseDTO> allDonors = donorServiceClient.fetchAllDonors();

        List<DonorMatchDTO> matches = allDonors.stream()
                .filter(d -> "ELIGIBLE".equalsIgnoreCase(d.getEligibilityStatus()))
                .filter(d -> BloodCompatibility.isCompatible(request.getBloodType(), d.getBloodType()))
                .map(d -> new DonorMatchDTO(
                        d.getId(),
                        d.getName(),
                        d.getBloodType(),
                        d.getLocation(),
                        d.getPhone(),
                        d.getEmail(),
                        d.getLocation() != null && d.getLocation().equalsIgnoreCase(request.getCity())
                ))
                // donors in the same city as the hospital surface first (location proximity)
                .sorted(Comparator.comparing(DonorMatchDTO::isSameCity).reversed())
                .collect(Collectors.toList());

        request.setStatus(matches.isEmpty() ? "PENDING" : "MATCHING");
        requestRepository.save(request);

        return new MatchResultDTO(request.getId(), request.getBloodType(), request.getUnits(), matches);
    }

    private BloodRequestDTO mapToDTO(BloodRequest request) {
        BloodRequestDTO dto = new BloodRequestDTO();
        dto.setId(request.getId());
        dto.setRecipientName(request.getRecipientName());
        dto.setBloodType(request.getBloodType());
        dto.setUnits(request.getUnits());
        dto.setUrgency(request.getUrgency());
        dto.setHospital(request.getHospital());
        dto.setCity(request.getCity());
        dto.setContact(request.getContact());
        dto.setStatus(request.getStatus());
        dto.setCreatedAt(request.getCreatedAt() != null ? request.getCreatedAt().format(FORMATTER) : null);
        return dto;
    }
}
