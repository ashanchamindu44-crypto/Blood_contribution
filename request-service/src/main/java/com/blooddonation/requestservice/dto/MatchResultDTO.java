package com.blooddonation.requestservice.dto;

import java.util.List;

public class MatchResultDTO {

    private String requestId;
    private String bloodTypeNeeded;
    private int unitsNeeded;
    private int matchCount;
    private List<DonorMatchDTO> matchedDonors;

    public MatchResultDTO() {
    }

    public MatchResultDTO(String requestId, String bloodTypeNeeded, int unitsNeeded,
                           List<DonorMatchDTO> matchedDonors) {
        this.requestId = requestId;
        this.bloodTypeNeeded = bloodTypeNeeded;
        this.unitsNeeded = unitsNeeded;
        this.matchedDonors = matchedDonors;
        this.matchCount = matchedDonors == null ? 0 : matchedDonors.size();
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getBloodTypeNeeded() {
        return bloodTypeNeeded;
    }

    public void setBloodTypeNeeded(String bloodTypeNeeded) {
        this.bloodTypeNeeded = bloodTypeNeeded;
    }

    public int getUnitsNeeded() {
        return unitsNeeded;
    }

    public void setUnitsNeeded(int unitsNeeded) {
        this.unitsNeeded = unitsNeeded;
    }

    public int getMatchCount() {
        return matchCount;
    }

    public void setMatchCount(int matchCount) {
        this.matchCount = matchCount;
    }

    public List<DonorMatchDTO> getMatchedDonors() {
        return matchedDonors;
    }

    public void setMatchedDonors(List<DonorMatchDTO> matchedDonors) {
        this.matchedDonors = matchedDonors;
    }
}
