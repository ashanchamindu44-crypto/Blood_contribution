package com.blooddonation.inventoryservice.service;

import com.blooddonation.inventoryservice.dto.InventoryDTO;
import com.blooddonation.inventoryservice.dto.InventoryUpdateRequestDTO;

import java.util.List;
import java.util.Optional;

public interface InventoryService {

    List<InventoryDTO> getAllInventory();

    Optional<InventoryDTO> getByBloodType(String bloodType);

    InventoryDTO updateStock(InventoryUpdateRequestDTO request);
}
