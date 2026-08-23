package com.blooddonation.requestservice.util;

import java.util.List;
import java.util.Map;

/**
 * Standard red-blood-cell compatibility rules: for a given RECIPIENT blood
 * type, lists which DONOR blood types are safe to transfuse.
 * O- is the universal donor, AB+ is the universal recipient.
 */
public final class BloodCompatibility {

    private static final Map<String, List<String>> COMPATIBLE_DONORS = Map.of(
            "O-", List.of("O-"),
            "O+", List.of("O+", "O-"),
            "A-", List.of("A-", "O-"),
            "A+", List.of("A+", "A-", "O+", "O-"),
            "B-", List.of("B-", "O-"),
            "B+", List.of("B+", "B-", "O+", "O-"),
            "AB-", List.of("AB-", "A-", "B-", "O-"),
            "AB+", List.of("AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-")
    );

    private BloodCompatibility() {
    }

    /** Returns true if a donor of donorBloodType can safely donate to a recipient needing recipientBloodType. */
    public static boolean isCompatible(String recipientBloodType, String donorBloodType) {
        if (recipientBloodType == null || donorBloodType == null) {
            return false;
        }
        List<String> compatibleDonors = COMPATIBLE_DONORS.get(recipientBloodType.trim().toUpperCase());
        return compatibleDonors != null && compatibleDonors.contains(donorBloodType.trim().toUpperCase());
    }
}
