package com.blooddonation.inventoryservice.service;

import com.blooddonation.inventoryservice.dto.InventoryDTO;
import com.blooddonation.inventoryservice.dto.InventoryUpdateRequestDTO;
import com.blooddonation.inventoryservice.model.BloodInventory;
import com.blooddonation.inventoryservice.repository.BloodInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InventoryServiceImpl implements InventoryService {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    private static final String DEFAULT_LOCATION = "Central Blood Bank";

    private final BloodInventoryRepository repository;

    @Autowired
    public InventoryServiceImpl(BloodInventoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<InventoryDTO> getAllInventory() {
        return repository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<InventoryDTO> getByBloodType(String bloodType) {
        return repository.findByBloodType(bloodType).map(this::mapToDTO);
    }

    @Override
    public InventoryDTO updateStock(InventoryUpdateRequestDTO request) {
        BloodInventory inventory = repository.findByBloodType(request.getBloodType())
                .orElseGet(() -> new BloodInventory(request.getBloodType(), 0, DEFAULT_LOCATION, LocalDateTime.now()));

        int newUnits = inventory.getUnits() + request.getAmount();
        if (newUnits < 0) {
            throw new IllegalStateException(
                    "Insufficient stock for " + request.getBloodType()
                            + ": have " + inventory.getUnits() + ", requested change " + request.getAmount());
        }

        inventory.setUnits(newUnits);
        inventory.setLastUpdated(LocalDateTime.now());

        BloodInventory saved = repository.save(inventory);
        return mapToDTO(saved);
    }

    private InventoryDTO mapToDTO(BloodInventory inventory) {
        return new InventoryDTO(
                inventory.getBloodType(),
                inventory.getUnits(),
                deriveStatus(inventory.getUnits()),
                inventory.getLocation(),
                inventory.getLastUpdated() != null ? inventory.getLastUpdated().format(FORMATTER) : null
        );
    }

    private String deriveStatus(int units) {
        if (units < 10) return "Critical";
        if (units < 20) return "Warning";
        return "Healthy";
    }
}
