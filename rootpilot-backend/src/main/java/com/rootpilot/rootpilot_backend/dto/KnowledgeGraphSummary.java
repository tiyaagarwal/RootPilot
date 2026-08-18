package com.rootpilot.rootpilot_backend.dto;

public class KnowledgeGraphSummary {

    private int totalNodes;
    private int totalRelationships;
    private String mostConnectedNode;
    private String strongestRelationship;
    private int strongestRelationshipStrength;

    private double graphDensity;
    private int incidentClusters;
    private String mostCommonException;

    private double graphMaturityScore;
    private double relationshipDiversityScore;
    private double graphHealthScore;

    public KnowledgeGraphSummary(
            int totalNodes,
            int totalRelationships,
            String mostConnectedNode,
            String strongestRelationship,
            int strongestRelationshipStrength,
            double graphDensity,
            int incidentClusters,
            String mostCommonException,
            double graphMaturityScore,
            double relationshipDiversityScore,
            double graphHealthScore) {

        this.totalNodes = totalNodes;
        this.totalRelationships = totalRelationships;
        this.mostConnectedNode = mostConnectedNode;
        this.strongestRelationship = strongestRelationship;
        this.strongestRelationshipStrength = strongestRelationshipStrength;
        this.graphDensity = graphDensity;
        this.incidentClusters = incidentClusters;
        this.mostCommonException = mostCommonException;
        this.graphMaturityScore = graphMaturityScore;
        this.relationshipDiversityScore = relationshipDiversityScore;
        this.graphHealthScore = graphHealthScore;
    }

    public int getTotalNodes() {
        return totalNodes;
    }

    public void setTotalNodes(int totalNodes) {
        this.totalNodes = totalNodes;
    }

    public int getTotalRelationships() {
        return totalRelationships;
    }

    public void setTotalRelationships(int totalRelationships) {
        this.totalRelationships = totalRelationships;
    }

    public String getMostConnectedNode() {
        return mostConnectedNode;
    }

    public void setMostConnectedNode(String mostConnectedNode) {
        this.mostConnectedNode = mostConnectedNode;
    }

    public String getStrongestRelationship() {
        return strongestRelationship;
    }

    public void setStrongestRelationship(String strongestRelationship) {
        this.strongestRelationship = strongestRelationship;
    }

    public int getStrongestRelationshipStrength() {
        return strongestRelationshipStrength;
    }

    public void setStrongestRelationshipStrength(int strongestRelationshipStrength) {
        this.strongestRelationshipStrength = strongestRelationshipStrength;
    }

    public double getGraphDensity() {
        return graphDensity;
    }

    public void setGraphDensity(double graphDensity) {
        this.graphDensity = graphDensity;
    }

    public int getIncidentClusters() {
        return incidentClusters;
    }

    public void setIncidentClusters(int incidentClusters) {
        this.incidentClusters = incidentClusters;
    }

    public String getMostCommonException() {
        return mostCommonException;
    }

    public void setMostCommonException(String mostCommonException) {
        this.mostCommonException = mostCommonException;
    }

    public double getGraphMaturityScore() {
        return graphMaturityScore;
    }

    public void setGraphMaturityScore(double graphMaturityScore) {
        this.graphMaturityScore = graphMaturityScore;
    }

    public double getRelationshipDiversityScore() {
        return relationshipDiversityScore;
    }

    public void setRelationshipDiversityScore(double relationshipDiversityScore) {
        this.relationshipDiversityScore = relationshipDiversityScore;
    }

    public double getGraphHealthScore() {
        return graphHealthScore;
    }

    public void setGraphHealthScore(double graphHealthScore) {
        this.graphHealthScore = graphHealthScore;
    }
}