package com.rootpilot.rootpilot_backend.dto;

public class KnowledgeGraphExecutiveSummary {

    private String graphHealth;
    private String mostInfluentialNode;
    private String criticalRelationship;
    private String relationshipRiskLevel;
    private String executiveRecommendation;

    public KnowledgeGraphExecutiveSummary(
            String graphHealth,
            String mostInfluentialNode,
            String criticalRelationship,
            String relationshipRiskLevel,
            String executiveRecommendation) {

        this.graphHealth = graphHealth;
        this.mostInfluentialNode = mostInfluentialNode;
        this.criticalRelationship = criticalRelationship;
        this.relationshipRiskLevel = relationshipRiskLevel;
        this.executiveRecommendation = executiveRecommendation;
    }

    public String getGraphHealth() {
        return graphHealth;
    }

    public void setGraphHealth(String graphHealth) {
        this.graphHealth = graphHealth;
    }

    public String getMostInfluentialNode() {
        return mostInfluentialNode;
    }

    public void setMostInfluentialNode(String mostInfluentialNode) {
        this.mostInfluentialNode = mostInfluentialNode;
    }

    public String getCriticalRelationship() {
        return criticalRelationship;
    }

    public void setCriticalRelationship(String criticalRelationship) {
        this.criticalRelationship = criticalRelationship;
    }

    public String getRelationshipRiskLevel() {
        return relationshipRiskLevel;
    }

    public void setRelationshipRiskLevel(String relationshipRiskLevel) {
        this.relationshipRiskLevel = relationshipRiskLevel;
    }

    public String getExecutiveRecommendation() {
        return executiveRecommendation;
    }

    public void setExecutiveRecommendation(String executiveRecommendation) {
        this.executiveRecommendation = executiveRecommendation;
    }
}