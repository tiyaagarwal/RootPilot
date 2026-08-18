package com.rootpilot.rootpilot_backend.dto;

public class ReliabilitySummary {

    private int totalServices;
    private String mostUnreliableService;
    private int lowestReliabilityScore;
    private int sloViolations;

    public ReliabilitySummary(
            int totalServices,
            String mostUnreliableService,
            int lowestReliabilityScore,
            int sloViolations) {

        this.totalServices = totalServices;
        this.mostUnreliableService = mostUnreliableService;
        this.lowestReliabilityScore = lowestReliabilityScore;
        this.sloViolations = sloViolations;
    }

    public int getTotalServices() {
        return totalServices;
    }

    public String getMostUnreliableService() {
        return mostUnreliableService;
    }

    public int getLowestReliabilityScore() {
        return lowestReliabilityScore;
    }

    public int getSloViolations() {
        return sloViolations;
    }
}