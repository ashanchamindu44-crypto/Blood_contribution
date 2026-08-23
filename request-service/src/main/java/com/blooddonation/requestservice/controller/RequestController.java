package com.blooddonation.requestservice.controller;

import com.blooddonation.requestservice.dto.BloodRequestDTO;
import com.blooddonation.requestservice.dto.MatchResultDTO;
import com.blooddonation.requestservice.service.RequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/requests")
@Tag(name = "Request & Matching API", description = "Submit blood requests and match them with eligible donors")
@SecurityRequirement(name = "ApiKey")
public class RequestController {

    private final RequestService requestService;

    @Autowired
    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    @Operation(summary = "Submit a blood request by recipient/hospital")
    public ResponseEntity<BloodRequestDTO> submitRequest(@RequestBody @Valid BloodRequestDTO requestDTO) {
        return new ResponseEntity<>(requestService.createRequest(requestDTO), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "List active blood requests")
    public ResponseEntity<List<BloodRequestDTO>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get request details by id")
    public ResponseEntity<?> getRequestById(@PathVariable String id) {
        return requestService.getRequestById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Supports both POST (per the service spec) and GET (?requestId=) so it
    // stays compatible with the existing client-app call in api.js.
    @RequestMapping(value = "/match", method = {RequestMethod.POST, RequestMethod.GET})
    @Operation(summary = "Match a blood request with eligible donors by blood type & location proximity")
    public ResponseEntity<?> matchDonors(@RequestParam String requestId) {
        try {
            MatchResultDTO result = requestService.matchDonorsForRequest(requestId);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
