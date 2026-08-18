package com.rootpilot.rootpilot_backend.dto;

public class KnowledgeGraphEdge {

    private String source;
    private String target;
    private String relationshipType;
    private int strength;

    public KnowledgeGraphEdge(
            String source,
            String target,
            String relationshipType,
            int strength) {

        this.source = source;
        this.target = target;
        this.relationshipType = relationshipType;
        this.strength = strength;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public String getRelationshipType() {
        return relationshipType;
    }

    public void setRelationshipType(String relationshipType) {
        this.relationshipType = relationshipType;
    }

    public int getStrength() {
        return strength;
    }

    public void setStrength(int strength) {
        this.strength = strength;
    }
}