package com.blooddonation.inventoryservice.controller;

import com.blooddonation.inventoryservice.dto.InventoryDTO;
import com.blooddonation.inventoryservice.dto.InventoryUpdateRequestDTO;
import com.blooddonation.inventoryservice.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/inventory")
@Tag(name = "Inventory API", description = "API for managing blood stock levels")
@SecurityRequirement(name = "ApiKey")
public class InventoryController {

    private final InventoryService inventoryService;

    @Autowired
    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    @Operation(summary = "Get stock levels for all blood types")
    public ResponseEntity<List<InventoryDTO>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @GetMapping("/{bloodType}")
    @Operation(summary = "Get stock level for a specific blood type, e.g. O-, A+")
    public ResponseEntity<?> getByBloodType(@PathVariable String bloodType) {
        return inventoryService.getByBloodType(bloodType)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/update")
    @Operation(summary = "Adjust stock for a blood type (positive amount adds, negative deducts)")
    public ResponseEntity<?> updateStock(@RequestBody @Valid InventoryUpdateRequestDTO request) {
        try {
            InventoryDTO updated = inventoryService.updateStock(request);
            return ResponseEntity.ok(updated);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
