package com.blooddonation.inventoryservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class InventoryUpdateRequestDTO {

    @NotBlank(message = "bloodType is required")
    private String bloodType;

    @NotNull(message = "amount is required")
    private Integer amount; // positive to add stock, negative to deduct

    private String timestamp; // optional, sent by client-app for logging purposes

    public InventoryUpdateRequestDTO() {
    }

    public String getBloodType() {
        return bloodType;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
